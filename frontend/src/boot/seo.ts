import { defineBoot } from '#q-app';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import seoConfig from '../../seo-pages.json';

const SITE_ORIGIN = seoConfig.siteOrigin;
const DEFAULT_IMAGE = new URL(seoConfig.defaultImage, SITE_ORIGIN).toString();
const INDEX_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const LEGACY_PUBLIC_PATHS = new Set([
  '/home',
  '/courses',
  '/promotions',
  '/resources',
  '/about-us',
]);

function upsertMeta(attribute: 'name' | 'property', key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertCanonical(url: string): void {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = url;
}

function applySeo(route: RouteLocationNormalizedLoaded): void {
  const seo = route.meta.seo;
  if (!seo) return;

  const canonicalUrl = seo.canonicalPath
    ? new URL(seo.canonicalPath, SITE_ORIGIN).toString()
    : undefined;
  const image = seo.image || DEFAULT_IMAGE;
  const robots = seo.robots || INDEX_ROBOTS;

  document.title = seo.title;
  document.documentElement.lang = seo.lang || 'th';

  upsertMeta('name', 'description', seo.description);
  upsertMeta('name', 'robots', robots);
  upsertMeta('property', 'og:title', seo.title);
  upsertMeta('property', 'og:description', seo.description);
  upsertMeta('property', 'og:image', image);
  upsertMeta('name', 'twitter:title', seo.title);
  upsertMeta('name', 'twitter:description', seo.description);
  upsertMeta('name', 'twitter:image', image);

  if (canonicalUrl) {
    upsertCanonical(canonicalUrl);
    upsertMeta('property', 'og:url', canonicalUrl);
  } else {
    document.head.querySelector('link[rel="canonical"]')?.remove();
    document.head.querySelector('meta[property="og:url"]')?.remove();
  }
}

export default defineBoot(async ({ router }) => {
  if (typeof window === 'undefined') return;

  // Preserve old shared links such as /#/courses after moving to History API URLs.
  const legacyPath = window.location.hash.startsWith('#/') ? window.location.hash.slice(1) : '';
  if (LEGACY_PUBLIC_PATHS.has(legacyPath)) {
    await router.replace(legacyPath === '/home' ? '/' : legacyPath);
  }

  applySeo(router.currentRoute.value);
  router.afterEach((to) => applySeo(to));
});
