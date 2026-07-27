"use strict";

const header = document.getElementById("siteHeader");
const backTop = document.getElementById("backTop");
const menuButton = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

function updateScroll() {
  const y = window.scrollY;
  header?.classList.toggle("scrolled", y > 40);
  backTop?.classList.toggle("visible", y > 560);
}

function setMobileNav(open) {
  if (!menuButton || !mobileNav) return;
  mobileNav.classList.toggle("open", open);
  menuButton.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
}

function openLightbox(src, caption) {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  lightboxImage.src = src;
  lightboxImage.alt = caption || "";
  lightboxCaption.textContent = caption || "";
  lightbox.showModal?.();
}

function closeLightbox() {
  if (!lightbox?.open) return;
  lightbox.close?.();
  if (lightboxImage) lightboxImage.src = "";
}

window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    setMobileNav(!mobileNav.classList.contains("open"));
  });
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMobileNav(false));
  });
}

backTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    if (!img) return;
    openLightbox(img.currentSrc || img.src, item.dataset.caption || img.alt);
  });
});

document.querySelectorAll(".activity-image[data-images]").forEach((container) => {
  const images = container.dataset.images.split(",").map((s) => s.trim()).filter(Boolean);
  const caption = container.dataset.caption || "";
  const img = container.querySelector("img");
  const count = container.querySelector(".carousel-count");
  const prev = container.querySelector(".carousel-prev");
  const next = container.querySelector(".carousel-next");
  let index = 0;

  if (!img || images.length === 0) return;

  if (images.length <= 1) {
    container.classList.add("single");
  } else {
    const show = (i) => {
      index = (i + images.length) % images.length;
      img.src = "image/" + images[index];
      if (count) count.textContent = `${index + 1} / ${images.length}`;
    };
    prev?.addEventListener("click", (e) => {
      e.stopPropagation();
      show(index - 1);
    });
    next?.addEventListener("click", (e) => {
      e.stopPropagation();
      show(index + 1);
    });
  }

  img.addEventListener("click", () => {
    openLightbox(img.currentSrc || img.src, caption);
  });
});

if (lightbox) {
  lightbox.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (lightbox?.open) closeLightbox();
  setMobileNav(false);
});

const revealElements = document.querySelectorAll(".reveal");
if (revealElements.length) {
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }
}
