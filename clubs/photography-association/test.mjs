import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (name) => readFileSync(new URL(name, import.meta.url), 'utf8');
const brandMarkup = /<a class="brand" href="#home"[^>]*>\s*<img src="image\/3\.png" alt="摄影协会标志">\s*<span>云南农业大学摄影协会<\/span>\s*<\/a>/;

test('page preserves the photography association material and uses every supplied image', () => {
  const html = read('index.html');

  for (const image of ['3.png', '11.jpeg', '14.jpeg', '17.jpeg', '20.jpeg', '24.png', '32.jpeg', '35.jpeg', '38.jpeg', '42.png', '50.jpeg', '53.png', '56.jpeg']) {
    assert.ok(html.includes(`image/${image}`), `missing supplied image: ${image}`);
  }

  for (const text of [
    '摄影社团是面向学校热爱光影艺术的学生们搭建的兴趣平台。',
    '宣传部',
    '策划部',
    '活动部',
    'vivo 摄影大赛',
    'vivo 摄影外拍活动',
    '尼康沙龙分享',
    '博士摄影绘画展',
    '2023 最佳社团奖',
  ]) {
    assert.ok(html.includes(text), `missing source content: ${text}`);
  }
});

test('page provides an accessible, full-screen mobile-first hero', () => {
  const html = read('index.html');
  const css = read('style.css');
  const script = read('script.js');

  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /aria-label="打开导航菜单"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /<dialog class="lightbox" id="lightbox"/);
  assert.match(css, /min-height:\s*100svh/);
  assert.match(css, /min-height:\s*100dvh/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /overflow-x:\s*(?:clip|hidden)/);
  assert.match(script, /aria-expanded/);
  assert.match(script, /Escape/);
  assert.match(script, /lightbox\.showModal\(\)/);
  assert.match(script, /lightbox\.close\(\)/);
});

test('club directory links the photography association to its official page', () => {
  const directory = read('../../clubs.html');

  assert.match(
    directory,
    /name:"摄影协会",cat:"文化体育类",link:"clubs\/photography-association\/index\.html"/,
  );
});

test('page uses Chinese-only visible copy and keeps the original logo treatment', () => {
  const html = read('index.html');
  const css = read('style.css');
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ');

  assert.doesNotMatch(visibleText, /YNAU PHOTOGRAPHY ASSOCIATION|ABOUT|TEAM|EVENTS|MOMENTS|HONOR/, 'English section copy remains on the page');
  assert.match(html, brandMarkup);
  assert.doesNotMatch(css, /\.brand img\s*\{[^}]*filter:/s, 'logo must not be recolored');
  assert.doesNotMatch(css, /\.brand img\s*\{[^}]*mix-blend-mode:/s, 'logo must not use blend modes');
});

test('mobile navigation opens below the header without covering the viewport', () => {
  const html = read('index.html');
  const css = read('style.css');
  const script = read('script.js');

  const mobileNavRule = css.match(/@media \(max-width: 900px\)[\s\S]*?\.site-nav\s*\{([^}]*)\}/)?.[1] ?? '';

  assert.match(mobileNavRule, /top:\s*100%/);
  assert.match(mobileNavRule, /width:\s*100vw/);
  assert.match(mobileNavRule, /height:\s*auto/);
  assert.match(mobileNavRule, /visibility:\s*hidden/);
  assert.doesNotMatch(mobileNavRule, /100dvh|100vh|url\(/, 'mobile menu must be a compact dropdown, not a full-screen cover');
  assert.match(css, /\.site-nav\.is-open\s*\{[^}]*visibility:\s*visible/);
  assert.match(script, /function setMenuOpen\(open, restoreFocus = false\)/);
  assert.match(script, /siteNav\.inert\s*=/);
  assert.doesNotMatch(script, /document\.body\.classList\.toggle\('menu-open'/);
  assert.match(script, /menuBreakpoint\.addEventListener\('change'/);
});

test('footer has no contact link', () => {
  const html = read('index.html');

  assert.doesNotMatch(html, /联系协会|tel:18381027271/);
});

test('header centers the original logo and the full association name as one group', () => {
  const html = read('index.html');
  const css = read('style.css');

  assert.match(html, brandMarkup);
  assert.match(css, /\.brand\s*\{[^}]*left:\s*50%;[^}]*transform:\s*translateX\(-50%\)/s);
  assert.match(css, /\.brand span\s*\{[^}]*white-space:\s*nowrap/);
});
