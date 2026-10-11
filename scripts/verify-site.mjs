import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const base = '.next/server/app';
const origin = 'https://space-buro-website.vercel.app';
const normalize = pathname => pathname.replace(/\/+$/, '') || '/';
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"');
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key.toLowerCase(), decode(value)]));
const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);

assert(existsSync(base), 'Run npm run build before verification.');
assert(!existsSync('.openai/hosting.json'), 'Production must not contain a test Sites binding.');

const pages = new Map(walk(base)
  .filter(file => file.endsWith('.html') && !/^(?:_|404(?:\.html|$))/.test(path.basename(file)))
  .map(file => {
    const relative = path.relative(base, file).replace(/\\/g, '/').replace(/\.html$/, '');
    const route = normalize(relative === 'index' ? '/' : `/${relative.replace(/\/index$/, '')}`);
    return [route, readFileSync(file, 'utf8')];
  }));
assert.equal(pages.size, 20, 'Expected RU/EN home, China furniture, privacy and seven projects.');

const sitemap = readFileSync(path.join(base, 'sitemap.xml.body'), 'utf8');
const robots = readFileSync(path.join(base, 'robots.txt.body'), 'utf8');
assert(/^Allow:\s*\/\s*$/m.test(robots), 'Public robots must allow crawling.');
assert(!/^Disallow:\s*\/\s*$/m.test(robots), 'Public robots must not block the site.');
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'Public sitemap declaration.');

const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(decode(match[1])));
assert.equal(sitemapUrls.length, pages.size, 'Sitemap covers every public page exactly once.');
const sitemapRoutes = new Set(sitemapUrls.map(url => {
  assert.equal(url.origin, origin, 'Sitemap production origin.');
  const route = normalize(url.pathname);
  assert(pages.has(route), `Sitemap route does not exist: ${route}`);
  return route;
}));
assert.equal(sitemapRoutes.size, pages.size, 'Sitemap has no duplicate routes.');
for (const [, href] of sitemap.matchAll(/href="([^"]+)"/g)) {
  const url = new URL(decode(href));
  assert.equal(url.origin, origin, 'Sitemap alternate production origin.');
  assert(pages.has(normalize(url.pathname)), `Missing sitemap alternate: ${url.pathname}`);
}

let links = 0;
let assets = 0;
const idsByRoute = new Map();
for (const [route, html] of pages) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => decode(match[1]));
  assert.equal(ids.length, new Set(ids).size, `${route}: duplicate IDs`);
  idsByRoute.set(route, new Set(ids));
}

function checkAsset(value, route) {
  if (!value) return;
  const url = new URL(value, `${origin}${route === '/' ? '/' : `${route}/`}`);
  if (url.origin !== origin) return;
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/_next/image') pathname = url.searchParams.get('url') ?? pathname;
  if (!pathname.startsWith('/')) return;
  const file = pathname.startsWith('/_next/') ? path.join('.next', pathname.slice('/_next/'.length)) : path.join('public', pathname);
  assert(existsSync(file), `${route}: missing local asset ${pathname}`);
  assets++;
}

for (const [route, html] of pages) {
  const lang = route === '/en' || route.startsWith('/en/') ? 'en' : 'ru';
  assert(html.includes(`<html lang="${lang}-AE">`), `${route}: language`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: single h1`);
  assert(!html.includes('space-buro-design-lab.kmarufn.chatgpt.site'), `${route}: test origin leaked`);

  const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map(match => attributes(match[0]));
  const robotsMeta = meta.find(item => item.name === 'robots')?.content ?? '';
  const directives = robotsMeta.toLowerCase().split(/[,\s]+/);
  assert(directives.includes('index') && directives.includes('follow'), `${route}: public indexing metadata`);
  assert(!meta.some(item => /^(robots|googlebot)$/i.test(item.name ?? '') && /\bno(?:index|follow)\b/i.test(item.content ?? '')), `${route}: noindex/nofollow`);

  const linkTags = [...html.matchAll(/<link\b[^>]*>/g)].map(match => attributes(match[0]));
  const canonicalHref = linkTags.find(item => item.rel === 'canonical')?.href;
  assert(canonicalHref, `${route}: canonical`);
  const canonical = new URL(canonicalHref);
  assert.equal(canonical.origin, origin, `${route}: canonical production origin`);
  assert.equal(normalize(canonical.pathname), route, `${route}: self canonical`);
  assert(sitemapRoutes.has(route), `${route}: sitemap entry`);
  for (const alternate of ['ru-AE', 'en-AE', 'x-default']) {
    const href = linkTags.find(item => item.rel === 'alternate' && item.hreflang === alternate)?.href;
    assert(href, `${route}: missing ${alternate} alternate`);
    const url = new URL(href);
    assert.equal(url.origin, origin, `${route}: alternate production origin`);
    assert(pages.has(normalize(url.pathname)), `${route}: missing alternate target`);
  }

  for (const match of html.matchAll(/<a\b[^>]*>/g)) {
    const item = attributes(match[0]);
    if (!item.href) continue;
    const url = new URL(item.href, `${origin}${route === '/' ? '/' : `${route}/`}`);
    if (url.origin !== origin) continue;
    const target = normalize(decodeURIComponent(url.pathname));
    assert(pages.has(target), `${route}: missing page ${item.href}`);
    if (url.hash) assert(idsByRoute.get(target).has(decodeURIComponent(url.hash.slice(1))), `${route}: missing fragment ${item.href}`);
    if (lang === 'en' && !item.hreflang) assert(target === '/en' || target.startsWith('/en/'), `${route}: English route lost at ${item.href}`);
    links++;
  }

  for (const match of html.matchAll(/<(img|script|link|video|source)\b[^>]*>/g)) {
    const item = attributes(match[0]);
    const tag = match[1];
    if (tag === 'link' && !['stylesheet', 'icon', 'apple-touch-icon', 'preload', 'modulepreload'].includes(item.rel)) continue;
    checkAsset(item.src ?? item.href, route);
    checkAsset(item.poster, route);
    for (const candidate of (item.srcset ?? item.imagesrcset ?? '').split(',')) {
      const value = candidate.trim().split(/\s+/)[0];
      if (value) checkAsset(value, route);
    }
  }
}

const aliases = JSON.parse(readFileSync('app/media-aliases.json', 'utf8'));
for (const source of Object.values(aliases)) checkAsset(source, '/');
console.log(`Verified ${pages.size} production pages, ${links} links/fragments and ${assets} asset references; indexing, languages, canonical URLs and sitemap passed.`);
