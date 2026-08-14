/* OmnMarkdown - 青年志愿者协会官网脚本 */
(function () {
  'use strict';

  // ===== 移动端导航 =====
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      this.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });
    // 点击导航链接后关闭菜单
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menuBtn.classList.remove('active');
        mobileNav.classList.remove('open');
      });
    });
  }

  // ===== 导航栏滚动效果 =====
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ===== 图片灯箱 =====
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox && lightboxImg) {
    // 画廊图片点击（兼容新旧两种画廊结构）
    document.querySelectorAll('.gallery-item, .gallery-thumb, .honor-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var img = this.querySelector('img');
          var caption = this.querySelector('.gallery-caption, .honor-name, span');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          if (lightboxCaption && caption) {
            lightboxCaption.textContent = caption.textContent;
          }
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });

    // 关闭灯箱
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  // ===== 返回顶部 =====
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== 滚动出现动画 =====
  var fadeTargets = document.querySelectorAll(
    '.section-header, .about-text, .about-sidebar, .dept-item, .gallery-thumb, .activity-card, .honor-item'
  );
  fadeTargets.forEach(function (el) { el.classList.add('fade-in'); });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeTargets.forEach(function (el) { observer.observe(el); });
  } else {
    // 不支持时直接显示
    fadeTargets.forEach(function (el) { el.classList.add('visible'); });
  }
})();
