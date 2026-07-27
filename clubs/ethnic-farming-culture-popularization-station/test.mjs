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
  assert.doesNotMatch(page, /荣誉墙/);
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
});
