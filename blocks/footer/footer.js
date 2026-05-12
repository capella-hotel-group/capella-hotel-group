import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { getFragmentBasePath } from '../../scripts/site-config.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // ── Resolve footer fragment path ───────────────────────────────────────────
  // Option 1: meta tag set by author
  const footerMeta = getMetadata('footer');
  let footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : null;

  // Option 2: derive from URL using shared helper
  if (!footerPath) {
    const { basePath } = getFragmentBasePath();
    footerPath = `${basePath}/footer`;
  }

  let fragment = await loadFragment(footerPath);

  // Final fallback to /footer
  if (!fragment?.children?.length) {
    fragment = await loadFragment('/footer');
  }

  // Return silently if nothing loaded — hide the footer element entirely
  if (!fragment?.children?.length) {
    block.closest('footer')?.style.setProperty('display', 'none');
    return;
  }

  // Fragment has 2 sections:
  // Section 1: two <p><picture> logo elements (Capella, Patina)
  // Section 2: <ul> nav links + copyright as last <li>
  const sections = [...fragment.children];
  const logoSection = sections[0];
  const navSection = sections[1];

  // Build logos
  const logosEl = document.createElement('div');
  logosEl.className = 'footer-logos';
  const logoNames = ['capella', 'patina'];
  const logoPictures = logoSection ? [...logoSection.querySelectorAll('picture')] : [];
  logoPictures.forEach((picture, i) => {
    const logoEl = document.createElement('div');
    logoEl.className = `footer-logo footer-logo--${logoNames[i] ?? i}`;
    // Link is in the next <p> sibling after the picture's <p>
    const picturePara = picture.closest('p');
    const linkPara = picturePara?.nextElementSibling;
    const linkHref = linkPara?.querySelector('a')?.getAttribute('href');
    if (linkHref) {
      const a = document.createElement('a');
      a.href = linkHref;
      a.append(picture);
      logoEl.append(a);
    } else {
      logoEl.append(picture);
    }
    logosEl.append(logoEl);
  });

  // Build nav
  const navEl = document.createElement('nav');
  navEl.className = 'footer-nav';
  const ul = navSection ? navSection.querySelector('ul') : null;
  if (ul) {
    // Mark last li as copyright
    const lastLi = ul.querySelector('li:last-child');
    if (lastLi) lastLi.classList.add('footer-copyright');
    navEl.append(ul);
  }

  // Scroll-to-top chevron
  const chevronEl = document.createElement('button');
  chevronEl.className = 'footer-scroll-top';
  chevronEl.type = 'button';
  chevronEl.setAttribute('aria-label', 'Scroll to top');
  chevronEl.innerHTML = '<img src="/icons/icon-chevron-down.svg" alt="" />';
  chevronEl.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Assemble footer
  block.textContent = '';
  block.append(chevronEl, logosEl, navEl);
}
