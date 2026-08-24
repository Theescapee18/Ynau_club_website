import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const clubRoot = resolve(import.meta.dirname);
const siteRoot = resolve(clubRoot, '../..');
const pagePath = resolve(clubRoot, 'index.html');
const stylePath = resolve(clubRoot, 'style.css');
const scriptPath = resolve(clubRoot, 'script.js');
const clubsPath = resolve(siteRoot, 'clubs.html');

test('科普站官网具备页面文件、中文导航与移动端首屏规则', () => {
  assert.ok(existsSync(pagePath), '应创建社团首页');
  assert.ok(existsSync(stylePath), '应创建社团样式表');
  assert.ok(existsSync(scriptPath), '应创建社团交互脚本');

  const page = readFileSync(pagePath, 'utf8');
  const style = readFileSync(stylePath, 'utf8');
  assert.match(page, /云南民族农耕文化科普站/);
  assert.match(page, /社团简介/);
  assert.match(page, /部门组成/);
  assert.match(page, /精彩瞬间/);
  assert.match(page, /精彩活动/);
  assert.match(page, /社团荣誉/);
  assert.match(page, /第十四届社团嘉年华/);
  assert.match(page, /民族趣味运动会第五名/);
  assert.match(page, /2024-2025优秀社团/);
  assert.match(style, /100(?:s|d)vh/);
  assert.match(style, /\.about-emblem > div\s*\{[^}]*width: 160px/s);
  assert.match(style, /\.about-emblem > div\s*\{[^}]*height: 160px/s);
  assert.match(style, /\.about-emblem img\s*\{[^}]*height: 100%/s);
  assert.match(style, /\.about-emblem img\s*\{[^}]*object-fit: contain/s);
  assert.match(style, /\.about-emblem > div\s*\{[^}]*width: 112px/s);
  assert.match(style, /\.about-emblem > div\s*\{[^}]*height: 112px/s);
});

test('社团列表提供科普站官网入口', () => {
  const clubs = readFileSync(clubsPath, 'utf8');
  assert.match(clubs, /云南民族农耕文化科普站/);
  assert.match(clubs, /ethnic-farming-culture-popularization-station\/index\.html/);
  assert.match(clubs, /\{id:69,level:"一类社团",name:"云南民族农耕文化科普站",cat:"学术科学类",link:"clubs\/ethnic-farming-culture-popularization-station\/index\.html"\}/);
});

test('页面图片存放在本社团目录的 image 文件夹中', () => {
  const page = readFileSync(pagePath, 'utf8');
  const sources = [...page.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1]);

  assert.ok(sources.length > 0, '页面应包含图片');
  for (const source of sources) {
    assert.match(source, /^image\//, `图片应从本社团 image 文件夹引用：${source}`);
    assert.ok(existsSync(resolve(clubRoot, source)), `图片文件应存在：${source}`);
  }
});
