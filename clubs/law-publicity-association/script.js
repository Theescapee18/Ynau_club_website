(function () {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');
  const navLinks = siteNav ? siteNav.querySelectorAll('a') : [];
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    if (header) {
      header.classList.toggle('scrolled', scrollY > 50);
    }

    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 500);
    }
  }

  function toggleMenu(open) {
    if (!menuToggle || !siteNav) return;
    const isOpen = open === undefined ? !siteNav.classList.contains('open') : open;
    siteNav.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      toggleMenu();
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMenu(false);
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
