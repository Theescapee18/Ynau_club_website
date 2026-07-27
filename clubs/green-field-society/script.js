const header = document.getElementById('siteHeader');
const menuButton = document.getElementById('menuButton');
const mobileNav = document.getElementById('mobileNav');
const backTop = document.getElementById('backTop');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function closeMenu() {
  header.classList.remove('menu-open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '打开导航菜单');
}

menuButton.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
});

mobileNav.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1100) closeMenu();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
    if (lightbox.open) lightbox.close();
  }
});

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    header.classList.toggle('scrolled', window.scrollY > 24);
    backTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.7);
    ticking = false;
  });
}, { passive: true });

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach(item => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
}

const sectionLinks = new Map(
  [...document.querySelectorAll('.desktop-nav a')].map(link => [link.getAttribute('href').slice(1), link])
);
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    sectionLinks.forEach(link => link.classList.remove('active'));
    const activeLink = sectionLinks.get(entry.target.id);
    if (activeLink) activeLink.classList.add('active');
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });
document.querySelectorAll('main section[id]').forEach(section => navObserver.observe(section));

document.querySelectorAll('.gallery-item').forEach(button => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = button.dataset.caption;
    lightbox.showModal();
  });
});

document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});
