const siteHeader = document.getElementById('siteHeader');
const menuButton = document.getElementById('menuButton');
const mobileNav = document.getElementById('mobileNav');
const backTop = document.getElementById('backTop');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const galleryGrid = document.querySelector('.gallery-grid');

function setMenu(open) {
  menuButton.classList.toggle('active', open);
  mobileNav.classList.toggle('open', open);
  siteHeader.classList.toggle('menu-visible', open);
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
}

function updateScrollState() {
  const isScrolled = window.scrollY > 28;
  siteHeader.classList.toggle('is-scrolled', isScrolled);
  backTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.7);
}

menuButton.addEventListener('click', () => {
  setMenu(!mobileNav.classList.contains('open'));
});

mobileNav.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

window.addEventListener('resize', () => {
  const menuIsOpen = mobileNav.classList.contains('open');
  const menuButtonIsHidden = getComputedStyle(menuButton).display === 'none';
  if (menuIsOpen && menuButtonIsHidden) setMenu(false);
});

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

galleryGrid.addEventListener('click', (event) => {
  const item = event.target.closest('.gallery-item');
  if (!item) return;

  const image = item.querySelector('img');
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = item.dataset.caption || image.alt;
  lightbox.showModal();
});

function closeLightbox() {
  if (lightbox.open) lightbox.close();
}

function resetLightbox() {
  lightboxImage.removeAttribute('src');
  lightboxImage.alt = '';
  lightboxCaption.textContent = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('close', resetLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileNav.classList.contains('open')) setMenu(false);
});
