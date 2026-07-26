const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav');
const backTop = document.querySelector('.back-top');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightboxImage');
const lightboxCaption = document.querySelector('#lightboxCaption');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setMenuOpen(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  mobileNav.classList.toggle('open', open);
  header.classList.toggle('menu-open', open);
  document.body.classList.toggle('menu-open', open);
}

function closeMenu() {
  setMenuOpen(false);
}

menuButton.addEventListener('click', () => {
  setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
});

mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

function updateScrollState() {
  const scrolled = window.scrollY > 20;
  header.classList.toggle('scrolled', scrolled);
  backTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.7);
}

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const navLinks = document.querySelectorAll('.desktop-nav a');
const navSections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55%' });
  navSections.forEach((section) => navObserver.observe(section));
}

document.querySelectorAll('.gallery-button').forEach((button) => {
  button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.image;
    lightboxImage.alt = button.querySelector('img').alt;
    lightboxCaption.textContent = button.dataset.caption;
    lightbox.showModal();
  });
});

lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1100) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
