document.addEventListener('DOMContentLoaded', () => {
  // 移动端菜单切换
  const menuButton = document.getElementById('menuButton');
  const siteNav = document.getElementById('siteNav');

  if (menuButton && siteNav) {
    menuButton.addEventListener('click', () => {
      const isOpen = siteNav.classList.contains('open');
      if (isOpen) {
        siteNav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      } else {
        siteNav.classList.add('open');
        menuButton.setAttribute('aria-expanded', 'true');
      }
    });

    // 点击导航项关闭菜单
    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 返回顶部按钮逻辑
  const backTopBtn = document.getElementById('backTop');
  if (backTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backTopBtn.classList.add('visible');
      } else {
        backTopBtn.classList.remove('visible');
      }
    });

    backTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Lightbox 图片预览大图弹窗
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.querySelector('.lightbox-close');

  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption') || (img ? img.alt : '');
      if (img && lightbox && lightboxImage) {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt || caption;
        if (lightboxCaption) {
          lightboxCaption.textContent = caption;
        }
        lightbox.showModal();
      }
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => {
      lightbox.close();
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.close();
      }
    });
  }
});
