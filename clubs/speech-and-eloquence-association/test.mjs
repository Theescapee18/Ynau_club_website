import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (name) => readFileSync(new URL(name, import.meta.url), 'utf8');

test('page preserves the submitted association content and all seven images', () => {
  const html = read('index.html');

  for (let index = 1; index <= 7; index += 1) {
    assert.ok(existsSync(new URL(`image/image${index}.jpeg`, import.meta.url)));
    assert.match(html, new RegExp(`image/image${index}\\.jpeg`));
  }

  for (const text of [
    '演讲与口才协会',
    '专注语言表达、思辨交流的综合性实践社团',
    '主席团',
    '办公部',
    '礼仪部',
    '口才部',
    '演讲部',
    '宣传部',
    '晨读启动仪式',
    '图书馆日活动',
  ]) {
    assert.ok(html.includes(text), `missing submitted content: ${text}`);
  }

  assert.doesNotMatch(html, /id="honors"|荣誉墙/);
});

test('page provides mobile-safe navigation and a full-height phone hero', () => {
  const html = read('index.html');
  const css = read('style.css');
  const script = read('script.js');

  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(html, /<main id="mainContent">/);
  assert.match(html, /aria-label="打开导航"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /<nav class="site-nav"/);
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
    /name:"演讲与口才协会",cat:"文化体育类",link:"clubs\/speech-and-eloquence-association\/index\.html"/,
  );
});

test('visible copy remains Chinese and the hero uses submitted activity photography', () => {
  const html = read('index.html');

  assert.ok(html.includes('<h1 id="heroTitle"><span class="hero-title-line hero-title-first">演讲与</span><span class="hero-title-line hero-title-second">口才协会</span></h1>'));
  assert.ok(html.includes('<a class="back-link" href="../../clubs.html"'));
  assert.ok(html.includes('src="image/image6.jpeg"'));
  assert.doesNotMatch(html, />[^<>]*[A-Za-z][^<>]*</, 'visible English copy remains on the page');
});

test('mobile navigation spans the viewport and the hero uses poster title lines', () => {
  const html = read('index.html');
  const css = read('style.css');

  assert.ok(html.includes('class="hero-title-line hero-title-first"'));
  assert.ok(html.includes('class="hero-title-line hero-title-second"'));
  assert.ok(html.includes('class="hero-poster-word"'));
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*?\.site-nav \{[^}]*position: fixed[^}]*left: 0[^}]*right: 0[^}]*width: 100vw/s);
  assert.match(css, /\.hero-poster-word \{[^}]*font-size: clamp\(150px, 25vw, 360px\)/s);
});

test('mobile navigation centers its links across the full-width panel', () => {
  const css = read('style.css');

  assert.match(css, /@media \(max-width: 900px\)[\s\S]*?\.site-nav a \{[^}]*justify-content: center[^}]*text-align: center/s);
});
