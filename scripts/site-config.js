// ── Shared site/lang constants ────────────────────────────────────────────────

/** First pathname segment values that identify a known site. */
export const SUPPORTED_SITES = ['global', 'bangkok', 'sanya', 'test-pages'];

/** Language codes that require RTL text direction. */
export const RTL_LANGS = ['ar', 'he', 'fa', 'ur'];

/**
 * Valid ISO 639-1 language primaries supported by this site.
 * Used to distinguish language codes (ar, en) from market/country codes (qa, sa, ae).
 */
export const VALID_LANG_PRIMARIES = new Set([
  'ar', 'en', 'fr', 'de', 'ja', 'ko', 'zh',
  'he', 'fa', 'ur', 'it', 'es', 'pt', 'ru',
  'nl', 'tr', 'hi', 'vi', 'th', 'id', 'ms',
]);

/**
 * Resolves the base fragment path (/{site}/{lang}) from window.location.pathname.
 * Falls back to /global/{lang} if no site segment is found.
 * Lang slug is stored lowercase as-is from the URL.
 * @returns {{ site: string, lang: string, basePath: string }}
 */
export function getFragmentBasePath() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  let site = 'global';
  let lang = 'en';
  let idx = 0;

  if (parts[0] && SUPPORTED_SITES.includes(parts[0].toLowerCase())) {
    site = parts[0].toLowerCase();
    idx = 1;
  }

  if (parts[idx] && VALID_LANG_PRIMARIES.has(parts[idx].toLowerCase())) {
    lang = parts[idx].toLowerCase();
  }

  return { site, lang, basePath: `/${site}/${lang}` };
}
