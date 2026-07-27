import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (name) => readFileSync(new URL(name, import.meta.url), 'utf8');

test('page keeps the association content and all supplied images', () => {
  const html = read('index.html');

  for (let index = 1; index <= 7; index += 1) {
    assert.match(html, new RegExp(`image/image${index}\\.jpeg`));
  }

  for (const text of [
    '知行游学、以旅育人',
    '旅游路线规划大赛',
    '策划部',
    '活动部',
    '宣传部',
    '财务部',
    '人事部',
    '一针一线织暖意',
    '我的家乡我宣传',
  ]) {
    assert.ok(html.includes(text), `missing source content: ${text}`);
  }
});

test('page exposes accessible navigation and mobile-first viewport behavior', () => {
  const html = read('index.html');
  const css = read('style.css');
  const script = read('script.js');

  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(html, /aria-label="打开导航菜单"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /<main id="main-content">/);
  assert.match(css, /min-height:\s*100dvh/);
  assert.match(css, /overflow-x:\s*(?:clip|hidden)/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(script, /aria-expanded/);
  assert.match(script, /Escape/);
});

test('club directory links the tourism association to its official page', () => {
  const directory = read('../../clubs.html');
  assert.match(
    directory,
    /name:"旅游协会",cat:"文化体育类",link:"clubs\/travel-association\/index\.html"/,
  );
});

test('header keeps the directory link left, centers the logo, and shows no English copy', () => {
  const html = read('index.html');
  const css = read('style.css');
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ');

  assert.match(html, /<a class="back-link" href="\.\.\/\.\.\/clubs\.html"/);
  assert.match(html, /<a class="brand" href="#home"[^>]*>\s*<img[^>]+>\s*<span>旅游协会<\/span>\s*<\/a>/);
  assert.match(html, /<nav class="desktop-nav"[^>]*>\s*<a href="#home">首页<\/a>/);
  assert.match(html, /<nav class="mobile-nav"[^>]*>\s*<a href="#home">首页<\/a>/);
  assert.match(css, /\.brand\s*\{[^}]*position:\s*absolute;[^}]*left:\s*50%;[^}]*transform:\s*translateX\(-24px\)/s);
  assert.doesNotMatch(visibleText, /[A-Za-z]/, 'visible English copy remains on the page');
});

test('association tags stay in one full-width row on phone screens', () => {
  const css = read('style.css');

  assert.match(css, /@media \(max-width: 900px\)[\s\S]*?\.tag-strip\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(5,\s*minmax\(0,\s*1fr\)\)/);
  assert.doesNotMatch(css, /\.route-tag:last-child\s*\{[^}]*grid-column/);
  assert.match(css, /--intro-band-overlap:/);
  assert.match(css, /--hero-intro-clearance:/);
});

test('hidden back-to-top control is removed from keyboard navigation', () => {
  const html = read('index.html');
  const script = read('script.js');

  assert.match(html, /<button[^>]+id="backToTop"[^>]+hidden[^>]+disabled/);
  assert.match(script, /backToTop\.hidden\s*=\s*!showTop/);
  assert.match(script, /backToTop\.disabled\s*=\s*!showTop/);
});

test('image preview uses the browser modal focus model', () => {
  const html = read('index.html');
  const script = read('script.js');

  assert.match(html, /<dialog class="lightbox"[^>]+id="lightbox"/);
  assert.match(script, /lightbox\.showModal\(\)/);
  assert.match(script, /lightbox\.close\(\)/);
});

test('reveal content stays visible unless script explicitly prepares it', () => {
  const css = read('style.css');
  const script = read('script.js');

  assert.doesNotMatch(css, /\.reveal\s*\{[^}]*opacity:\s*0/);
  assert.match(css, /\.reveal\.is-pending\s*\{[^}]*opacity:\s*0/);
  assert.match(script, /classList\.add\('is-pending'\)/);
});
