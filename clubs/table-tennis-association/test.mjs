import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (name) => readFileSync(new URL(name, import.meta.url), 'utf8');

test('page preserves the supplied association content and uses every source image', () => {
  const html = read('index.html');

  for (const image of ['image1.png', 'image2.jpeg', 'image3.jpeg', 'image4.jpeg', 'image5.jpeg', 'image6.jpeg', 'image7.jpeg', 'image8.jpeg', 'image9.jpeg', 'image10.jpeg']) {
    assert.ok(html.includes(`image/${image}`), `missing supplied image: ${image}`);
  }

  for (const text of [
    '云南农业大学乒乓球协会成立于1999年',
    '裁判部',
    '活动部',
    '宣传部',
    '办公部',
    '外联部',
    '乒乓球协会“迎新杯”比赛（混合赛）',
    '乒乓球协会器材知识与技术培训',
    '“社团杯”乒乓球',
  ]) {
    assert.ok(html.includes(text), `missing source content: ${text}`);
  }

  assert.doesNotMatch(html, /荣誉墙/);
});

test('page provides a full-screen responsive hero and accessible mobile navigation', () => {
  const html = read('index.html');
  const css = read('style.css');
  const script = read('script.js');

  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /aria-label="打开导航菜单"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /src="image\/image2\.jpeg" alt="乒乓球协会迎新杯颁奖合照"/);
  assert.match(css, /min-height:\s*100svh/);
  assert.match(css, /min-height:\s*100dvh/);
  assert.match(css, /object-position:\s*52%\s+center/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media\(max-width:800px\)[\s\S]*?\.hero-image\{object-fit:contain;/);
  assert.match(script, /aria-expanded/);
  assert.match(script, /Escape/);
});

test('gallery preview uses a semantic dialog and association is linked in the directory', () => {
  const html = read('index.html');
  const script = read('script.js');
  const directory = read('../../clubs.html');

  assert.match(html, /<dialog class="lightbox" id="lightbox"/);
  assert.match(script, /lightbox\.showModal\(\)/);
  assert.match(script, /lightbox\.close\(\)/);
  assert.match(
    directory,
    /name:"乒乓球协会",cat:"文化体育类",link:"clubs\/table-tennis-association\/index\.html"/,
  );
});
