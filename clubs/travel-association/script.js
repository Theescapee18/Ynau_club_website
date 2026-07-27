(function () {
  'use strict';

  const header = document.getElementById('siteHeader');
  const menuButton = document.getElementById('menuButton');
  const mobileNav = document.getElementById('mobileNav');
  const backToTop = document.getElementById('backToTop');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastFocusedElement = null;

  function setMenu(open) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    menuButton.classList.toggle('is-open', open);
    mobileNav.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  }

  menuButton.addEventListener('click', function () {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (lightbox.open) closeLightbox();
      if (menuButton.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuButton.focus();
      }
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-pending');
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach(function (item) {
      item.classList.add('is-pending');
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  function openLightbox(button) {
    const image = button.querySelector('img');
    lastFocusedElement = button;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = button.dataset.caption || '';
    lightbox.showModal();
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox.open) return;
    lightbox.close();
    document.body.classList.remove('lightbox-open');
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  document.querySelectorAll('.moment').forEach(function (button) {
    button.addEventListener('click', function () { openLightbox(button); });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });

  let ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      const scrolled = window.scrollY > 80;
      header.classList.toggle('is-scrolled', scrolled);
      const showTop = window.scrollY > 700;
      backToTop.hidden = !showTop;
      backToTop.disabled = !showTop;
      ticking = false;
    });
  }, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1100) setMenu(false);
  });
})();
