const header = document.getElementById('siteHeader');
const menuButton = document.getElementById('menuButton');
const mobileNav = document.getElementById('mobileNav');
const backTop = document.getElementById('backTop');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');

function closeMenu() {
  mobileNav.classList.remove('open');
  menuButton.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '打开导航菜单');
  document.body.classList.remove('menu-open');
}

function toggleMenu() {
  const open = mobileNav.classList.toggle('open');
  menuButton.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  document.body.classList.toggle('menu-open', open);
}

function updateScrollState() {
  header.classList.toggle('scrolled', window.scrollY > 24);
  backTop.classList.toggle('visible', window.scrollY > 620);
}

menuButton.addEventListener('click', toggleMenu);
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.querySelectorAll('.moment').forEach((item) => item.addEventListener('click', () => {
  const image = item.querySelector('img');
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = item.dataset.caption;
  lightbox.showModal();
}));

lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileNav.classList.contains('open')) closeMenu();
});

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 850) closeMenu();
});

updateScrollState();
