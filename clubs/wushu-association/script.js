document.addEventListener('DOMContentLoaded', () => {
  // 移动端导航菜单切换
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true' || false;
      mobileMenuBtn.setAttribute('aria-expanded', !expanded);
      mobileMenuBtn.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });

    // 点击导航链接后自动关闭移动端菜单
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 滚动渐显动画（IntersectionObserver）
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealOnScroll.observe(el));

  // ===== 图片放大灯箱 (Lightbox) =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  function openLightbox(src, alt, captionText) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    if (lightboxCaption) {
      lightboxCaption.textContent = captionText || '';
    }
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  // 精彩瞬间、活动、荣誉墙等图片点击放大
  const zoomableSelectors = [
    '.gallery-card img',
    '.activity-media img',
    '.honor-images img'
  ];
  zoomableSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        const captionEl = img.closest('article, figure')
          ? img.closest('article, figure').querySelector('h3, figcaption h3')
          : null;
        const captionText = captionEl ? captionEl.textContent.trim() : (img.alt || '');
        openLightbox(img.src, img.alt, captionText);
      });
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  // ===== 返回顶部按钮 =====
  const backToTop = document.getElementById('backToTop');

  function updateChrome() {
    if (backToTop) {
      const showThreshold = window.innerHeight * 0.65;
      backToTop.classList.toggle('visible', window.scrollY > showThreshold);
    }
  }

  if (backToTop) {
    window.addEventListener('scroll', updateChrome, { passive: true });
    updateChrome();
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
