"use strict";

const header = document.getElementById("siteHeader");
const backTop = document.getElementById("backTop");
const menuButton = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

function updateScroll() {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  if (backTop) {
    backTop.classList.toggle("visible", window.scrollY > 560);
  }
}

window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

function closeMobileNav() {
  if (!menuButton || !mobileNav) return;
  mobileNav.classList.remove("open");
  menuButton.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    menuButton.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileNav();
  });
}

if (backTop) {
  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const galleryItems = document.querySelectorAll(".gallery-item");
if (galleryItems.length > 0 && lightbox && lightboxImage && lightboxCaption) {
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (!img) return;
      lightboxImage.src = img.currentSrc || img.src;
      lightboxImage.alt = img.alt;
      lightboxCaption.textContent = item.dataset.caption || img.alt;
      if (typeof lightbox.showModal === "function") {
        lightbox.showModal();
      }
    });
  });

  const closeBtn = lightbox.querySelector(".lightbox-close");
  const closeLightbox = () => {
    if (typeof lightbox.close === "function") {
      lightbox.close();
    }
    lightboxImage.src = "";
  };

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}

const revealElements = document.querySelectorAll(".reveal");
if (revealElements.length > 0) {
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }
}