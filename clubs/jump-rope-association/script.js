document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !expanded);
      mobileMenuBtn.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });

    // Close menu when clicking nav link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
      });
    });
  }

  // Scroll Header Effect
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      siteHeader.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
      siteHeader.style.background = 'rgba(11, 15, 25, 0.98)';
    } else {
      siteHeader.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.2)';
      siteHeader.style.background = 'rgba(11, 15, 25, 0.95)';
    }
  });

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Lightbox functionality (for Gallery and Honors)
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox && lightboxImage && lightboxCaption && lightboxClose) {
    const handleOpenLightbox = (src, caption) => {
      lightboxImage.src = src;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    };

    const handleCloseLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxImage.src = '';
        lightboxCaption.textContent = '';
      }, 300);
    };

    // Gallery click handlers
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.getAttribute('data-caption') || img.alt;
        handleOpenLightbox(img.src, caption);
      });
    });

    // Honor card click handlers
    document.querySelectorAll('.honor-card').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.getAttribute('data-caption') || img.alt;
        handleOpenLightbox(img.src, caption);
      });
    });

    lightboxClose.addEventListener('click', handleCloseLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        handleCloseLightbox();
      }
    });

    // Keyboard ESC to close lightbox
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        handleCloseLightbox();
      }
    });
  }

  // Back to Top button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
