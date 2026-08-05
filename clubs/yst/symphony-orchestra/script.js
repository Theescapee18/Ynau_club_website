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
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const openLightbox = (image) => {
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      const honorWrap = image.closest('.honor-img');
      let rotation = '';
      if (honorWrap) {
        if (honorWrap.classList.contains('honor-img-flip')) rotation = 'rotate(90deg)';
        else if (!honorWrap.classList.contains('honor-img-portrait')) rotation = 'rotate(-90deg)';
      }
      lightboxImage.style.transform = rotation;
      const fig = image.closest('figure');
      const cap = fig ? fig.querySelector('figcaption') : null;
      lightboxCaption.textContent = (cap && cap.textContent.trim()) ? cap.textContent.trim() : image.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      closeButton.focus();
    };
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImage.src = '';
      lightboxImage.style.transform = '';
    };
    document.querySelectorAll('.moments-grid figure img, .activity > img, .honor-card:not(.honor-card-text) img').forEach((image) => {
      image.classList.add('preview-image');
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', '查看' + image.alt);
      image.addEventListener('click', () => openLightbox(image));
      image.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(image); }
      });
    });
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
    window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });
  }
})();
