(function () {
  'use strict';

  var body = document.body;
  var header = document.getElementById('siteHeader');
  var menuButton = document.getElementById('menuButton');
  var mobileNav = document.getElementById('mobileNav');
  var backToTop = document.getElementById('backToTop');
  var desktopLinks = document.querySelectorAll('.desktop-nav a');
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

    if (y < window.innerHeight * 0.35) {
      desktopLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#top');
      });
    }

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

  document.querySelectorAll('a[href="#top"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      setMenu(false);
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
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

  function findLightboxTrigger(target) {
    if (!target || target.nodeType !== 1) return null;
    if (typeof target.closest === 'function') return target.closest('.lightbox-trigger');
    var el = target;
    while (el && el.nodeType === 1) {
      if (el.classList && el.classList.contains('lightbox-trigger')) return el;
      el = el.parentNode;
    }
    return null;
  }
  document.addEventListener('click', function (event) {
    var trigger = findLightboxTrigger(event.target);
    if (!trigger) return;
    event.preventDefault();
    openLightbox(trigger);
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

  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        var target = Number(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        el.textContent = target + suffix;
      });
    } else {
      var counterObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = Number(el.dataset.count);
          var suffix = el.dataset.suffix || '';
          var start = performance.now();
          var duration = 900;
          function updateCount(now) {
            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(updateCount);
          }
          requestAnimationFrame(updateCount);
          observer.unobserve(el);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    }
  }
})();
