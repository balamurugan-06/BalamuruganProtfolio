document.addEventListener("DOMContentLoaded", () => {
  /* ── Mobile nav ─────────────────────────── */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu   = document.getElementById("nav-menu");

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    navToggle.classList.toggle("open");
  });

  /* Close menu on link click (mobile) */
  navMenu.querySelectorAll("a").forEach(link =>
    link.addEventListener("click", () => navMenu.classList.remove("open"))
  );

  /* ── Dark-mode toggle + persistence ─────── */
  const themeBtn = document.getElementById("theme-btn");
  const root     = document.documentElement;
  const stored   = localStorage.getItem("theme");
  if (stored) root.dataset.theme = stored;

  setThemeIcon();
  themeBtn.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", root.dataset.theme);
    setThemeIcon();
    lucide.createIcons();      // refresh icons after html change
  });

  function setThemeIcon() {
    themeBtn.innerHTML =
      root.dataset.theme === "dark"
        ? '<i data-lucide="sun"></i>'
        : '<i data-lucide="moon"></i>';
  }

  /* ── Highlight active nav link on scroll ── */
  const sections  = document.querySelectorAll("section[id]");
  const navLinks  = navMenu.querySelectorAll("a[href^='#']");

  window.addEventListener("scroll", () => {
    const y = window.scrollY + 200;
    sections.forEach(sec => {
      if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(l => l.classList.remove("active"));
        const active = navMenu.querySelector(`a[href="#${sec.id}"]`);
        active && active.classList.add("active");
      }
    });
  });

  /* ── Initialise AOS & Lucide ────────────── */
  AOS.init({ duration: 800, once: true });
  lucide.createIcons();
});



const typingTarget = document.getElementById("typing");
const hiddenName = document.getElementById("hidden-name");
const text = "Hello, I’m ";
const name = hiddenName.textContent.trim();
let index = 0;
let nameIndex = 0;

function typeEffect() {
  if (index < text.length) {
    typingTarget.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeEffect, 80);
  } else if (nameIndex < name.length) {
    typingTarget.innerHTML += name.charAt(nameIndex);
    nameIndex++;
    setTimeout(typeEffect, 100);
  }
}

window.addEventListener("load", () => {
  typingTarget.innerHTML = "";
  hiddenName.style.display = "none";
  typeEffect();
});
