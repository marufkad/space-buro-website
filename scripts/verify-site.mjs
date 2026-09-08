import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const base = '.next/server/app';
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]);
const files = walk(base).filter(f => f.endsWith('.html') && !path.basename(f).startsWith('_'));
let checked = 0;
const sitemap = readFileSync(path.join(base,'sitemap.xml.body'),'utf8');
const robots = readFileSync(path.join(base,'robots.txt.body'),'utf8');
assert(robots.includes('Sitemap: https://www.space-buro.ae/sitemap.xml'));
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
for (const file of files) {
  if (file.includes('china-furniture-sourcing')) continue;
  const relative = path.relative(base,file).replace(/\.html$/,'');
  const route = relative === 'index' ? '/' : '/'+relative;
  const html = readFileSync(file,'utf8');
  const lang = route.startsWith('/en') ? 'en' : 'ru';
  assert(html.includes(`<html lang="${lang}-AE">`), `${route}: html language`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)[1];
  assert.equal(new URL(canonical).href, new URL(route,'https://www.space-buro.ae').href, `${route}: self canonical`);
  assert(urls.some(url=>new URL(url).href===new URL(canonical).href), `${route}: sitemap entry`);
  assert(html.includes('hrefLang="en-AE"') && html.includes('hrefLang="ru-AE"'), `${route}: alternate languages`);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${route}: single h1`);
  for (const match of html.matchAll(/<a\b[^>]*>/g)) {
    const hrefMatch=match[0].match(/href="([^"#]+)"/);
    if(!hrefMatch) continue;
    const href = hrefMatch[1].split('#')[0].split('?')[0];
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const target = path.join(base,(href==='/'?'index':href.slice(1))+'.html');
    assert(existsSync(target), `${route}: broken link ${href}`);
    if (lang==='en' && !/hreflang=/i.test(match[0])) assert(href.startsWith('/en'),`${route}: loses English at ${href}`);
  }
  for (const match of html.matchAll(/url%3D|\/_next\/image\?url=([^&"]+)/g)) {
    if (!match[1]) continue;
    const src=decodeURIComponent(match[1]);
    if(src.startsWith('/')) assert(existsSync('public'+src),`${route}: missing image ${src}`);
  }
  checked++;
}
assert.equal(checked,20,'Expected RU and EN: home, China, privacy, seven projects');
assert(!sitemap.includes('dubai-creek-harbour') && !sitemap.includes('port-de-la-mer') && !sitemap.includes('china-furniture-sourcing'));
const aliases=JSON.parse(readFileSync('app/media-aliases.json','utf8'));
for(const src of Object.values(aliases))assert(existsSync('public'+src),`Missing canonical photo: ${src}`);
console.log(`Verified ${checked} pages: languages, canonical, hreflang, sitemap, internal links and rendered images.`);
