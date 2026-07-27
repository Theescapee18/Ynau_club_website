document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuButton = document.getElementById('menuButton');
  const mobileNav = document.getElementById('mobileNav');
  const backToTop = document.getElementById('backToTop');
  const links = document.querySelectorAll('.desktop-nav a, .mobile-nav a');
  const sections = document.querySelectorAll('main section[id]');

  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
  };

  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.classList.toggle('is-open', !expanded);
    mobileNav.classList.toggle('is-open', !expanded);
    mobileNav.setAttribute('aria-hidden', String(expanded));
  });

  links.forEach((link) => link.addEventListener('click', closeMenu));

  const updateHeader = () => {
    const scrolled = window.scrollY > 28;
    header.classList.toggle('is-scrolled', scrolled);
    const showTop = window.scrollY > window.innerHeight * .65;
    backToTop.hidden = !showTop;
    backToTop.disabled = !showTop;

    let current = 'top';
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 100) current = section.id;
    });
    links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightbox = document.getElementById('lightboxClose');

  document.querySelectorAll('.lightbox-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      lightboxImage.src = trigger.dataset.full;
      lightboxImage.alt = trigger.dataset.caption;
      lightboxCaption.textContent = trigger.dataset.caption;
      lightbox.showModal();
    });
  });

  closeLightbox.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.open) lightbox.close();
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    revealItems.forEach((item) => item.classList.add('is-pending'));
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: .12 });
    revealItems.forEach((item) => observer.observe(item));
  }
});
