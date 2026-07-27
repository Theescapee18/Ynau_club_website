(function () {
  'use strict';

  const header = document.getElementById('siteHeader');
  const menuButton = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const backToTop = document.getElementById('backToTop');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.querySelector('.lightbox-close');

  function setMenu(open) {
    mobileNav.classList.toggle('active', open);
    menuButton.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
  }

  menuButton.addEventListener('click', function () {
    setMenu(!mobileNav.classList.contains('active'));
  });

  mobileNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  window.addEventListener('scroll', function () {
    const scrolled = window.scrollY > 36;
    header.classList.toggle('scrolled', scrolled);
    backToTop.setAttribute('aria-hidden', String(window.scrollY <= 420));
  }, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      const headerHeight = header.getBoundingClientRect().height;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerHeight, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      const image = item.querySelector('img');
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = item.dataset.caption || image.alt;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
    });
  });

  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (event) { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeLightbox(); });
  backToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  const revealItems = document.querySelectorAll('.reveal');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealItems.forEach(function (item) { item.classList.add('visible'); });
  } else {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(function (item) { observer.observe(item); });
  }
}());
