"use strict";

const header = document.getElementById("siteHeader");
const backTop = document.getElementById("backTop");
const menuButton = document.getElementById("menuButton");
const mobileNav = document.getElementById("mobileNav");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const inkSections = document.querySelectorAll(".about-section, .gallery-section, .activities-section");

function updateScrollState() {
  header.classList.toggle("scrolled", window.scrollY > 50);
  backTop.classList.toggle("visible", window.scrollY > 600);

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const viewportCenter = window.innerHeight / 2;
    inkSections.forEach((section) => {
      const sectionCenter = section.getBoundingClientRect().top + section.offsetHeight / 2;
      const offset = Math.max(-72, Math.min(72, (viewportCenter - sectionCenter) * 0.16));
      section.style.setProperty("--ink-drift", `${offset}px`);
    });
  }
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

menuButton.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuButton.classList.toggle("open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = item.dataset.caption;
    lightbox.showModal();
  });
});

function closeLightbox() {
  lightbox.close();
  lightboxImage.src = "";
}

lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => observer.observe(item));
