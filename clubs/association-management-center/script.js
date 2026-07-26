document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menuButton');
  const mobileNav = document.getElementById('mobileNav');
  const header = document.getElementById('siteHeader');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !isExpanded);
      menuButton.classList.toggle('is-active');
      mobileNav.classList.toggle('is-open');
      mobileNav.setAttribute('aria-hidden', isExpanded);
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.classList.remove('is-active');
        mobileNav.classList.remove('is-open');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }

    let currentSectionId = 'top';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 80;
      const sectionHeight = section.offsetHeight;
      if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}` || (currentSectionId === 'top' && href === '#top')) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const triggers = document.querySelectorAll('.lightbox-trigger');

  if (lightbox && lightboxImg && lightboxClose) {
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const fullImgUrl = trigger.getAttribute('data-full');
        const caption = trigger.getAttribute('data-caption') || '';

        lightboxImg.src = fullImgUrl;
        lightboxCaption.textContent = caption;
        
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  const galleries = document.querySelectorAll('.activity-gallery');
  galleries.forEach(gallery => {
    const mainImg = gallery.querySelector('.gallery-main-img');
    const mainBtn = gallery.querySelector('.gallery-main-btn');
    const thumbs = gallery.querySelectorAll('.thumb-item');
    const prevBtn = gallery.querySelector('.prev-btn');
    const nextBtn = gallery.querySelector('.next-btn');

    if (mainImg && mainBtn && thumbs.length > 0) {
      let currentIndex = 0;

      const updateGallery = (index) => {
        currentIndex = index;
        thumbs.forEach((t, idx) => {
          t.classList.toggle('active', idx === index);
        });

        const activeThumb = thumbs[index];
        const newSrc = activeThumb.getAttribute('data-src');
        const newCaption = activeThumb.getAttribute('data-caption');

        mainImg.src = newSrc;
        mainImg.alt = newCaption;
        mainBtn.setAttribute('data-full', newSrc);
        mainBtn.setAttribute('data-caption', newCaption);

        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      };

      thumbs.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => {
          updateGallery(idx);
        });
      });

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const prevIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
          updateGallery(prevIndex);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const nextIndex = (currentIndex + 1) % thumbs.length;
          updateGallery(nextIndex);
        });
      }
    }
  });

  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.9;
    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) {
        el.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll();
});
