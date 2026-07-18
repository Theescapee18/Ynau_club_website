(function () {
  'use strict';

  var body = document.body;
  var header = document.getElementById('siteHeader');
  var menuButton = document.getElementById('menuButton');
  var mobileNav = document.getElementById('mobileNav');
  var backToTop = document.getElementById('backToTop');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setMenu(open) {
    menuButton.classList.toggle('active', open);
    mobileNav.classList.toggle('open', open);
    header.classList.toggle('menu-open', open);
    body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    mobileNav.setAttribute('aria-hidden', String(!open));
  }

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      setMenu(!mobileNav.classList.contains('open'));
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mobileNav.classList.contains('open')) {
        setMenu(false);
        menuButton.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && mobileNav.classList.contains('open')) setMenu(false);
    });
  }

  var ticking = false;
  function updateOnScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 32);
    backToTop.classList.toggle('visible', y > 700);

    if (!reduceMotion && window.innerWidth > 640 && y < window.innerHeight) {
      var heroMedia = document.getElementById('heroMedia');
      heroMedia.style.transform = 'translate3d(0,' + Math.min(y * 0.12, 70) + 'px,0)';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }, { passive: true });
  updateOnScroll();

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  var revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px' });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  var sections = document.querySelectorAll('main section[id]');
  var desktopLinks = document.querySelectorAll('.desktop-nav a');
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        desktopLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-35% 0px -55%', threshold: 0 });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightboxImage');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  var lastLightboxTrigger = null;

  function openLightbox(trigger) {
    lastLightboxTrigger = trigger;
    lightboxImage.src = trigger.dataset.full;
    lightboxImage.alt = trigger.querySelector('img').alt;
    lightboxCaption.textContent = trigger.dataset.caption || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    body.classList.add('lightbox-open');
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    body.classList.remove('lightbox-open');
    lightboxImage.src = '';
    if (lastLightboxTrigger) lastLightboxTrigger.focus();
  }

  document.querySelectorAll('.lightbox-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () { openLightbox(trigger); });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    if (event.key === 'Tab' && lightbox.classList.contains('open')) {
      event.preventDefault();
      lightboxClose.focus();
    }
  });
})();
