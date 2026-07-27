import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (name) => readFileSync(new URL(name, import.meta.url), 'utf8');

test('页面保留射艺协会材料的核心内容且不公开个人资料', () => {
  const html = read('index.html');

  for (const image of [
    'image2.jpeg', 'image3.jpeg', 'image4.jpeg', 'image5.jpeg', 'image6.jpeg', 'image7.jpeg',
    'image8.jpeg', 'image9.jpeg', 'image10.jpeg', 'image11.jpeg', 'image12.jpeg', 'image13.jpeg',
    'image14.jpeg', 'image15.jpeg', 'image16.jpeg', 'image17.jpeg', 'image18.jpeg',
  ]) {
    assert.ok(html.includes(`image/${image}`), `缺少素材图片：${image}`);
  }

  for (const text of [
    '社团成立于 2016 年',
    '财务部',
    '外联部',
    '活动部',
    '羿羽射艺礼射比赛',
    '2025 年勤锻炼校园射箭大赛',
    '社团文化节',
    '羿羽射艺部门排球赛',
    '羿羽射艺传统文化宣讲',
    '2024 年“勤锻炼”团体第一名',
  ]) {
    assert.ok(html.includes(text), `缺少材料内容：${text}`);
  }

  assert.doesNotMatch(html, /杨夏|15911513812|2026 年 7 月 21 日/);
  assert.doesNotMatch(html, /YNAU|ARCHERY|CALLIGRAPHY|THE CHINESE CULTURE/);
});

test('页面具备全屏手机首屏、可访问导航与荣誉墙', () => {
  const html = read('index.html');
  const css = read('style.css');
  const script = read('script.js');

  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">/);
  assert.match(html, /<img src="image\/image1\.jpeg" width="1279" height="1800" alt="羿羽射艺协会标志">/);
  assert.match(html, /<img class="about-logo-image" src="image\/image1\.jpeg" width="1279" height="1800" alt="羿羽射艺协会标志">/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /aria-label="打开导航菜单"/);
  assert.match(html, /id="honor"/);
  assert.match(html, /src="image\/image2\.jpeg" alt="羿羽射艺协会获得赛事荣誉的全员合影"/);
  assert.match(css, /min-height:\s*100svh/);
  assert.match(css, /min-height:\s*100dvh/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(script, /aria-expanded/);
  assert.match(script, /Escape/);
});

test('图片可预览且社团广场提供官网入口', () => {
  const html = read('index.html');
  const script = read('script.js');
  const directory = read('../../clubs.html');

  assert.match(html, /<dialog class="lightbox" id="lightbox"/);
  assert.match(script, /lightbox\.showModal\(\)/);
  assert.match(script, /lightbox\.close\(\)/);
  assert.match(
    directory,
    /name:"羿羽射艺协会",cat:"文化体育类",link:"clubs\/yi-yu-archery\/index\.html"/,
  );
});
