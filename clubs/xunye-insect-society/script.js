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
    if (lightbox.open) closeLightbox();
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

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

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

function openLightbox(src, alt, caption, rotate) {
  lightboxImage.classList.toggle('ccw', rotate === 'ccw');
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightboxCaption.textContent = caption || '';
  lightbox.showModal();
}
function closeLightbox() {
  lightbox.close();
  lightboxImage.classList.remove('ccw');
}

document.querySelectorAll('.gallery-item').forEach(button => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    openLightbox(image.src, image.alt, button.dataset.caption, '');
  });
});

// 单图活动：点击打开灯箱
document.querySelectorAll('.activity-photo:not(.has-thumbs) img').forEach(img => {
  img.addEventListener('click', () => {
    const fig = img.closest('.activity-photo');
    const cap = fig.querySelector('figcaption');
    openLightbox(img.src, img.alt, cap ? cap.textContent : '', img.dataset.rotate || '');
  });
});

// 多图活动：缩略图切换 + 主图灯箱
document.querySelectorAll('.activity-photo.has-thumbs').forEach(photo => {
  const main = photo.querySelector('.activity-main');
  const thumbs = photo.querySelectorAll('.thumb');
  const counter = photo.querySelector('.photo-counter');
  const caption = photo.querySelector('figcaption');
  const total = thumbs.length;

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', (e) => {
      e.stopPropagation();
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const rotate = thumb.dataset.rotate || '';
      main.style.opacity = '0';
      setTimeout(() => {
        main.src = thumb.dataset.src;
        main.alt = thumb.querySelector('img').alt;
        main.dataset.caption = thumb.dataset.caption || '';
        main.dataset.rotate = rotate;
        main.classList.toggle('ccw', rotate === 'ccw');
        if (caption) caption.textContent = thumb.dataset.caption || '';
        if (counter) counter.textContent = (i + 1) + ' / ' + total;
        main.style.opacity = '';
      }, 160);
    });
  });

  // 点击主图打开灯箱
  main.addEventListener('click', (e) => {
    e.stopPropagation();
    openLightbox(main.src, main.alt, main.dataset.caption || '', main.dataset.rotate || '');
  });
});

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});
