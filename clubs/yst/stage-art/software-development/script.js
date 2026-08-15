/* ============================================================
   艺术团舞美部 · 软件开发组 官网交互脚本
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 导航滚动态 ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 移动端菜单 ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    links.classList.toggle("open");
    document.body.classList.toggle("menu-open", links.classList.contains("open"));
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      toggle.classList.remove("active");
      links.classList.remove("open");
      document.body.classList.remove("menu-open");
    })
  );

  /* ---------- 当前区块导航高亮 ---------- */
  const navAnchors = Array.from(links.querySelectorAll("a[href^='#']"));
  const sections = navAnchors
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (sections.length) {
    const setActive = () => {
      const y = window.scrollY + 120;
      let current = sections[0];
      for (const sec of sections) {
        if (sec.offsetTop <= y) current = sec;
      }
      navAnchors.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === `#${current.id}`);
      });
    };
    window.addEventListener("scroll", setActive, { passive: true });
    setActive();
  }

  /* ---------- 滚动入场动画 ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    io.observe(el);
  });

  /* ---------- 数字滚动 ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        const el = e.target;
        const target = +el.dataset.count;
        const dur = 1400;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min((t - t0) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => cio.observe(el));

  /* ---------- 轻量卡片交互 ---------- */
  const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (motionOk && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const tiltCards = document.querySelectorAll(".dir-card, .proj-card, .work-card");
    tiltCards.forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 6;
        const rotateX = (0.5 - py) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });

    const heroInner = document.querySelector(".hero-inner");
    const hero = document.querySelector(".hero");
    if (heroInner && hero) {
      hero.addEventListener("pointermove", (e) => {
        const rect = hero.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
        heroInner.style.transform = `translate3d(${dx * 10}px, ${dy * 8}px, 0)`;
      });
      hero.addEventListener("pointerleave", () => {
        heroInner.style.transform = "";
      });
    }
  }

  /* ---------- 首屏暖色尘埃：光束下缓缓上浮的尘埃 ---------- */
  const canvas = document.getElementById("heroCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let W, H, particles;
    const DENSITY = 16000;
    const COLORS = ["37,99,235", "6,182,212", "148,163,184"];

    function resize() {
      W = canvas.width = canvas.offsetWidth * devicePixelRatio;
      H = canvas.height = canvas.offsetHeight * devicePixelRatio;
      const count = Math.min(70, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / DENSITY));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18 * devicePixelRatio,
        vy: -(Math.random() * 0.22 + 0.06) * devicePixelRatio,
        r: (Math.random() * 1.8 + 0.7) * devicePixelRatio,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        a: Math.random() * 0.35 + 0.15,
      }));
    }
    resize();
    window.addEventListener("resize", resize);

    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`;
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    // 尊重系统「减少动态效果」偏好
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(frame);
    }
  }
})();
