"use strict";

(() => {
  const header = document.getElementById("siteHeader");
  const menuButton = document.getElementById("menuButton");
  const siteNav = document.getElementById("siteNav");
  const backTop = document.getElementById("backTop");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const closeMenu = () => {
    siteNav.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  };

  const updateScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
    backTop.classList.toggle("visible", window.scrollY > 560);
  };

  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  menuButton.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    menuButton.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  const closeLightbox = () => {
    lightbox.close();
    lightboxImage.src = "";
  };

  document.querySelectorAll(".shot").forEach((item) => {
    item.addEventListener("click", () => {
      const image = item.querySelector("img");
      if (!image) return;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || "";
      lightboxCaption.textContent = item.dataset.caption || "";
      if (typeof lightbox.showModal === "function") lightbox.showModal();
    });
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.open) closeLightbox();
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((item) => observer.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add("is-visible"));
  }
})();
