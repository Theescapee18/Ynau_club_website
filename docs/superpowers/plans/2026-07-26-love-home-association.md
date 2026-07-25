# 昆明市大学生爱心家园协会官网 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建昆明市大学生爱心家园协会响应式静态官网，并从社团列表提供官网入口。

**Architecture:** 沿用现有项目的独立社团目录模式，新增 `clubs/love-home-association/`，由语义化 HTML、独立 CSS 和少量原生 JavaScript 组成。图片复制到页面自己的 `image/` 目录，列表页只修改编号 31 的数据项。

**Tech Stack:** HTML5、CSS3、原生 JavaScript、Node.js 内置测试运行器、浏览器响应式验证。

---

### Task 1: 建立静态页面契约测试

**Files:**
- Create: `tests/love-home-association.test.mjs`

- [ ] **Step 1: 写入失败测试**

测试读取目标 HTML、CSS、JS 与 `clubs.html`，断言移动端元标签、导航位置、核心原文、六张精彩瞬间、三项活动、无图读书会和列表链接存在。

- [ ] **Step 2: 运行测试并确认失败**

Run: `node --test tests/love-home-association.test.mjs`

Expected: FAIL，因为 `clubs/love-home-association/index.html` 尚不存在。

### Task 2: 创建页面结构与素材目录

**Files:**
- Create: `clubs/love-home-association/index.html`
- Create: `clubs/love-home-association/image/img_0001_5afc671e.jpg`
- Create: `clubs/love-home-association/image/img_0002_8ffc95ec.jpg`
- Create: `clubs/love-home-association/image/img_0004_99d3ebcf.jpg`
- Create: `clubs/love-home-association/image/img_0005_fc13a89b.jpg`
- Create: `clubs/love-home-association/image/img_0006_4a4e8d83.jpg`
- Create: `clubs/love-home-association/image/img_0007_c6b4e1ea.jpg`
- Create: `clubs/love-home-association/image/img_0008_f56bd34c.jpg`

- [ ] **Step 1: 复制原始图片，不修改源素材**
- [ ] **Step 2: 编写语义化页面结构**
- [ ] **Step 3: 运行契约测试，确认仍因样式、脚本和列表链接缺失而失败**

### Task 3: 实现移动优先视觉系统

**Files:**
- Create: `clubs/love-home-association/style.css`

- [ ] **Step 1: 定义红、绿、黄、蓝的语义色彩与间距变量**
- [ ] **Step 2: 实现 Logo 居中三段式导航和全屏 Hero**
- [ ] **Step 3: 实现简介、部门、画廊、活动和愿景版式**
- [ ] **Step 4: 添加 850px、640px 与横屏媒体查询及 reduced-motion**

### Task 4: 实现交互

**Files:**
- Create: `clubs/love-home-association/script.js`

- [ ] **Step 1: 实现手机菜单开关和 Escape 关闭**
- [ ] **Step 2: 实现图片灯箱关闭路径**
- [ ] **Step 3: 实现滚动状态与返回顶部按钮**

### Task 5: 接入社团列表

**Files:**
- Modify: `clubs.html`

- [ ] **Step 1: 将编号 31 名称统一为“昆明市大学生爱心家园协会”**
- [ ] **Step 2: 添加 `clubs/love-home-association/index.html` 链接**
- [ ] **Step 3: 运行契约测试并确认全部通过**

### Task 6: 浏览器质量验证

**Files:**
- Verify: `clubs/love-home-association/index.html`
- Verify: `clubs.html`

- [ ] **Step 1: 启动本地静态服务器**
- [ ] **Step 2: 在 1440x900、375x812、812x375 下检查截图和横向溢出**
- [ ] **Step 3: 验证返回按钮、菜单、灯箱、返回顶部和新闻链接**
- [ ] **Step 4: 检查控制台错误与所有图片加载状态**

