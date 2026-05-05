import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.classList.contains('nav-drop');
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

// task 3.1: update hamburger label text and overlay visibility
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const label = nav.querySelector('.nav-hamburger-label');
  const overlay = nav.closest('.nav-wrapper')?.querySelector('.nav-overlay');

  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');

  if (label) label.textContent = expanded ? 'MENU' : 'CLOSE';
  if (overlay) overlay.classList.toggle('is-visible', !expanded && !isDesktop.matches);

  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

// task 3.4: attach/remove hover handlers for desktop mega menu
function attachHoverHandlers(navDrops) {
  navDrops.forEach((drop) => {
    const megaWrapper = drop.querySelector('.nav-mega-wrapper');
    if (!megaWrapper) return;

    let closeTimer;

    const open = () => {
      clearTimeout(closeTimer);
      drop.setAttribute('aria-expanded', 'true');
    };

    const close = (e) => {
      // Suppress close when transitioning between Hotels li and its megaWrapper
      const to = e.relatedTarget;
      if (to && (to === drop || drop.contains(to) || to === megaWrapper || megaWrapper.contains(to))) return;
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => drop.setAttribute('aria-expanded', 'false'), 80);
    };

    // store references so we can remove them later
    drop._hoverOpen = open; // eslint-disable-line no-param-reassign
    drop._hoverClose = close; // eslint-disable-line no-param-reassign

    drop.addEventListener('mouseenter', open);
    drop.addEventListener('mouseleave', close);
    megaWrapper.addEventListener('mouseenter', open);
    megaWrapper.addEventListener('mouseleave', close);
  });
}

function removeHoverHandlers(navDrops) {
  navDrops.forEach((drop) => {
    const megaWrapper = drop.querySelector('.nav-mega-wrapper');
    if (drop._hoverOpen) {
      drop.removeEventListener('mouseenter', drop._hoverOpen);
      if (megaWrapper) megaWrapper.removeEventListener('mouseenter', drop._hoverOpen);
    }
    if (drop._hoverClose) {
      drop.removeEventListener('mouseleave', drop._hoverClose);
      if (megaWrapper) megaWrapper.removeEventListener('mouseleave', drop._hoverClose);
    }
  });
}

export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // Remove any extra sections beyond brand + sections (e.g. empty nav-tools)
  while (nav.children.length > 2) nav.lastElementChild.remove();

  // Build brand: extract href from button, reuse the picture tag from the fragment
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandButton = navBrand.querySelector('.button');
    const href = brandButton?.getAttribute('href') || '/';
    const picture = navBrand.querySelector('picture');
    navBrand.innerHTML = '';
    const brandLink = document.createElement('a');
    brandLink.href = href;
    brandLink.setAttribute('aria-label', 'Capella Hotel Group home');
    if (picture) brandLink.append(picture);
    navBrand.append(brandLink);
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // Merge multiple <ul> elements in default-content-wrapper into the first one
    const wrapper = navSections.querySelector('.default-content-wrapper');
    if (wrapper) {
      const lists = [...wrapper.querySelectorAll(':scope > ul')];
      if (lists.length > 1) {
        const [first, ...rest] = lists;
        rest.forEach((ul) => {
          [...ul.children].forEach((li) => first.append(li));
          ul.remove();
        });
      }
    }

    // Wrap each sub-ul in .nav-mega-wrapper for slide-down animation
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li > ul').forEach((subUl) => {
      const megaWrapper = document.createElement('div');
      megaWrapper.className = 'nav-mega-wrapper';
      subUl.before(megaWrapper);
      megaWrapper.append(subUl);
    });

    // Insert a disabled "Home" item at the top of the mobile nav list
    const navUl = navSections.querySelector(':scope .default-content-wrapper > ul');
    if (navUl) {
      const homeItem = document.createElement('li');
      homeItem.classList.add('nav-home');
      homeItem.setAttribute('aria-disabled', 'true');
      homeItem.textContent = 'Home';
      navUl.prepend(homeItem);
    }

    const navItems = navSections.querySelectorAll(':scope .default-content-wrapper > ul > li:not(.nav-home)');

    navItems.forEach((navSection, index) => {

      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');

      // touch to expand/collapse on mobile; hover handled separately for desktop
      navSection.addEventListener('touchend', (e) => {
        if (!isDesktop.matches) {
          e.preventDefault();
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // Mobile close chevron — visible only on mobile, closes menu on click
  const navChevron = document.createElement('div');
  navChevron.className = 'nav-chevron-close';
  navChevron.innerHTML = '<button type="button" aria-label="Close navigation"><img src="/icons/icon-chevron-down.svg" alt="" /></button>';
  navChevron.addEventListener('touchend', (e) => {
    e.preventDefault();
    toggleMenu(nav, navSections, false);
  });
  navChevron.addEventListener('click', () => {
    toggleMenu(nav, navSections, false);
  });
  if (navSections) navSections.append(navChevron);
  else nav.append(navChevron);

  // task 3.1: MENU/CLOSE text toggle, no hamburger icon
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-label">MENU</span>
    </button>`;
  hamburger.addEventListener('touchend', (e) => {
    e.preventDefault();
    toggleMenu(nav, navSections);
  });
  nav.prepend(hamburger);

  // task 3.2: overlay — appended to nav-wrapper after nav
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.addEventListener('touchend', (e) => {
    e.preventDefault();
    toggleMenu(nav, navSections, true);
  });
  navWrapper.append(overlay);

  block.append(navWrapper);

  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, navSections, isDesktop.matches);

  // task 3.6: add/remove hover handlers when breakpoint changes
  const navDrops = navSections ? navSections.querySelectorAll('.nav-drop') : [];
  if (isDesktop.matches) attachHoverHandlers(navDrops);

  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, navSections, isDesktop.matches);
    if (isDesktop.matches) {
      attachHoverHandlers(navDrops);
    } else {
      removeHoverHandlers(navDrops);
    }
  });
}
