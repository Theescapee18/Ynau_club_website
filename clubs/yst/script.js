(() => {
      const header = document.getElementById('siteHeader');
      const menuButton = document.getElementById('menuButton');
      const nav = document.getElementById('siteNav');
      const backToTop = document.getElementById('backToTop');
      const lightbox = document.getElementById('lightbox');
      const lightboxImage = document.getElementById('lightboxImage');
      const lightboxCaption = document.getElementById('lightboxCaption');
      const closeButton = lightbox.querySelector('.lightbox-close');
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

      const closeMenu = () => {
        nav.classList.remove('open');
        menuButton.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
      };

      const updateScrollState = () => {
        header.classList.toggle('scrolled', window.scrollY > 8);
        backToTop.classList.toggle('visible', window.scrollY > 520);
      };

      window.addEventListener('scroll', updateScrollState, { passive: true });
      updateScrollState();

      menuButton.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        menuButton.classList.toggle('active', open);
        menuButton.setAttribute('aria-expanded', String(open));
      });
      nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
      backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' }));

      const revealItems = document.querySelectorAll('.reveal');
      if ('IntersectionObserver' in window && !reduceMotion.matches) {
        const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }), { threshold: .1 });
        revealItems.forEach((item) => observer.observe(item));
      } else {
        revealItems.forEach((item) => item.classList.add('visible'));
      }

      const openLightbox = (source) => {
        const image = source.matches('img') ? source : source.querySelector('img');
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = source.dataset.caption || image.alt;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        closeButton.focus();
      };
      const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImage.src = '';
      };

      document.querySelectorAll('.moment').forEach((button) => button.addEventListener('click', () => openLightbox(button)));
      document.querySelectorAll('.activity > img, .honor-card:not(.no-image) img').forEach((image) => {
        image.classList.add('preview-image');
        image.tabIndex = 0;
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', `查看${image.alt}`);
        image.addEventListener('click', () => openLightbox(image));
        image.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openLightbox(image);
          }
        });
      });
      closeButton.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
      window.addEventListener('keydown', (event) => { if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });
    })();
