(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.getElementById('menuButton');
  const nav = document.getElementById('siteNav');
  const backToTop = document.getElementById('backToTop');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeMenu = () => {
    nav.classList.remove('open');
    menuButton.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  const updateScrollState = () => {
    const showTop = window.scrollY > 520;
    header.classList.toggle('scrolled', window.scrollY > 8);
    backToTop.classList.toggle('visible', showTop);
    backToTop.hidden = !showTop;
    backToTop.disabled = !showTop;
  };

  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  const sections = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.1 });
    sections.forEach((section) => observer.observe(section));
  } else {
    sections.forEach((section) => section.classList.add('visible'));
  }
})();
