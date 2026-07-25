(function() {
  'use strict';

  const header = document.getElementById('siteHeader');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const backToTop = document.getElementById('backToTop');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let menuOpen = false;

  function setMenuState(open) {
    if (!mobileMenuBtn || !mobileNav) return;
    menuOpen = open;
    mobileNav.classList.toggle('active', open);
    mobileMenuBtn.setAttribute('aria-expanded', String(open));
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (spans.length === 3) {
      spans[0].style.transform = open ? 'translateY(7px) rotate(45deg)' : '';
      spans[1].style.opacity = open ? '0' : '';
      spans[2].style.transform = open ? 'translateY(-7px) rotate(-45deg)' : '';
    }
  }

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function() {
      setMenuState(!menuOpen);
    });

    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        setMenuState(false);
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(event) {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;
      window.scrollTo({
        top,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });
    revealItems.forEach(function(item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function(item) {
      item.classList.add('visible');
    });
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const galleryButtons = document.querySelectorAll('.moment-card, .honor-card');

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (lightbox && lightboxImage && lightboxCaption && galleryButtons.length) {
    galleryButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        const img = button.querySelector('img');
        if (!img) return;
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = button.getAttribute('data-caption') || '';
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', function(event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') {
        closeLightbox();
      }
    });
  }

  function updateScrollUi() {
    const scrolled = window.scrollY > 12;
    if (header) {
      header.classList.toggle('scrolled', scrolled);
    }
    if (backToTop) {
      backToTop.setAttribute('aria-hidden', String(window.scrollY <= 420));
    }
  }

  window.addEventListener('scroll', updateScrollUi, { passive: true });
  updateScrollUi();

  if (backToTop) {
    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  }
})();
