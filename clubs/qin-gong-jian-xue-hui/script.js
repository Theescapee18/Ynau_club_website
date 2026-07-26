"use strict";

(function () {
  const siteHeader = document.getElementById("siteHeader");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const backToTop = document.getElementById("backToTop");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  function updateScrollState() {
    const scrolled = window.scrollY > 30;
    if (siteHeader) siteHeader.classList.toggle("scrolled", scrolled);
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 480);
  }
  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  function setMenuOpen(open) {
    if (!siteHeader || !mobileMenuBtn || !mobileNav) return;
    siteHeader.classList.toggle("menu-open", open);
    mobileMenuBtn.setAttribute("aria-expanded", String(open));
    mobileMenuBtn.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    document.body.classList.toggle("menu-open", open);
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      const isOpen = siteHeader.classList.contains("menu-open");
      setMenuOpen(!isOpen);
    });
  }

  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setMenuOpen(false));
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) setMenuOpen(false);
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function openLightbox(src, alt, caption) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightboxCaption.textContent = caption || alt || "";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox && lightbox.classList.contains("is-open")) closeLightbox();
      else setMenuOpen(false);
    }
  });

  const galleryThumbs = document.querySelectorAll(".gallery-item");
  galleryThumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const img = thumb.querySelector("img");
      if (!img) return;
      openLightbox(img.currentSrc || img.src, img.alt, thumb.dataset.caption || img.alt || "");
    });
  });

  const honorImgs = document.querySelectorAll(".honor-img img");
  honorImgs.forEach((img) => {
    img.addEventListener("click", () => openLightbox(img.currentSrc || img.src, img.alt, ""));
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target;
          if (target.classList.contains("gallery-item") && target.parentElement) {
            const siblings = Array.from(target.parentElement.children).filter(
              (el) => el.classList && el.classList.contains("gallery-item")
            );
            const index = siblings.indexOf(target);
            target.style.transitionDelay = (index >= 0 ? index * 70 : 0) + "ms";
          }
          target.classList.add("is-visible");
          revealObserver.unobserve(target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const navLinks = document.querySelectorAll(".desktop-nav a, .mobile-nav a");
  const desktopNavLinks = document.querySelectorAll(".desktop-nav a");
  const sectionMap = {};
  navLinks.forEach((link) => {
    const hash = link.getAttribute("href");
    if (!hash || hash.charAt(0) !== "#") return;
    const target = document.querySelector(hash);
    if (target) sectionMap[hash] = target;
  });

  if ("IntersectionObserver" in window && sectionMap["#top"]) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          desktopNavLinks.forEach((a) => {
            a.classList.toggle("home-nav", a.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    Object.values(sectionMap).forEach((section) => observer.observe(section));
  }
})();