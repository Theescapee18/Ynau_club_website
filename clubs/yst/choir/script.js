(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.getElementById('menuButton');
  const nav = document.getElementById('siteNav');
  const backToTop = document.getElementById('backToTop');
  const closeMenu = () => { nav.classList.remove('open'); menuButton.classList.remove('active'); menuButton.setAttribute('aria-expanded', 'false'); };
  const updateScrollState = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
    backToTop.classList.toggle('visible', window.scrollY > 520);
  };
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();
  menuButton.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.classList.toggle('active', open); menuButton.setAttribute('aria-expanded', String(open)); });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  const sections = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .1 });
    sections.forEach((section) => observer.observe(section));
  } else sections.forEach((section) => section.classList.add('visible'));
})();
