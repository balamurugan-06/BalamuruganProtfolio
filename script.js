/* =========================================================
   PORTFOLIO V2 JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
  ======================================================== */

  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  const themeBtn = document.getElementById("theme-btn");

  const root = document.documentElement;

  const sections = document.querySelectorAll("section[id]");

  const navLinks =
    document.querySelectorAll(
      '.nav-menu a[href^="#"]'
    );


  /* =======================================================
     MOBILE NAVIGATION
  ======================================================== */

  if (navToggle && navMenu) {

    navToggle.addEventListener("click", () => {

      const isOpen =
        navMenu.classList.toggle("open");

      navToggle.setAttribute(
        "aria-expanded",
        isOpen
      );

      navToggle.classList.toggle(
        "open",
        isOpen
      );

    });


    navLinks.forEach(link => {

      link.addEventListener("click", () => {

        navMenu.classList.remove("open");

        navToggle.classList.remove("open");

        navToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }


  /* =======================================================
     DARK MODE
  ======================================================== */

  const savedTheme =
    localStorage.getItem("theme");


  if (savedTheme) {

    root.dataset.theme =
      savedTheme;

  }
  else {

    const prefersDark =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

    if (prefersDark) {

      root.dataset.theme = "dark";

    }

  }


  updateThemeIcon();


  if (themeBtn) {

    themeBtn.addEventListener(
      "click",
      () => {

        const currentTheme =
          root.dataset.theme;

        const newTheme =
          currentTheme === "dark"
            ? "light"
            : "dark";

        root.dataset.theme =
          newTheme;

        localStorage.setItem(
          "theme",
          newTheme
        );

        updateThemeIcon();

        if (
          typeof lucide !== "undefined"
        ) {

          lucide.createIcons();

        }

      }
    );

  }


  function updateThemeIcon() {

    if (!themeBtn) return;

    const isDark =
      root.dataset.theme === "dark";

    themeBtn.innerHTML =
      isDark
        ? '<i data-lucide="sun"></i>'
        : '<i data-lucide="moon"></i>';

  }


  /* =======================================================
     ACTIVE NAV LINK
  ======================================================== */

  function updateActiveNav() {

    const scrollPosition =
      window.scrollY + 180;

    let currentSection = "";

    sections.forEach(section => {

      const sectionTop =
        section.offsetTop;

      const sectionHeight =
        section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition <
          sectionTop + sectionHeight
      ) {

        currentSection =
          section.getAttribute("id");

      }

    });


    navLinks.forEach(link => {

      link.classList.remove("active");

      const href =
        link.getAttribute("href");

      if (
        href === `#${currentSection}`
      ) {

        link.classList.add("active");

      }

    });

  }


  window.addEventListener(
    "scroll",
    updateActiveNav
  );

  updateActiveNav();


  /* =======================================================
     AOS ANIMATION
  ======================================================== */

  if (typeof AOS !== "undefined") {

    AOS.init({

      duration: 750,

      easing: "ease-out-cubic",

      once: true,

      offset: 80

    });

  }


  /* =======================================================
     LUCIDE ICONS
  ======================================================== */

  if (typeof lucide !== "undefined") {

    lucide.createIcons();

  }


  /* =======================================================
     HERO CODE CARD FLOATING EFFECT
  ======================================================== */

  const visualCard =
    document.querySelector(
      ".visual-card"
    );

  if (visualCard) {

    document.addEventListener(
      "mousemove",
      event => {

        const rect =
          visualCard.getBoundingClientRect();

        const centerX =
          rect.left + rect.width / 2;

        const centerY =
          rect.top + rect.height / 2;

        const distanceX =
          (event.clientX - centerX) / 80;

        const distanceY =
          (event.clientY - centerY) / 80;

        visualCard.style.transform =
          `
          perspective(1000px)
          rotateY(${-4 + distanceX}deg)
          rotateX(${2 - distanceY}deg)
          `;

      }
    );

  }


  /* =======================================================
     DISABLE FAKE LIVE DEMO LINKS
  ======================================================== */

  const disabledLinks =
    document.querySelectorAll(
      ".disabled-link"
    );

  disabledLinks.forEach(link => {

    link.addEventListener(
      "click",
      event => {

        event.preventDefault();

      }
    );

  });


  /* =======================================================
     CURRENT YEAR
  ======================================================== */

  const yearElement =
    document.querySelector(
      ".copyright"
    );

  if (yearElement) {

    yearElement.textContent =
      `© ${new Date().getFullYear()} Balamurugan Loganathan. All rights reserved.`;

  }

});
