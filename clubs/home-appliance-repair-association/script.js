const header = document.getElementById('siteHeader');
const menuButton = document.getElementById('menuButton');
const mobileNav = document.getElementById('mobileNav');
const backToTop = document.getElementById('backToTop');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktopNavQuery = window.matchMedia('(min-width: 1200px)');

function closeMenu({ restoreFocus = true } = {}) {
  const wasOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '打开导航菜单');
  mobileNav.classList.remove('is-open');
  mobileNav.setAttribute('aria-hidden', 'true');
  if (restoreFocus && wasOpen) menuButton.focus();
}

closeMenu({ restoreFocus: false });

menuButton.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menuButton.setAttribute('aria-label', willOpen ? '关闭导航菜单' : '打开导航菜单');
  mobileNav.classList.toggle('is-open', willOpen);
  mobileNav.setAttribute('aria-hidden', String(!willOpen));
});

mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  const target = document.getElementById(link.hash.slice(1));
  closeMenu({ restoreFocus: false });
  requestAnimationFrame(() => target?.focus({ preventScroll: true }));
}));

desktopNavQuery.addEventListener('change', (event) => {
  if (event.matches) closeMenu({ restoreFocus: false });
});

let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    header.classList.toggle('is-scrolled', window.scrollY > 16);
    backToTop.setAttribute('aria-hidden', String(window.scrollY < window.innerHeight * .65));
    scrollTicking = false;
  });
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

const homeLinks = document.querySelectorAll('a[href="#top"]');
homeLinks.forEach((homeLink) => homeLink.addEventListener('click', (event) => {
  event.preventDefault();
  closeMenu({ restoreFocus: false });
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  window.history.replaceState(null, '', '#top');
}));

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -36px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
