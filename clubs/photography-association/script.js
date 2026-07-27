const header = document.querySelector('.site-header');
const menuButton = document.querySelector('#menuButton');
const siteNav = document.querySelector('#siteNav');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightboxImage');
const lightboxClose = document.querySelector('.lightbox-close');
const menuBreakpoint = window.matchMedia('(max-width: 900px)');

function setMenuOpen(open, restoreFocus = false) {
  const wasOpen = menuButton.getAttribute('aria-expanded') === 'true';
  const isOpen = menuBreakpoint.matches && open;

  menuButton.setAttribute('aria-expanded', String(isOpen));
  siteNav.classList.toggle('is-open', isOpen);
  header.classList.toggle('is-menu-open', isOpen);
  siteNav.setAttribute('aria-hidden', String(menuBreakpoint.matches && !isOpen));
  siteNav.inert = menuBreakpoint.matches && !isOpen;

  if (isOpen) {
    requestAnimationFrame(() => navLinks[0].focus());
  } else if (restoreFocus && wasOpen) {
    menuButton.focus();
  }
}

function closeMenu(restoreFocus = false) {
  setMenuOpen(false, restoreFocus);
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  setMenuOpen(!isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', () => closeMenu()));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu(true);
    if (lightbox.open) lightbox.close();
  }

  if (event.key !== 'Tab' || !menuBreakpoint.matches || !siteNav.classList.contains('is-open')) return;

  const firstLink = navLinks[0];
  const lastLink = navLinks.at(-1);
  if (event.shiftKey && document.activeElement === firstLink) {
    event.preventDefault();
    lastLink.focus();
  } else if (!event.shiftKey && document.activeElement === lastLink) {
    event.preventDefault();
    firstLink.focus();
  }
});

function updateHeaderState() {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}

window.addEventListener('scroll', updateHeaderState, { passive: true });
menuBreakpoint.addEventListener('change', () => setMenuOpen(false));
setMenuOpen(false);
updateHeaderState();

const observer = new IntersectionObserver((entries) => {
  const current = entries
    .filter((entry) => entry.isIntersecting)
    .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

  if (!current) return;
  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current.target.id}`));
}, { rootMargin: '-35% 0px -55% 0px', threshold: [0.05, 0.3, 0.6] });

sections.forEach((section) => observer.observe(section));

document.querySelectorAll('[data-image]').forEach((button) => {
  button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.image;
    lightboxImage.alt = button.dataset.alt;
    lightbox.showModal();
  });
});

lightboxClose.addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
