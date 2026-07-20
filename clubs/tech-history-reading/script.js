(function () {
  const header = document.querySelector('.site-header');
  const menuButton = document.getElementById('menuButton');
  const nav = document.getElementById('siteNav');
  const backToTop = document.getElementById('backToTop');
  const heroPhoto = document.querySelector('.hero-photo');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateChrome = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.65);
  };

  window.addEventListener('scroll', updateChrome, { passive: true });
  updateChrome();

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.classList.toggle('active', open);
      menuButton.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', event => {
      if (link.getAttribute('href') === '#top') {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      nav.classList.remove('open');
      menuButton.classList.remove('active');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  if (heroPhoto && !reduceMotion) {
    window.addEventListener('scroll', () => {
      heroPhoto.style.transform = `translateY(${Math.min(window.scrollY * 0.06, 22)}px)`;
    }, { passive: true });
  }
}());
