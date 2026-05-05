import { moveInstrumentation } from '../../scripts/scripts.js';

const ANIM_DURATION = 900;

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

    if (tab.icons.length > 0) {
      const socialEl = document.createElement('div');
      socialEl.className = 'ps-social';
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
      panel.append(socialEl);
    }

    panelsEl.append(panel);
    panelEls.push(panel);

    // Image slide (stacked absolutely inside image-stack)
    const slide = document.createElement('div');
    slide.className = 'ps-image-slide';
    slide.dataset.idx = String(idx);
    if (tab.image) slide.append(tab.image);
    imageStack.append(slide);
    imageEls.push(slide);
  });

  // Set initial active state before inserting into DOM (no transition on load)
  tabBtns[0].classList.add('ps-tab--active');
  panelEls[0].classList.add('ps-panel--active');
  imageEls[0].classList.add('ps-image-slide--active');

  // ── Tab switching ─────────────────────────────────────────────────────────────
  let leaveTimer = null;

  function activate(newIdx) {
    const oldIdx = tabBtns.findIndex((b) => b.classList.contains('ps-tab--active'));
    if (oldIdx === newIdx) return;

    // Update tab buttons
    tabBtns.forEach((b, i) => {
      b.classList.toggle('ps-tab--active', i === newIdx);
      b.setAttribute('aria-selected', String(i === newIdx));
    });

    // Swap text panels (fade)
    panelEls.forEach((p, i) => p.classList.toggle('ps-panel--active', i === newIdx));

    // Image: keep old slide visible and behind (--leaving), expand new on top
    clearTimeout(leaveTimer);

    // Clear any stale --leaving state from a previous rapid switch
    imageEls.forEach((el, i) => {
      if (i !== oldIdx) el.classList.remove('ps-image-slide--leaving');
    });

    if (oldIdx !== -1) {
      imageEls[oldIdx].classList.remove('ps-image-slide--active');
      imageEls[oldIdx].classList.add('ps-image-slide--leaving');
    }

    imageEls[newIdx].classList.add('ps-image-slide--active');

    // After animation, reset old slide to hidden (it's fully covered, so invisible)
    leaveTimer = setTimeout(() => {
      if (oldIdx !== -1) imageEls[oldIdx].classList.remove('ps-image-slide--leaving');
    }, ANIM_DURATION + 50);
  }

  tabBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.ps-tab[data-idx]');
    if (!btn) return;
    activate(Number(btn.dataset.idx));
  });

  const leftCol = document.createElement('div');
  leftCol.className = 'ps-left';
  leftCol.append(titleEl, tabBar, panelsEl);

  block.replaceChildren(leftCol, imageStack);
}
