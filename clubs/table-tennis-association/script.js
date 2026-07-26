const header = document.querySelector('#site-header');
const menuButton = document.querySelector('#menu-button');
const mobileNav = document.querySelector('#mobile-nav');
const backToTop = document.querySelector('#back-to-top');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxCaption = document.querySelector('#lightbox-caption');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  mobileNav.hidden = !open;
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

function updateScrollState() {
  const scrolled = window.scrollY > 24;
  const showTop = window.scrollY > 620;
  header.classList.toggle('is-solid', scrolled);
  backToTop.hidden = !showTop;
  backToTop.disabled = !showTop;
}

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelectorAll('.gallery-card').forEach((card) => {
  card.addEventListener('click', () => {
    lightboxImage.src = card.dataset.image;
    lightboxImage.alt = card.querySelector('img').alt;
    lightboxCaption.textContent = card.dataset.caption;
    lightbox.showModal();
  });
});

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false);
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((item) => {
    item.classList.add('is-pending');
    observer.observe(item);
  });
}
