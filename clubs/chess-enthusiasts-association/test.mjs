import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (name) => readFileSync(new URL(name, import.meta.url), 'utf8');

test('page preserves the supplied association content and all ten images', () => {
  const html = read('index.html');

  for (let index = 1; index <= 10; index += 1) {
    assert.match(html, new RegExp(`image/image${index}\\.jpeg`));
  }

  for (const text of [
    '以棋会友，乐在棋中',
    '技术部',
    '活动部',
    '外联部',
    '宣传部',
    '纪检部',
    '第四届耕读文化节棋类比赛',
    '棋类交流活动',
    '第一次五子棋交流会',
    '第一次象棋交流会',
  ]) {
    assert.ok(html.includes(text), `missing source content: ${text}`);
  }

  assert.doesNotMatch(html, /第三届耕读文化节/);
  assert.doesNotMatch(html, /id="honors"|class="[^"]*honors/);
});

test('page provides accessible navigation and a full phone viewport hero', () => {
  const html = read('index.html');
  const css = read('style.css');
  const script = read('script.js');

  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /aria-label="打开导航菜单"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(css, /min-height:\s*100svh/);
  assert.match(css, /min-height:\s*100dvh/);
  assert.match(css, /overflow-x:\s*(?:clip|hidden)/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media\s*\(max-width:\s*640px\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(script, /aria-expanded/);
  assert.match(script, /Escape/);
});

test('club directory links the association to its official page', () => {
  const directory = read('../../clubs.html');
  assert.match(
    directory,
    /name:"棋迷者协会",cat:"文化体育类",link:"clubs\/chess-enthusiasts-association\/index\.html"/,
  );
});

test('hero and navigation keep the association identity visible without English copy', () => {
  const html = read('index.html');
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ');

  assert.match(html, /<h1[^>]*>棋迷者协会<\/h1>/);
  assert.match(html, /<a class="back-link" href="\.\.\/\.\.\/clubs\.html"/);
  assert.match(html, /<nav class="desktop-nav"/);
  assert.match(html, /<nav class="mobile-nav"/);
  assert.doesNotMatch(visibleText, /[A-Za-z]/, 'visible English copy remains on the page');
});

test('hidden floating controls stay outside keyboard navigation', () => {
  const html = read('index.html');
  const script = read('script.js');

  assert.match(html, /<button[^>]+id="backToTop"[^>]+hidden[^>]+disabled/);
  assert.match(script, /backToTop\.hidden\s*=\s*!showTop/);
  assert.match(script, /backToTop\.disabled\s*=\s*!showTop/);
});

test('desktop hero presents the complete poster on a light editorial canvas', () => {
  const css = read('style.css');

  assert.match(css, /\.hero\s*\{[^}]*display:\s*grid/s);
  assert.match(css, /\.hero\s*\{[^}]*grid-template-columns:\s*minmax\(64px,\s*1fr\)\s*minmax\(0,\s*calc\(\(100dvh\s*-\s*var\(--header-height\)\)\s*\*\s*0\.823\)\)\s*minmax\(360px,\s*1fr\)/s);
  assert.match(css, /\.hero-image\s*\{[^}]*position:\s*relative[^}]*object-fit:\s*contain/s);
  assert.match(css, /\.hero-image\s*\{[^}]*height:\s*calc\(100dvh\s*-\s*var\(--header-height\)\)[^}]*box-shadow:\s*none/s);
  assert.match(css, /\.hero-copy\s*\{[^}]*display:\s*flex/s);
  assert.match(css, /\.hero-copy\s*\{[^}]*background:\s*transparent/s);
  assert.match(css, /\.hero-copy\s*\{[^}]*color:\s*var\(--ink\)/s);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.hero-image\s*\{[^}]*object-fit:\s*cover/s);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.hero-paper\s*\{[^}]*background-color:\s*var\(--paper\)/s);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.site-header\s*\{[^}]*background:\s*rgba\(248,\s*245,\s*236/s);
});

test('wide desktop hero copy and chess tags are prominent', () => {
  const css = read('style.css');

  assert.match(css, /@media \(min-width: 1101px\)[\s\S]*?\.hero-copy \.eyebrow\s*\{[^}]*font-size:\s*15px/s);
  assert.match(css, /@media \(min-width: 1101px\)[\s\S]*?\.hero h1\s*\{[^}]*font-size:\s*clamp\(56px,\s*4\.1vw,\s*64px\)/s);
  assert.match(css, /@media \(min-width: 1101px\)[\s\S]*?\.hero-motto\s*\{[^}]*font-size:\s*24px/s);
  assert.match(css, /@media \(min-width: 1101px\)[\s\S]*?\.hero-copy \.piece-tags span\s*\{[^}]*min-height:\s*36px[^}]*padding:\s*4px\s+12px[^}]*font-size:\s*14px/s);
  assert.match(css, /@media \(min-width: 1101px\)[\s\S]*?\.hero-action\s*\{[^}]*font-size:\s*17px/s);
});

test('stylesheet omits audited dead declarations', () => {
  const css = read('style.css');

  assert.doesNotMatch(css, /--jade\s*:/);
  assert.doesNotMatch(css, /\.hero-copy::after/);
  assert.doesNotMatch(css, /\.hero-paper::(?:before|after)/);
  assert.doesNotMatch(css, /transition:\s*background 180ms ease,\s*transform 180ms ease/);
  assert.doesNotMatch(css, /\.reveal\.is-pending\s*\{[^}]*\}\s*\.reveal\.is-pending\s*\{/s);
});

test('moment captions remain legible without obscuring the photos', () => {
  const css = read('style.css');

  assert.match(css, /\.moment > span\s*\{[^}]*padding:\s*18px\s+22px\s+14px[^}]*background:\s*rgba\(30,33,31,0\.52\)/s);
});

test('phone portrait keeps the poster and association copy inside one viewport', () => {
  const css = read('style.css');

  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.hero\s*\{[^}]*height:\s*100dvh[^}]*display:\s*grid[^}]*grid-template-rows:\s*minmax\(0,\s*1fr\)\s+auto[^}]*overflow:\s*hidden/s);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.hero-image\s*\{[^}]*position:\s*relative[^}]*grid-row:\s*1[^}]*height:\s*100%[^}]*object-fit:\s*cover/s);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.hero-copy\s*\{[^}]*grid-row:\s*2[^}]*display:\s*flex[^}]*background:\s*var\(--paper-light\)/s);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*?\.hero-action\s*\{[^}]*display:\s*inline-flex/s);
  assert.doesNotMatch(css, /@keyframes hero-enter\s*\{\s*from\s*\{[^}]*transform:\s*scale/);
});

test('phone landscape hides the desktop-only vertical motto', () => {
  const css = read('style.css');

  assert.match(
    css,
    /@media \(max-width: 900px\) and \(max-height: 520px\) and \(orientation: landscape\)[\s\S]*?\.hero-mark\s*\{[^}]*display:\s*none/s,
  );
});
