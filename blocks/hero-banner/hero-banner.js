export default function decorate(block) {
  const rows = [...block.children];
  // Model fields: 0=mediaAsset, 1=logo, 2=alt, 3=content
  const bgPicture = rows[0]?.querySelector('picture');
  const logoPicture = rows[1]?.querySelector('picture');
  const altText = rows[2]?.firstElementChild?.textContent?.trim() || '';
  const contentEl = rows[3]?.firstElementChild;

  if (altText && bgPicture) {
    const img = bgPicture.querySelector('img');
    if (img) img.alt = altText;
  }

  block.innerHTML = '';

  // Background image
  if (bgPicture) {
    bgPicture.className = 'hero-banner-bg';
    block.append(bgPicture);
  }

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'hero-banner-overlay';

  // Logo
  if (logoPicture) {
    const logoWrap = document.createElement('div');
    logoWrap.className = 'hero-banner-logo';
    logoWrap.append(logoPicture);
    overlay.append(logoWrap);
  }

  // Content
  if (contentEl?.textContent?.trim()) {
    const content = document.createElement('div');
    content.className = 'hero-banner-content';
    content.innerHTML = contentEl.innerHTML;
    overlay.append(content);
  }

  // Scroll chevron
  const chevron = document.createElement('div');
  chevron.className = 'hero-banner-chevron';
  chevron.setAttribute('aria-label', 'Scroll down');
  chevron.setAttribute('role', 'button');
  chevron.setAttribute('tabindex', '0');
  chevron.addEventListener('click', () => {
    window.scrollTo({ top: block.offsetHeight, behavior: 'smooth' });
  });
  overlay.append(chevron);

  block.append(overlay);
}
