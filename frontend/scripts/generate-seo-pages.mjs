import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, 'dist', 'spa');
const template = await readFile(path.join(outputRoot, 'index.html'), 'utf8');
const config = JSON.parse(await readFile(path.join(projectRoot, 'seo-pages.json'), 'utf8'));

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function replaceMeta(html, attribute, key, value) {
  const pattern = new RegExp(
    `<meta(?=[^>]*\\b${attribute}=(?:"${key}"|'${key}'|${key})(?:\\s|>))[^>]*>`,
    'i',
  );
  const replacement = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  if (!pattern.test(html)) throw new Error(`Missing ${attribute} metadata: ${key}`);
  return html.replace(pattern, replacement);
}

function renderPage(page) {
  const canonical = new URL(page.path, config.siteOrigin).toString();
  let html = template.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(page.title)}</title>`,
  );

  html = replaceMeta(html, 'name', 'description', page.description);
  html = replaceMeta(html, 'property', 'og:title', page.title);
  html = replaceMeta(html, 'property', 'og:description', page.description);
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'name', 'twitter:title', page.title);
  html = replaceMeta(html, 'name', 'twitter:description', page.description);

  const canonicalPattern =
    /<link(?=[^>]*\brel=(?:"canonical"|'canonical'|canonical)(?:\s|>))[^>]*>/i;
  if (!canonicalPattern.test(html)) throw new Error('Missing canonical link');
  return html.replace(canonicalPattern, `<link rel="canonical" href="${escapeHtml(canonical)}" />`);
}

for (const page of config.pages) {
  if (page.path === '/') continue;
  const directory = path.join(outputRoot, page.path.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), renderPage(page), 'utf8');
}

console.log(`Generated ${config.pages.length - 1} route-specific SEO entry pages.`);
