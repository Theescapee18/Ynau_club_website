(function () {
  'use strict';

  const header = document.getElementById('siteHeader');
  const menuButton = document.getElementById('menuButton');
  const mobileNav = document.getElementById('mobileNav');
  const backTop = document.getElementById('backTop');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setMenu(open) {
    if (!menuButton || !mobileNav) return;
    mobileNav.classList.toggle('open', open);
    mobileNav.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-expanded', String(open));
    const bars = menuButton.querySelectorAll('span');
    if (bars.length === 3) {
      bars[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
      bars[1].style.opacity = open ? '0' : '';
      bars[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
    }
  }

  if (menuButton) menuButton.addEventListener('click', () => setMenu(!mobileNav.classList.contains('open')));
  document.querySelectorAll('.mobile-nav a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.moment-card').forEach((card) => card.addEventListener('click', () => {
    const image = card.querySelector('img');
    if (!image || !lightbox) return;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = card.dataset.caption || image.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }));

  document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.1, rootMargin: '0px 0px -30px' });
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add('visible'));

  function updateScrollUi() {
    header.classList.toggle('scrolled', window.scrollY > 10);
    backTop.classList.toggle('visible', window.scrollY > 520);
    backTop.setAttribute('aria-hidden', String(window.scrollY <= 520));
  }

  window.addEventListener('scroll', updateScrollUi, { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  updateScrollUi();
}());
