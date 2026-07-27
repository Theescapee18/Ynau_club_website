/* 云南农业大学耕读学社官网脚本 */
(function () {
  'use strict';

  // ===== 移动端导航 =====
  var menuBtn = document.getElementById('mobileMenuBtn');
  var mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      var open = this.classList.toggle('active');
      mobileNav.classList.toggle('open', open);
      this.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menuBtn.classList.remove('active');
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===== 滚动效果（导航栏阴影 + 返回顶部） =====
  var header = document.getElementById('siteHeader');
  var backToTop = document.getElementById('backToTop');
  var updateChrome = function () {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }
    if (backToTop) {
      var show = window.scrollY > window.innerHeight * 0.65;
      backToTop.classList.toggle('visible', show);
      backToTop.setAttribute('aria-hidden', show ? 'false' : 'true');
    }
  };

  // ===== 图片灯箱 =====
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-thumb').forEach(function (item) {
      item.addEventListener('click', function () {
        var img = this.querySelector('img');
        var caption = this.querySelector('figcaption');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          if (lightboxCaption && caption) {
            lightboxCaption.textContent = caption.textContent;
          }
          lightbox.classList.add('open');
          lightbox.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
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

  // ===== 精彩瞬间左右箭头 =====
  var galleryStrip = document.getElementById('galleryStrip');
  var galleryPrev = document.getElementById('galleryPrev');
  var galleryNext = document.getElementById('galleryNext');

  if (galleryStrip && galleryPrev && galleryNext) {
    var updateGalleryNav = function () {
      var maxScroll = galleryStrip.scrollWidth - galleryStrip.clientWidth;
      galleryPrev.disabled = galleryStrip.scrollLeft <= 2;
      galleryNext.disabled = galleryStrip.scrollLeft >= maxScroll - 2;
    };

    galleryStrip.addEventListener('scroll', updateGalleryNav, { passive: true });
    window.addEventListener('resize', updateGalleryNav);

    galleryPrev.addEventListener('click', function () {
      var step = galleryStrip.querySelector('.gallery-thumb');
      step = step ? step.offsetWidth + 20 : galleryStrip.clientWidth * 0.8;
      galleryStrip.scrollBy({ left: -step, behavior: 'smooth' });
    });
    galleryNext.addEventListener('click', function () {
      var step = galleryStrip.querySelector('.gallery-thumb');
      step = step ? step.offsetWidth + 20 : galleryStrip.clientWidth * 0.8;
      galleryStrip.scrollBy({ left: step, behavior: 'smooth' });
    });

    updateGalleryNav();
  }

  // ===== 返回顶部 =====
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', updateChrome, { passive: true });
  updateChrome();

  // ===== 平滑滚动（锚点） =====
  var headerHeight = header ? header.offsetHeight : 0;
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && href.length > 1) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  });

  // ===== 滚动出现动画 =====
  var fadeTargets = document.querySelectorAll(
    '.section-header, .about-text, .about-sidebar, .dept-card, .gallery-thumb, .activity-card, .honor-card'
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
    fadeTargets.forEach(function (el) { el.classList.add('visible'); });
  }
})();
