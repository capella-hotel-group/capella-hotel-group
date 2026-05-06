import { moveInstrumentation } from '../../scripts/scripts.js';

const ANIM_DURATION = 900;

function easeOut(t) {
  return 1 - (1 - t) ** 3;
}

function rowType(row) {
  if (row.dataset.aueModel === 'promo-showcase-tab') return 'tab';
  if (row.dataset.aueModel === 'promo-showcase-share-icon') return 'icon';
  const n = row.children.length;
  if (n >= 4) return 'tab';
  if (n >= 2) return 'icon';
  return 'unknown';
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Row 0: block-level title
  const titleText = rows[0]?.textContent?.trim() ?? '';

  // Parse item rows into tabs (with nested share icons)
  const tabs = [];
  rows.slice(1).forEach((row) => {
    const type = rowType(row);
    if (type === 'tab') {
      const cells = [...row.children];
      tabs.push({
        row,
        logo: cells[0]?.querySelector('picture') ?? null,
        label: cells[1]?.textContent?.trim() ?? '',
        descHTML: cells[2]?.innerHTML ?? '',
        image: cells[3]?.querySelector('picture') ?? null,
        icons: [],
      });
    } else if (type === 'icon' && tabs.length > 0) {
      const cells = [...row.children];
      const icon = cells[0]?.querySelector('picture') ?? null;
      const url = cells[1]?.querySelector('a')?.href
        ?? cells[1]?.textContent?.trim()
        ?? '#';
      const name = cells[2]?.textContent?.trim() ?? '';
      tabs[tabs.length - 1].icons.push({ row, icon, url, name });
    }
  });

  if (tabs.length === 0) return;

  // ── Title ───────────────────────────────────────────────────────────────────
  const titleEl = document.createElement('h2');
  titleEl.className = 'ps-title';
  titleEl.textContent = titleText;

  // ── Tab bar ──────────────────────────────────────────────────────────────────
  const tabBar = document.createElement('div');
  tabBar.className = 'ps-tabs';
  tabBar.setAttribute('role', 'tablist');

  // ── Text panels ──────────────────────────────────────────────────────────────
  const panelsEl = document.createElement('div');
  panelsEl.className = 'ps-panels';

  // ── Single shared social bar ─────────────────────────────────────────────────
  const socialEl = document.createElement('div');
  socialEl.className = 'ps-social';

  // ── Image stack ──────────────────────────────────────────────────────────────
  const imageStack = document.createElement('div');
  imageStack.className = 'ps-image-stack';
  imageStack.setAttribute('aria-hidden', 'true');

  const tabBtns = [];
  const panelEls = [];
  const imageEls = [];

  tabs.forEach((tab, idx) => {
    // Vertical divider between tabs
    if (idx > 0) {
      const divider = document.createElement('span');
      divider.className = 'ps-tab-divider';
      divider.setAttribute('aria-hidden', 'true');
      tabBar.append(divider);
    }

    // Tab button
    const btn = document.createElement('button');
    btn.className = 'ps-tab';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(idx === 0));
    btn.setAttribute('aria-controls', `ps-panel-${idx}`);
    btn.dataset.idx = String(idx);
    if (tab.logo) btn.append(tab.logo);
    moveInstrumentation(tab.row, btn);
    tabBar.append(btn);
    tabBtns.push(btn);

    // Text panel
    const panel = document.createElement('div');
    panel.className = 'ps-panel';
    panel.id = `ps-panel-${idx}`;
    panel.setAttribute('role', 'tabpanel');

    const brandTitle = document.createElement('h3');
    brandTitle.className = 'ps-brand-title';
    brandTitle.textContent = tab.label;

    const desc = document.createElement('div');
    desc.className = 'ps-description';
    desc.innerHTML = tab.descHTML;

    panel.append(brandTitle, desc);

    panelsEl.append(panel);
    panelEls.push(panel);

    // Add all icons from this tab into the shared social bar
    tab.icons.forEach(({ row: iconRow, icon, url, name }) => {
      const a = document.createElement('a');
      a.className = 'ps-social-link';
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      if (name) a.setAttribute('aria-label', name);
      if (icon) a.append(icon);
      moveInstrumentation(iconRow, a);
      socialEl.append(a);
    });

    // Image slide (stacked absolutely inside image-stack)
    const slide = document.createElement('div');
    slide.className = 'ps-image-slide';
    slide.dataset.idx = String(idx);
    if (tab.image) slide.append(tab.image);
    imageStack.append(slide);
    imageEls.push(slide);
  });

  // Set initial active state before inserting into DOM
  tabBtns[0].classList.add('ps-tab--active');
  panelEls[0].classList.add('ps-panel--active');
  // Hide inactive panels immediately (no animation on load)
  panelEls.forEach((p, i) => { if (i !== 0) p.classList.add('ps-panel--hidden'); });

  // ResizeObserver keeps container height in sync with the active panel's content
  // (handles init, font-load, and window resize reliably)
  let observedPanelIdx = 0;
  const panelObserver = new ResizeObserver(() => {
    panelsEl.style.height = `${panelEls[observedPanelIdx].scrollHeight}px`;
  });
  panelObserver.observe(panelEls[0]);

  // ── RAF image animation ───────────────────────────────────────────────────────
  // clip% per slide: 0 = fully visible, 100 = fully hidden
  const clipPct = tabs.map((_, i) => (i === 0 ? 0 : 100));

  function applyClip(idx, pct) {
    clipPct[idx] = pct;
    imageEls[idx].style.clipPath = `inset(0 ${pct}% 0 0)`;
  }

  // Initialise inline styles (no CSS transition needed)
  imageEls.forEach((el, i) => {
    applyClip(i, clipPct[i]);
    el.style.zIndex = i === 0 ? 2 : 1;
  });

  let rafId = null;
  // fgIdx: slide currently on top (z=2) and tweening. -1 = no animation running.
  // activeIdx: the "base" slide — always clip=0, z=1, never touched by tween.
  let activeIdx = 0;
  let fgIdx = -1;
  let fgTarget = 0;   // 0 = expanding (clip→0), 100 = collapsing (clip→100)
  let tweenFromClip = 100;
  let tweenStart = 0;

  function tick(now) {
    const t = Math.min(1, (now - tweenStart) / ANIM_DURATION);
    const pct = tweenFromClip + (fgTarget - tweenFromClip) * easeOut(t);
    applyClip(fgIdx, pct);

    if (t < 1) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    rafId = null;

    if (fgTarget === 0) {
      // fg fully expanded → promote to new bg, hide old bg
      applyClip(activeIdx, 100);
      imageEls[activeIdx].style.zIndex = 1;
      activeIdx = fgIdx;
      imageEls[activeIdx].style.zIndex = 1;
      fgIdx = -1;
    } else {
      // fg fully collapsed → hide it, active bg unchanged
      imageEls[fgIdx].style.zIndex = 1;
      fgIdx = -1;
    }
  }

  // Panel animation timings (ms)
  const FADE_MS = 300;

  let panelTimer1 = null;
  let panelTimer2 = null;

  // ── Tab switching ─────────────────────────────────────────────────────────────
  function activate(newIdx) {
    const oldIdx = tabBtns.findIndex((b) => b.classList.contains('ps-tab--active'));
    if (oldIdx === newIdx) return;

    // Update tab buttons immediately
    tabBtns.forEach((b, i) => {
      b.classList.toggle('ps-tab--active', i === newIdx);
      b.setAttribute('aria-selected', String(i === newIdx));
    });

    // Cancel any in-flight sequence
    clearTimeout(panelTimer1);
    clearTimeout(panelTimer2);

    // Step 1: fade out old panel
    panelEls[oldIdx].classList.remove('ps-panel--active');

    panelTimer1 = setTimeout(() => {
      // Step 2: hide old, update height, show + fade in new
      panelEls[oldIdx].classList.add('ps-panel--hidden');
      panelObserver.unobserve(panelEls[oldIdx]);

      panelEls[newIdx].classList.remove('ps-panel--hidden');
      panelsEl.style.height = `${panelEls[newIdx].scrollHeight}px`;
      panelEls[newIdx].getBoundingClientRect(); // force reflow

      panelObserver.observe(panelEls[newIdx]);
      observedPanelIdx = newIdx;

      panelTimer2 = setTimeout(() => {
        panelEls[newIdx].classList.add('ps-panel--active');
      }, 16); // 1 frame to ensure transition fires
    }, FADE_MS);

    if (fgIdx === newIdx) {
      // Same fg slide — reverse toward expand
      tweenFromClip = clipPct[fgIdx];
      fgTarget = 0;
      tweenStart = performance.now();
      if (!rafId) rafId = requestAnimationFrame(tick);
      return;
    }

    if (newIdx === activeIdx) {
      // Going back to bg while fg is open — collapse fg
      tweenFromClip = clipPct[fgIdx];
      fgTarget = 100;
      tweenStart = performance.now();
      if (!rafId) rafId = requestAnimationFrame(tick);
      return;
    }

    // Different slide — snap any current fg away (rare: >2 tabs), start fresh
    if (fgIdx !== -1) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      applyClip(fgIdx, 100);
      imageEls[fgIdx].style.zIndex = 1;
      fgIdx = -1;
    }

    // Ensure bg is correct
    applyClip(activeIdx, 0);
    imageEls[activeIdx].style.zIndex = 1;

    // Start fg
    fgIdx = newIdx;
    imageEls[fgIdx].style.zIndex = 2;
    tweenFromClip = clipPct[fgIdx];
    fgTarget = 0;
    tweenStart = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  // ── Auto-advance ─────────────────────────────────────────────────────────────
  const AUTO_INTERVAL = 6000;
  let autoTimer = null;

  function scheduleAuto() {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => {
      const nextIdx = (tabBtns.findIndex((b) => b.classList.contains('ps-tab--active')) + 1) % tabs.length;
      activate(nextIdx);
      scheduleAuto();
    }, AUTO_INTERVAL);
  }

  scheduleAuto();

  tabBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.ps-tab[data-idx]');
    if (!btn) return;
    activate(Number(btn.dataset.idx));
    scheduleAuto(); // reset timer on manual switch
  });

  // ── Scroll parallax ───────────────────────────────────────────────────────────
  const PARALLAX_RANGE = 15; // % shift each direction

  function updateParallax() {
    const rect = block.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when block center is at viewport center (most visible) → offset = 0
    // shifts ±PARALLAX_RANGE% as block scrolls through viewport
    const centerOffset = (rect.top + rect.height / 2) - vh / 2;
    const maxOffset = (vh + rect.height) / 2;
    const progress = centerOffset / maxOffset; // -1 to +1
    const clamped = Math.max(-1, Math.min(1, progress));
    const offset = clamped * PARALLAX_RANGE;
    imageEls.forEach((slide) => {
      const img = slide.querySelector('img');
      if (img) img.style.transform = `translateY(${offset}%)`;
    });
  }

  let parallaxRaf = null;
  const onScroll = () => {
    if (parallaxRaf) return;
    parallaxRaf = requestAnimationFrame(() => {
      updateParallax();
      parallaxRaf = null;
    });
  };

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealImgs = () => {
      updateParallax();
      // Recalc after 300ms for late-settling layouts, then fade in at correct position
      setTimeout(() => {
        updateParallax();
        requestAnimationFrame(() => {
          imageEls.forEach((slide) => {
            const img = slide.querySelector('img');
            if (img) {
              img.style.transition = 'opacity 0.5s ease';
              img.style.opacity = '1';
            }
          });
          setTimeout(() => {
            imageEls.forEach((slide) => {
              const img = slide.querySelector('img');
              if (img) img.style.transition = '';
            });
          }, 500);
        });
      }, 300);
    };

    // window.load = images/fonts loaded → layout stable
    // If already complete (e.g. cached page), call immediately
    if (document.readyState === 'complete') {
      revealImgs();
    } else {
      window.addEventListener('load', revealImgs, { once: true });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const leftCol = document.createElement('div');
  leftCol.className = 'ps-left';
  leftCol.append(titleEl, tabBar, panelsEl, socialEl);

  block.replaceChildren(leftCol, imageStack);
}
