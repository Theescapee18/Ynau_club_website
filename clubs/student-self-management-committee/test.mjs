import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (name) => readFileSync(new URL(name, import.meta.url), 'utf8');

test('页面保留学生自我管理委员会的完整材料与全部活动图片', () => {
  const html = read('index.html');

  for (let index = 1; index <= 12; index += 1) {
    assert.match(html, new RegExp(`image/img_00${String(index).padStart(2, '0')}_`));
  }

  for (const text of [
    '自我管理、自我教育、自我服务、自我监督、自我发展',
    '始创于1991年',
    '耕读打卡',
    '千人晨读',
    '榜样面对面',
    '学习部',
    '宣传部',
    '办公室',
    '生活部',
    '第三期“启智未来·书记、院长面对面”讲座',
    '研途·有你 考研智慧集市暨2027届考研动员活动',
    '耕读·初探 乡村振兴路耕读教育活动',
    '第十五期“启智未来·院长面对面”讲座',
    '榜样面对面——2026年升学经验分享讲座',
  ]) {
    assert.ok(html.includes(text), `缺少材料内容：${text}`);
  }

  assert.doesNotMatch(html, /id="honors"|class="[^"']*honors/);
});

test('页面具备无障碍导航与完整手机首屏', () => {
  const html = read('index.html');
  const css = read('style.css');
  const script = read('script.js');

  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /aria-label="打开导航菜单"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /<nav class="desktop-nav"/);
  assert.match(html, /<nav class="mobile-nav"/);
  assert.match(css, /min-height:\s*100svh/);
  assert.match(css, /min-height:\s*100dvh/);
  assert.match(css, /overflow-x:\s*(?:clip|hidden)/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media\s*\(max-width:\s*720px\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(script, /aria-expanded/);
  assert.match(script, /Escape/);
});

test('社团导航页只将学生自我管理委员会链接到其独立官网目录', () => {
  const directory = read('../../clubs.html');

  assert.match(
    directory,
    /name:"学生自我管理委员会",cat:"自律互助类",link:"clubs\/student-self-management-committee\/index\.html"/,
  );
  assert.match(
    directory,
    /name:"学生管理服务协会",cat:"自律互助类",link:"clubs\/student-management-service-association\/index\.html"/,
  );
  assert.match(
    directory,
    /name:"学生资助与发展协会",cat:"自律互助类",link:"clubs\/student-aid-development-association\/index\.html"/,
  );
});

test('页面可见文字不含英语，并提供返回社团列表入口', () => {
  const html = read('index.html');
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ');

  assert.match(html, /<h1[^>]*>学生自我管理委员会<\/h1>/);
  assert.match(html, /<a class="back-link" href="\.\.\/\.\.\/clubs\.html"/);
  assert.doesNotMatch(visibleText, /[A-Za-z]/, '页面仍有可见英文');
});
