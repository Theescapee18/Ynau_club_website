import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pageRoot = resolve(projectRoot, 'clubs', 'love-home-association');
const htmlPath = resolve(pageRoot, 'index.html');
const cssPath = resolve(pageRoot, 'style.css');
const scriptPath = resolve(pageRoot, 'script.js');
const clubsPath = resolve(projectRoot, 'clubs.html');

function readRequired(path) {
  assert.ok(existsSync(path), `Expected file to exist: ${path}`);
  return readFileSync(path, 'utf8');
}

test('creates the association page files', () => {
  assert.ok(existsSync(htmlPath), 'index.html should exist');
  assert.ok(existsSync(cssPath), 'style.css should exist');
  assert.ok(existsSync(scriptPath), 'script.js should exist');
});

test('includes the mobile viewport and three-part navigation', () => {
  const html = readRequired(htmlPath);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1\.0">/);
  assert.match(html, /class="nav-back"[^>]*href="\.\.\/\.\.\/clubs\.html"/);
  assert.match(html, /class="brand"/);
  assert.match(html, /id="menuButton"/);
});

test('preserves the association identity and submitted core content', () => {
  const html = readRequired(htmlPath);
  assert.match(html, /昆明市大学生爱心家园协会/);
  assert.match(html, /丰富大学生活、锤炼个人能力、传递社会爱心、助力就业成长/);
  assert.match(html, /千余名志愿者/);
  assert.match(html, /累计服务群众超万人次/);
  assert.match(html, /办公室/);
  assert.match(html, /活动部/);
  assert.match(html, /宣传部/);
  assert.match(html, /人事部/);
});

test('renders six submitted moments and all three activities', () => {
  const html = readRequired(htmlPath);
  assert.equal((html.match(/class="moment"/g) || []).length, 6);
  assert.match(html, /彩云之南·读书会/);
  assert.match(html, /盲盒友谊，心灵驿站/);
  assert.match(html, /助力环保，一倡百盒/);
  const textOnlyActivity = html.match(/<article class="activity activity-text-only">([\s\S]*?)<\/article>/);
  assert.ok(textOnlyActivity, 'the reading event should use the text-only activity layout');
  assert.doesNotMatch(textOnlyActivity[1], /<img\b/);
  assert.match(textOnlyActivity[1], /toutiao\.com/);
});

test('defines full-screen responsive behavior and accessible touch targets', () => {
  const css = readRequired(cssPath);
  assert.match(css, /min-height:\s*100dvh/);
  assert.match(css, /@media\s*\(max-width:\s*640px\)/);
  assert.match(css, /orientation:\s*landscape/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /prefers-reduced-motion/);
});

test('uses Chinese section labels instead of decorative English labels', () => {
  const html = readRequired(htmlPath);
  assert.doesNotMatch(html, /ABOUT US|WORK TOGETHER|MOMENTS|FEATURED EVENTS|LOOKING FORWARD/);
  assert.match(html, /关于我们/);
  assert.match(html, /协作部门/);
  assert.match(html, /精彩瞬间/);
  assert.match(html, /品牌活动/);
  assert.match(html, /未来愿景/);
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  assert.doesNotMatch(visibleText, /[A-Za-z]/);
});

test('links the official association name from the club list', () => {
  const clubs = readRequired(clubsPath);
  assert.match(
    clubs,
    /\{id:31,level:"二类社团",name:"昆明市大学生爱心家园协会",cat:"志愿公益类",link:"clubs\/love-home-association\/index\.html"\}/
  );
});
