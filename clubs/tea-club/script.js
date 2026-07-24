"use strict";

// 头部导航背景随滚动而变化，回到顶部按钮显示/隐藏
const header = document.getElementById("siteHeader");
const backTop = document.getElementById("backTop");
const menuButton = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

function updateScroll() {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }
  if (backTop) {
    backTop.classList.toggle("visible", window.scrollY > 600);
  }
}

window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

// 移动端菜单按钮点击展示
if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    menuButton.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  });

  // 点击移动端导航中的链接后，自动关闭菜单
  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menuButton.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

// 点击回到顶部
if (backTop) {
  backTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// 画廊 Lightbox 预览功能
const galleryItems = document.querySelectorAll(".gallery-item");
if (galleryItems.length > 0 && lightbox && lightboxImage && lightboxCaption) {
  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (img) {
        lightboxImage.src = img.currentSrc || img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = item.dataset.caption || img.alt;
        lightbox.showModal();
      }
    });
  });

  const closeBtn = lightbox.querySelector(".lightbox-close");
  const closeLightbox = () => {
    lightbox.close();
    lightboxImage.src = "";
  };

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  // 点击背景也可以关闭 Lightbox
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

// 揭显滚动动画效果 (Reveal on Scroll)
const revealElements = document.querySelectorAll(".reveal");
if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px" // 距离视口底部50px时提前触发
  });

  revealElements.forEach(el => revealObserver.observe(el));
}
