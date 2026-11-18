/* =========================================================
   PORTFOLIO V3.1 — 3D EDITION (performance build)
   - GPU-morphing particle universe (shader-based, no per-frame CPU loops)
   - One shared animation ticker; every effect pauses when off-screen
   - Lite mode toggle (auto-enabled on low-power devices)
========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const isTouch = matchMedia("(hover: none)").matches;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;   // fewer particles
const veryLowPower = (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory || 8) <= 2; // 3D off by default

/* ---------- inline icons used in dynamic content (no re-scan needed) ---------- */
const SVG = {
  github: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/></svg>',
  "external-link": '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>'
};

/* =========================================================
   DATA — edit your projects here
   group: used by the filter chips (ai | bi | dev)
========================================================= */
const PROJECTS = [
  {
    title: "AI SQL Data Analyst Assistant", cat: "AI · Analytics", group: "ai",
    img: null, icon: "message-square-code", hue: ["#6d28d9", "#0e7490"],
    desc: "A web application that converts natural language questions into SQL queries for self-service data analysis.",
    points: [
      "Converts natural language questions into SQL queries for self-service data analysis, eliminating the need for SQL expertise among business stakeholders.",
      "Excel/CSV dataset upload and processing using Pandas, enabling dynamic SQL query execution on ingested files for code-free, ad-hoc reporting.",
      "Deployed on Render with cloud hosting and dependency management — a production-ready system with zero manual intervention for routine queries."
    ],
    stack: [["Deploy", "Render"], ["Frontend", "HTML/CSS · JavaScript"], ["Backend", "Python · Flask"], ["Data", "Pandas · SQL"]],
    links: [
      { label: "Live demo", href: "https://ai-sql-project-c1f2.onrender.com/", icon: "external-link" },
      { label: "GitHub", href: "https://github.com/balamurugan-06", icon: "github" }
    ]
  },
  {
    title: "iPaper — AI-Powered Document Management System", cat: "AI · Full Stack", group: "ai",
    img: null, icon: "file-search", hue: ["#4c1d95", "#be185d"],
    desc: "A secure document management system with role-based access control, PDF upload and in-browser document viewing.",
    points: [
      "Secure document management with role-based access control, PDF upload and in-browser viewing, engineered for enterprise-scale document operations.",
      "AI-powered text summarization and topic clustering using LLMs, reducing document review time through intelligent content discovery.",
      "PostgreSQL relational schema with audit logging, user management and metadata tracking for compliance-ready access control."
    ],
    stack: [["Deploy", "Render"], ["Frontend", "HTML/CSS · JavaScript"], ["Backend", "Python · Flask · OpenAI API"], ["Data", "PostgreSQL"]],
    links: [{ label: "Live demo", href: "https://ipaper-lflc.onrender.com", icon: "external-link" }]
  },
  {
    title: "Data Visualization Portfolio", cat: "BI · Tableau", group: "bi",
    imgs: ["assets/hdb-dashboard.png", "assets/sg-transport.png"],
    desc: "3+ interactive Tableau dashboards built on Singapore government open datasets.",
    points: [
      "Designed 3+ interactive Tableau dashboards using Singapore government open datasets, covering HDB resale price trends (2015–2023) and MRT/bus ridership patterns.",
      "Applied calculated fields, LOD expressions and filters to surface actionable insights for urban planning and policy analysis, communicating complex spatial and temporal trends clearly."
    ],
    stack: [["Insights", "Urban planning · Policy"], ["Visualize", "Tableau"], ["Techniques", "Calculated Fields · LOD · Filters"], ["Data", "Singapore Open Data · Excel"]],
    links: [{ label: "View dashboards", href: "https://baladashboardportfolio.netlify.app/", icon: "external-link" }]
  },
  {
    title: "Room Booking Application", cat: "Full Stack · Java", group: "dev",
    img: null, icon: "calendar-check", hue: ["#334155", "#7c3aed"],
    desc: "A full-stack room booking system with real-time availability tracking and an admin dashboard.",
    points: [
      "Full-stack room booking system with real-time availability tracking and intelligent conflict detection logic.",
      "Admin dashboard for managing reservations, reducing double-booking incidents to zero."
    ],
    stack: [["Frontend", "HTML/CSS · JavaScript"], ["Backend", "Java"], ["Data", "MySQL"]],
    links: [{ label: "GitHub", href: "https://github.com/balamurugan-06", icon: "github" }]
  },
  {
    title: "Static Portfolio Deployment on AWS Cloud", cat: "Cloud · AWS", group: "dev",
    img: null, icon: "cloud-cog", hue: ["#9a3412", "#7c3aed"],
    desc: "A portfolio website deployed on AWS EC2 and S3.",
    points: [
      "Deployed a portfolio website on AWS EC2 and S3, configuring cloud infrastructure and server routing.",
      "Set up MySQL database connectivity, gaining hands-on AWS deployment experience end-to-end."
    ],
    stack: [["Frontend", "HTML/CSS"], ["Compute", "AWS EC2"], ["Storage", "AWS S3"], ["Data", "MySQL"]],
    links: [{ label: "GitHub", href: "https://github.com/balamurugan-06", icon: "github" }]
  }
];

/* Skill cube — one face per resume category */
const SKILL_FACES = [
  { name: "Programming & Analytics", icon: "code-2", items: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "SQL", "MySQL", "PostgreSQL"] },
  { name: "Data Visualization & BI", icon: "layout-dashboard", items: ["Power BI", "DAX", "Power Query", "Data Modeling", "Tableau", "Calculated Fields", "LOD Expressions", "Excel", "PivotTables", "VLOOKUP", "INDEX-MATCH"] },
  { name: "Data Analytics", icon: "bar-chart-3", items: ["EDA", "Data Cleaning", "ETL Pipelines", "KPI Reporting", "Dashboard Development", "Statistical Analysis", "A/B Testing", "Regression Analysis"] },
  { name: "Machine Learning", icon: "brain-circuit", items: ["Supervised Learning", "Classification", "Regression", "Unsupervised Learning", "Clustering", "Segmentation", "Scikit-learn"] },
  { name: "Database & Cloud", icon: "cloud", items: ["PostgreSQL", "MySQL", "AWS EC2", "AWS S3"] },
  { name: "Tools & Platforms", icon: "wrench", items: ["Git", "Linux", "VS Code", "Jupyter Notebook", "PyCharm", "Render", "Flask"] }
];

const SPHERE_TAGS = [
  "Python", "SQL", "Power BI", "Tableau", "Excel", "Pandas", "NumPy", "DAX",
  "Power Query", "Scikit-learn", "PostgreSQL", "MySQL", "AWS", "Flask", "Git",
  "Linux", "Jupyter", "Matplotlib", "Seaborn", "EDA", "A/B Testing", "Regression",
  "Clustering", "ETL", "KPI Reporting", "LOD", "PyCharm", "Render", "VS Code", "VLOOKUP"
];

const DEV = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/";
const MARQUEE = [
  ["Python", DEV + "python/python-original.svg"], ["Pandas", DEV + "pandas/pandas-original.svg"],
  ["NumPy", DEV + "numpy/numpy-original.svg"], ["Power BI", null, "pie-chart"], ["Tableau", null, "bar-chart-3"],
  ["Excel", null, "table"], ["PostgreSQL", DEV + "postgresql/postgresql-original.svg"],
  ["MySQL", DEV + "mysql/mysql-original.svg"], ["Scikit-learn", DEV + "scikitlearn/scikitlearn-original.svg"],
  ["Matplotlib", DEV + "matplotlib/matplotlib-original.svg"], ["Jupyter", DEV + "jupyter/jupyter-original.svg"],
  ["Flask", null, "flask-conical"], ["AWS", DEV + "amazonwebservices/amazonwebservices-original-wordmark.svg"],
  ["Git", DEV + "git/git-original.svg"], ["Linux", DEV + "linux/linux-original.svg"],
  ["VS Code", DEV + "vscode/vscode-original.svg"], ["JavaScript", DEV + "javascript/javascript-original.svg"],
  ["Java", DEV + "java/java-original.svg"], ["PyCharm", DEV + "pycharm/pycharm-original.svg"]
];

/* =========================================================
   SHARED TICKER — one requestAnimationFrame for everything
   Each task runs only while its `active()` is true.
========================================================= */
const tasks = new Set();
let ticking = false;
function addTask(fn) { tasks.add(fn); if (!ticking) { ticking = true; requestAnimationFrame(tick); } }
function tick(t) {
  if (!document.hidden) tasks.forEach(fn => fn(t));
  requestAnimationFrame(tick);
}

/* Global pointer — read once, used by all effects */
const pointer = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0 };
addEventListener("pointermove", e => {
  pointer.x = e.clientX; pointer.y = e.clientY;
  pointer.nx = e.clientX / innerWidth - 0.5; pointer.ny = e.clientY / innerHeight - 0.5;
}, { passive: true });

/* Visibility helper */
function watchVisible(el, cb, margin = "100px") {
  new IntersectionObserver(([e]) => cb(e.isIntersecting), { rootMargin: margin }).observe(el);
}

/* =========================================================
   LITE MODE
========================================================= */
let lite = (() => {
  try { const s = localStorage.getItem("lite"); if (s !== null) return s === "1"; } catch {}
  return reduceMotion || veryLowPower;
})();
const liteListeners = [];
function applyLite() {
  document.documentElement.classList.toggle("lite", lite);
  const b = $("#lite-btn");
  if (b) { b.setAttribute("aria-pressed", String(lite)); b.title = lite ? "3D effects off — click to turn on" : "3D effects on — click for Lite mode"; }
  liteListeners.forEach(fn => fn(lite));
}
function initLite() {
  applyLite();
  $("#lite-btn").addEventListener("click", () => {
    lite = !lite;
    try { localStorage.setItem("lite", lite ? "1" : "0"); } catch {}
    applyLite();
  });
}

/* =========================================================
   LOADER (short)
========================================================= */
function runLoader() {
  const num = $("#loader-num"), bar = $("#loader-bar"), loader = $("#loader");
  document.body.classList.add("loading");
  const dur = reduceMotion ? 150 : 900, t0 = performance.now();
  const step = t => {
    const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    num.textContent = Math.round(e * 100);
    bar.style.transform = `scaleX(${e})`;
    if (p < 1) return requestAnimationFrame(step);
    loader.classList.add("done");
    document.body.classList.remove("loading");
    document.body.classList.add("ready");
    setTimeout(() => loader.remove(), 800);
  };
  requestAnimationFrame(step);
}

/* =========================================================
   NAV + SCROLL PROGRESS (cached offsets, no layout per scroll)
========================================================= */
function initNav() {
  const nav = $("#nav"), burger = $("#burger"), links = $("#nav-links"), prog = $("#progress");
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.classList.toggle("open", open); burger.setAttribute("aria-expanded", open);
  });
  $$("a", links).forEach(a => a.addEventListener("click", () => {
    links.classList.remove("open"); burger.classList.remove("open"); burger.setAttribute("aria-expanded", "false");
  }));

  const sections = $$("main section[id]");
  const navA = $$("a", links);
  let tops = [], maxScroll = 1;
  const measure = () => {
    tops = sections.map(s => [s.id, s.offsetTop]);
    maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  };
  measure(); addEventListener("resize", measure); addEventListener("load", measure);

  let pending = false, lastId = "";
  const update = () => {
    pending = false;
    const y = scrollY;
    nav.classList.toggle("scrolled", y > 30);
    prog.style.transform = `scaleX(${y / maxScroll})`;
    let cur = "";
    for (const [id, top] of tops) if (y + 200 >= top) cur = id;
    if (cur !== lastId) {
      lastId = cur;
      navA.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
    }
  };
  addEventListener("scroll", () => { if (!pending) { pending = true; requestAnimationFrame(update); } }, { passive: true });
  update();
  return measure;
}

/* =========================================================
   REVEAL + COUNTERS
========================================================= */
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$("[data-count]", e.target).forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 60 + "ms"; io.observe(el); });
}
function countUp(el) {
  if (el.dataset.done) return; el.dataset.done = 1;
  const target = +el.dataset.count, t0 = performance.now(), d = 1100;
  const step = t => {
    const p = Math.min(1, (t - t0) / d);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* =========================================================
   HERO — split letters + rotating word
========================================================= */
function initHero() {
  $$(".hero-title .word").forEach(w => {
    w.innerHTML = [...w.textContent].map((c, i) => `<span class="ch" style="--i:${i}">${c}</span>`).join("");
  });
  const el = $("#rotator");
  const words = ["actionable insights.", "KPI frameworks.", "dashboards.", "clear recommendations.", "real decisions."];
  let i = 0;
  setInterval(() => {
    if (document.hidden) return;
    el.classList.add("swap");
    setTimeout(() => { i = (i + 1) % words.length; el.textContent = words[i]; el.classList.remove("swap"); }, 300);
  }, 2600);
}

/* =========================================================
   POINTER FX — cursor glow, magnetic, tilt (rAF-batched)
========================================================= */
function initPointerFX() {
  if (isTouch) return;

  // cursor glow
  const glow = $("#cursor-glow");
  let gx = pointer.x, gy = pointer.y;
  addTask(() => {
    if (lite) return;
    gx += (pointer.x - gx) * 0.3; gy += (pointer.y - gy) * 0.3;
    glow.style.transform = `translate3d(${gx - 210}px, ${gy - 210}px, 0)`;
  });

  // magnetic + tilt: measure rect once on enter, update in rAF
  const bind = (el, onMove) => {
    let rect = null, raf = 0, ev = null;
    el.addEventListener("pointerenter", () => { rect = el.getBoundingClientRect(); el.classList.add("hovering"); });
    el.addEventListener("pointermove", e => {
      ev = e;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (rect && !lite) onMove(el, rect, ev); });
    });
    el.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf); raf = 0;
      el.classList.remove("hovering"); el.style.transform = "";
    });
  };

  $$(".magnetic").forEach(el => bind(el, (el, r, e) => {
    const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate3d(${x * 0.2}px, ${y * 0.28}px, 0)`;
  }));

  $$(".tilt").forEach(el => bind(el, (el, r, e) => {
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
    el.style.setProperty("--mx", (px + 0.5) * 100 + "%");
    el.style.setProperty("--my", (py + 0.5) * 100 + "%");
  }));

  // hero stage follows global pointer (only while hero visible)
  const stage = $("#stage-inner"), shine = $(".portrait-shine");
  let heroVisible = true, sx = 0, sy = 0;
  watchVisible($("#home"), v => (heroVisible = v), "0px");
  addTask(() => {
    if (!heroVisible || lite) return;
    sx += (pointer.nx - sx) * 0.12; sy += (pointer.ny - sy) * 0.12;
    stage.style.transform = `rotateY(${sx * 18}deg) rotateX(${-sy * 12}deg)`;
    shine.style.backgroundPosition = `${120 - (sx + 0.5) * 140}% 0`;
  });

  // badge
  const badgeStage = $(".badge-stage");
  bind(badgeStage, (_, r, e) => {
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    $(".badge-face").style.transform = `rotateY(${px * 30}deg) rotateX(${-py * 20}deg)`;
  });
  badgeStage.addEventListener("pointerleave", () => ($(".badge-face").style.transform = ""));
}

/* =========================================================
   3D PROJECT RING + FILTERS
========================================================= */
function initCarousel() {
  const ring = $("#carousel"), scene = $("#carousel-scene");
  let list = PROJECTS.slice(), cards = [], n = 0, radius = 0, stepDeg = 0;
  let angle = 0, target = 0, dragging = false, startX = 0, startAngle = 0, moved = 0, lastInteract = 0;
  let active = -1, visible = false;

  const build = () => {
    n = list.length; stepDeg = 360 / n; active = -1; angle = target = 0;
    $("#tot-idx").textContent = String(n).padStart(2, "0");
    ring.innerHTML = list.map((p, i) => {
      const thumb = p.imgs
        ? `<div class="duo">${p.imgs.map(src => `<img src="${src}" alt="${p.title} preview" loading="lazy" decoding="async" draggable="false" />`).join("")}</div>`
        : `<div class="art-grid"></div><div class="art-ico"><i data-lucide="${p.icon}"></i></div>`;
      const bg = p.imgs ? "" : `style="background:linear-gradient(135deg, ${p.hue[0]}, ${p.hue[1]})"`;
      return `<div class="p-card" data-i="${i}">
          <div class="p-thumb" ${bg}><span class="p-num">${String(PROJECTS.indexOf(p) + 1).padStart(2, "0")}</span>${thumb}</div>
          <div class="p-body"><small>${p.cat}</small><h3>${p.title}</h3><p>${p.desc}</p></div>
        </div>`;
    }).join("");
    if (window.lucide) lucide.createIcons();
    cards = $$(".p-card", ring);
    layout();
  };

  const layout = () => {
    if (!cards.length) return;
    const w = cards[0].offsetWidth;
    radius = n < 3 ? w * 0.9 : Math.round((w + 40) / (2 * Math.tan(Math.PI / n)));
    cards.forEach((c, i) => (c.style.transform = `rotateY(${stepDeg * i}deg) translateZ(${radius}px)`));
  };
  addEventListener("resize", layout);

  const setActive = idx => {
    if (idx === active) return;
    active = idx;
    cards.forEach((c, i) => {
      const d = Math.min((i - idx + n) % n, (idx - i + n) % n);
      c.classList.toggle("active", i === idx);
      c.classList.toggle("far", d >= 2);
    });
    $("#cur-idx").textContent = String(idx + 1).padStart(2, "0");
    renderDetail(list[idx]);
  };

  const go = dir => { target = Math.round(target / stepDeg) * stepDeg - dir * stepDeg; lastInteract = performance.now(); };
  $("#next").addEventListener("click", () => go(1));
  $("#prev").addEventListener("click", () => go(-1));

  scene.addEventListener("pointerdown", e => {
    dragging = true; moved = 0; startX = e.clientX; startAngle = target;
    scene.setPointerCapture(e.pointerId);
  });
  scene.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - startX; moved = Math.abs(dx);
    target = startAngle + dx * 0.4;
  });
  const end = () => { if (!dragging) return; dragging = false; lastInteract = performance.now(); target = Math.round(target / stepDeg) * stepDeg; };
  scene.addEventListener("pointerup", end);
  scene.addEventListener("pointercancel", end);

  ring.addEventListener("click", e => {
    if (moved > 6) return;
    const c = e.target.closest(".p-card"); if (!c) return;
    const cur = ((Math.round(-target / stepDeg) % n) + n) % n;
    let diff = +c.dataset.i - cur; if (diff > n / 2) diff -= n; if (diff < -n / 2) diff += n;
    target -= diff * stepDeg; lastInteract = performance.now();
  });

  scene.tabIndex = 0;
  scene.addEventListener("keydown", e => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); });

  // filters
  $$(".chip-filter").forEach(btn => btn.addEventListener("click", () => {
    $$(".chip-filter").forEach(b => b.classList.toggle("on", b === btn));
    const g = btn.dataset.group;
    list = g === "all" ? PROJECTS.slice() : PROJECTS.filter(p => p.group === g);
    ring.classList.add("swap");
    setTimeout(() => { build(); ring.classList.remove("swap"); }, 200);
  }));

  watchVisible(scene, v => (visible = v));
  addTask(t => {
    if (!visible || !n) return;
    if (!dragging && !reduceMotion && t - lastInteract > 5000) { go(1); lastInteract = t; }
    const diff = target - angle;
    if (Math.abs(diff) < 0.01 && !dragging) return; // idle → no style writes
    angle += diff * 0.16;
    ring.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`;
    setActive(((Math.round(-angle / stepDeg) % n) + n) % n);
  });

  build();
  ring.style.transform = `translateZ(${-radius}px) rotateY(0deg)`;
  setActive(0);
}

let detailTimer = 0;
function renderDetail(p) {
  const box = $("#project-detail");
  box.classList.add("swap");
  clearTimeout(detailTimer);
  detailTimer = setTimeout(() => {
    $("#pd-cat").textContent = p.cat;
    $("#pd-title").textContent = p.title;
    $("#pd-points").innerHTML = p.points.map(x => `<li>${x}</li>`).join("");
    $("#pd-links").innerHTML = p.links.map(l =>
      `<a href="${l.href}" target="_blank" rel="noopener">${SVG[l.icon] || ""}${l.label}</a>`).join("");
    const n = p.stack.length;
    $("#stack").innerHTML = p.stack.map(([layer, tech], i) =>
      `<div class="layer" style="--z:${n - 1 - i};--n:${n}"><small class="mono">${layer}</small><strong>${tech}</strong></div>`).join("");
    box.classList.remove("swap");
  }, 180);
}

/* =========================================================
   3D TAG SPHERE — pauses off-screen, transform/opacity only
========================================================= */
function initTagSphere() {
  const box = $("#tag-sphere");
  const hot = new Set(["Python", "SQL", "Power BI", "Tableau", "Excel"]);
  const els = SPHERE_TAGS.map(t => {
    const s = document.createElement("span");
    s.textContent = t; if (hot.has(t)) s.classList.add("hot");
    box.appendChild(s); return s;
  });
  const N = els.length;
  const pts = els.map((_, i) => {
    const phi = Math.acos(-1 + (2 * i + 1) / N), th = Math.sqrt(N * Math.PI) * phi;
    return [Math.cos(th) * Math.sin(phi), Math.sin(th) * Math.sin(phi), Math.cos(phi)];
  });
  const zCache = new Array(N).fill(-1);
  let ax = 0.003, ay = 0.004, tax = ax, tay = ay, rx = 0, ry = 0, R = 0, visible = false, rect = null;

  const measure = () => (R = box.offsetWidth * 0.4);
  measure(); addEventListener("resize", measure);
  box.addEventListener("pointerenter", () => (rect = box.getBoundingClientRect()));
  box.addEventListener("pointermove", e => {
    if (!rect) return;
    tay = ((e.clientX - rect.left) / rect.width - 0.5) * 0.04;
    tax = -((e.clientY - rect.top) / rect.height - 0.5) * 0.04;
  });
  box.addEventListener("pointerleave", () => { tax = 0.003; tay = 0.004; });

  watchVisible(box, v => (visible = v));
  addTask(() => {
    if (!visible) return;
    ax += (tax - ax) * 0.06; ay += (tay - ay) * 0.06;
    rx += lite ? ax * 0.4 : ax; ry += lite ? ay * 0.4 : ay;
    const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
    for (let i = 0; i < N; i++) {
      const [x, y, z] = pts[i];
      const y1 = y * cx - z * sx, z1 = y * sx + z * cx;
      const x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;
      const el = els[i];
      el.style.transform = `translate3d(${x2 * R}px, ${y1 * R}px, 0) translate(-50%,-50%) scale(${(z2 + 2) / 3})`;
      el.style.opacity = (0.25 + (z2 + 1) * 0.375).toFixed(2);
      const zb = z2 > 0 ? 2 : 1;           // only two layers → rare writes
      if (zCache[i] !== zb) { zCache[i] = zb; el.style.zIndex = zb; }
    }
  });
}

/* =========================================================
   MARQUEE / FLIP / FORM
========================================================= */
function initMarquee() {
  const html = MARQUEE.map(([name, src, ico]) => src
    ? `<div class="m-item"><img src="${src}" alt="" loading="lazy" decoding="async" width="26" height="26" onerror="this.remove()" />${name}</div>`
    : `<div class="m-item"><span class="m-ico"><i data-lucide="${ico}"></i></span>${name}</div>`).join("");
  $("#marquee").innerHTML = html + html;
}
function initFlip() {
  $$(".flip").forEach(f => f.addEventListener("click", e => {
    if (e.target.closest("a")) return;
    if (isTouch) f.classList.toggle("flipped");
  }));
}
function initForm() {
  $("#contact-form").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const subject = encodeURIComponent(`Portfolio enquiry from ${f.get("name")}`);
    const body = encodeURIComponent(`${f.get("message")}\n\n— ${f.get("name")} (${f.get("email")})`);
    location.href = `mailto:balamannai2002@gmail.com?subject=${subject}&body=${body}`;
    $("#form-note").textContent = "Your email app should open now — thanks for reaching out!";
  });
}

/* =========================================================
   THREE.JS — GPU MORPHING PARTICLE UNIVERSE
   All 5 shapes live on the GPU as attributes; the vertex shader
   blends them, so the CPU only sends a few uniforms per frame.
========================================================= */
async function initThree() {
  const canvas = $("#bg3d");
  let THREE;
  try { THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js"); }
  catch (err) { console.warn("Three.js unavailable — static background.", err); return; }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  } catch { return; }

  const mobile = innerWidth < 700;
  // soft glowing points don't need full resolution — rendering the canvas
  // at ~70% and letting CSS upscale it cuts GPU fill cost roughly in half
  const DPR = Math.min(devicePixelRatio, mobile ? 1.25 : 1.5) * 0.7;
  renderer.setPixelRatio(DPR);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const N = mobile || lowPower ? 2400 : 4200;
  const rnd = (a, b) => a + Math.random() * (b - a);

  // ---- build shapes (order = scroll order) ----
  const globe = new Float32Array(N * 3), bars = new Float32Array(N * 3), helix = new Float32Array(N * 3),
    wave = new Float32Array(N * 3), galaxy = new Float32Array(N * 3), scatter = new Float32Array(N * 3);
  const G = 7, gap = 0.75, w = 0.26, side = Math.ceil(Math.sqrt(N));
  const heights = Array.from({ length: G * G }, (_, k) => 0.6 + Math.abs(Math.sin((k % G) * 1.3 + Math.floor(k / G) * 0.7)) * 2.6 + Math.random() * 0.6);

  for (let i = 0; i < N; i++) {
    const j = i * 3;
    // globe
    const phi = Math.acos(-1 + (2 * i) / N), th = Math.sqrt(N * Math.PI) * phi;
    const r = 2.4 + (Math.random() < 0.15 ? rnd(0.1, 0.6) : 0);
    globe[j] = r * Math.cos(th) * Math.sin(phi); globe[j + 1] = r * Math.sin(th) * Math.sin(phi); globe[j + 2] = r * Math.cos(phi);
    // bars
    const k = i % (G * G), h = heights[k];
    bars[j] = (k % G - (G - 1) / 2) * gap + rnd(-w, w); bars[j + 1] = rnd(0, h) - 1.8; bars[j + 2] = (Math.floor(k / G) - (G - 1) / 2) * gap + rnd(-w, w);
    // helix
    const t = (i / N) * Math.PI * 8, strand = i % 3, hx = (i / N - 0.5) * 11;
    if (strand < 2) { const off = strand ? Math.PI : 0; helix[j] = hx; helix[j + 1] = Math.cos(t + off) * 1.3; helix[j + 2] = Math.sin(t + off) * 1.3; }
    else { const s = rnd(-1, 1); helix[j] = hx; helix[j + 1] = Math.cos(t) * 1.3 * s; helix[j + 2] = Math.sin(t) * 1.3 * s; }
    // wave
    const x = ((i % side) / side - 0.5) * 10, z = (Math.floor(i / side) / side - 0.5) * 10;
    wave[j] = x; wave[j + 2] = z; wave[j + 1] = Math.sin(x * 0.9) * Math.cos(z * 0.9) * 0.9 - 1.2;
    // galaxy
    const gr = Math.pow(Math.random(), 1.6) * 5, ang = ((i % 4) / 4) * Math.PI * 2 + gr * 0.9;
    galaxy[j] = Math.cos(ang) * gr + rnd(-.25, .25); galaxy[j + 1] = rnd(-.2, .2) * (1.2 - gr / 5); galaxy[j + 2] = Math.sin(ang) * gr + rnd(-.25, .25);
    // intro scatter
    scatter[j] = rnd(-12, 12); scatter[j + 1] = rnd(-12, 12); scatter[j + 2] = rnd(-12, 12);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(globe, 3)); // also s0
  geo.setAttribute("s1", new THREE.BufferAttribute(bars, 3));
  geo.setAttribute("s2", new THREE.BufferAttribute(helix, 3));
  geo.setAttribute("s3", new THREE.BufferAttribute(wave, 3));
  geo.setAttribute("s4", new THREE.BufferAttribute(galaxy, 3));
  geo.setAttribute("sc", new THREE.BufferAttribute(scatter, 3));

  const col = new Float32Array(N * 3), seed = new Float32Array(N);
  const cA = new THREE.Color("#8b5cf6"), cB = new THREE.Color("#22d3ee"), cC = new THREE.Color("#d946ef"), tmp = new THREE.Color();
  for (let i = 0; i < N; i++) {
    tmp.copy(cA).lerp(Math.random() < .5 ? cB : cC, Math.random() * 0.9);
    col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
    seed[i] = Math.random() * 6.28;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  geo.setAttribute("seed", new THREE.BufferAttribute(seed, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 14);

  const uniforms = {
    uShape: { value: 0 }, uIntro: { value: 0 }, uTime: { value: 0 },
    uSize: { value: 1 }
  };

  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
    vertexShader: `
      attribute vec3 s1; attribute vec3 s2; attribute vec3 s3; attribute vec3 s4; attribute vec3 sc;
      attribute float seed;
      uniform float uShape, uIntro, uTime, uSize;
      varying vec3 vColor;
      float w(float i){ return clamp(1.0 - abs(uShape - i), 0.0, 1.0); }
      void main(){
        vec3 p = position*w(0.0) + s1*w(1.0) + s2*w(2.0) + s3*w(3.0) + s4*w(4.0);
        p = mix(sc, p, uIntro);
        p += 0.04 * vec3(sin(uTime*1.2+seed), cos(uTime+seed), sin(uTime*0.8+seed*2.0));
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize / -mv.z;
        vColor = color;
      }`,
    fragmentShader: `
      varying vec3 vColor;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        if (a < 0.02) discard;
        gl_FragColor = vec4(vColor, a * 0.85);
      }`
  });

  const group = new THREE.Group();
  group.add(new THREE.Points(geo, mat));
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.16 }));
  group.add(core);
  scene.add(group);

  // distant stars (static geometry, rotated as a whole)
  const SN = mobile ? 400 : 800, sPos = new Float32Array(SN * 3);
  for (let i = 0; i < SN * 3; i++) sPos[i] = rnd(-30, 30);
  const sGeo = new THREE.BufferGeometry(); sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
  const stars = new THREE.Points(sGeo, new THREE.PointsMaterial({ size: 0.05, color: 0x9d8cff, transparent: true, opacity: 0.45, depthWrite: false }));
  scene.add(stars);

  const resize = () => {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    uniforms.uSize.value = (mobile ? 0.07 : 0.06) * innerHeight * 0.5 * DPR; // same look as size-attenuated points
    measure();
  };

  // scroll → shape: cached anchors
  const ids = ["home", "projects", "skills", "education", "contact"];
  let tops = [];
  const measure = () => (tops = ids.map(id => document.getElementById(id).offsetTop));
  resize(); addEventListener("resize", resize); addEventListener("load", measure);

  const targetShape = () => {
    const y = scrollY + innerHeight * 0.5;
    for (let i = 0; i < tops.length - 1; i++) {
      if (y < tops[i + 1]) {
        const p = Math.max(0, Math.min(1, (y - tops[i]) / (tops[i + 1] - tops[i])));
        const e = p < 0.6 ? 0 : (p - 0.6) / 0.4;
        return i + e * e * (3 - 2 * e);
      }
    }
    return tops.length - 1;
  };

  const clock = new THREE.Clock();
  let shape = 0, cx = 0, cy = 0, gxPos = 0, lastFrame = 0;
  const frameGap = mobile || lowPower ? 1000 / 40 : 0;   // cap to ~40fps on weaker devices

  liteListeners.push(on => { canvas.style.opacity = on ? "0" : "1"; });
  canvas.style.opacity = lite ? "0" : "1";

  addTask(now => {
    if (lite) return;
    if (frameGap && now - lastFrame < frameGap) return;
    lastFrame = now;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    uniforms.uIntro.value = Math.min(1, uniforms.uIntro.value + 0.018);
    shape += (targetShape() - shape) * 0.06;
    uniforms.uShape.value = shape;

    cx += (pointer.nx - cx) * 0.05; cy += (pointer.ny - cy) * 0.05;
    group.rotation.y = t * 0.08 + cx * 0.6;
    group.rotation.x = 0.25 + cy * 0.3;
    core.rotation.set(t * 0.3, t * 0.2, 0);
    core.visible = shape < 0.5;
    stars.rotation.y = t * 0.01;

    const heroOffset = innerWidth > 880 ? 2.2 : 0;
    gxPos += (heroOffset * Math.max(0, 1 - scrollY / innerHeight) - gxPos) * 0.08;
    group.position.x = gxPos;
    camera.position.x = cx * 0.8; camera.position.y = -cy * 0.6;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  });
}

/* =========================================================
   3D SKILL CUBE — drag to rotate, tabs snap to a face
========================================================= */
function initCube() {
  const cube = $("#cube"), scene = $("#cube-scene"), tabs = $("#cube-tabs");
  // face orientations: front, right, back, left, top, bottom
  const faces = [[0, 0], [0, -90], [0, -180], [0, 90], [-90, 0], [90, 0]];
  const place = ["rotateY(0deg)", "rotateY(90deg)", "rotateY(180deg)", "rotateY(-90deg)", "rotateX(90deg)", "rotateX(-90deg)"];

  cube.innerHTML = SKILL_FACES.map((f, i) => `
    <div class="face" style="--place:${place[i]}">
      <div class="face-head"><i data-lucide="${f.icon}"></i><span class="mono">0${i + 1}</span></div>
      <h3>${f.name}</h3>
      <div class="face-tags">${f.items.map(x => `<span>${x}</span>`).join("")}</div>
    </div>`).join("");
  tabs.innerHTML = SKILL_FACES.map((f, i) =>
    `<button role="tab" data-i="${i}" class="${i ? "" : "on"}">${f.name}</button>`).join("");

  let rx = -18, ry = 28, trx = rx, try_ = ry, dragging = false, sx = 0, sy = 0, srx = 0, sry = 0;
  let visible = false, lastInteract = 0, settled = false;

  const pick = i => {
    const [fx, fy] = faces[i];
    // shortest path on Y
    const k = Math.round((try_ - fy) / 360);
    trx = fx - 12; try_ = fy + k * 360 + 18;
    lastInteract = performance.now(); settled = false;
    $$("button", tabs).forEach(b => b.classList.toggle("on", +b.dataset.i === i));
  };
  tabs.addEventListener("click", e => { const b = e.target.closest("button"); if (b) pick(+b.dataset.i); });

  scene.addEventListener("pointerdown", e => {
    dragging = true; settled = false; sx = e.clientX; sy = e.clientY; srx = trx; sry = try_;
    scene.setPointerCapture(e.pointerId);
  });
  scene.addEventListener("pointermove", e => {
    if (!dragging) return;
    try_ = sry + (e.clientX - sx) * 0.5;
    trx = Math.max(-80, Math.min(80, srx - (e.clientY - sy) * 0.5));
  });
  const end = () => { dragging = false; lastInteract = performance.now(); };
  scene.addEventListener("pointerup", end); scene.addEventListener("pointercancel", end);

  watchVisible(scene, v => (visible = v));
  addTask(t => {
    if (!visible) return;
    if (!dragging && !lite && !reduceMotion && t - lastInteract > 4000) { try_ += 0.15; settled = false; }
    const d = Math.abs(trx - rx) + Math.abs(try_ - ry);
    if (d < 0.02) { if (settled) return; settled = true; }
    rx += (trx - rx) * 0.12; ry += (try_ - ry) * 0.12;
    cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
}

/* =========================================================
   CERT DECK (tap to fan on touch) + 3D RESUME PAPER
========================================================= */
function initDeckAndPaper() {
  const deck = $("#deck");
  deck.addEventListener("click", () => { if (isTouch) deck.classList.toggle("open"); });

  if (isTouch) return;
  const scene = $("#paper-scene"), paper = $("#paper");
  let rect = null, raf = 0, ev = null;
  scene.addEventListener("pointerenter", () => { rect = scene.getBoundingClientRect(); scene.classList.add("hovering"); });
  scene.addEventListener("pointermove", e => {
    ev = e;
    if (!raf) raf = requestAnimationFrame(() => {
      raf = 0; if (!rect || lite) return;
      const px = (ev.clientX - rect.left) / rect.width - 0.5, py = (ev.clientY - rect.top) / rect.height - 0.5;
      paper.style.transform = `rotateY(${-14 + px * 26}deg) rotateX(${8 - py * 18}deg)`;
    });
  });
  scene.addEventListener("pointerleave", () => { scene.classList.remove("hovering"); paper.style.transform = ""; });
}

/* =========================================================
   BOOT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  $("#copyright").textContent = `© ${new Date().getFullYear()} Balamurugan Loganathan · Built with data & a little Three.js`;
  initLite();
  initHero();
  initMarquee();
  initCarousel();
  runLoader();
  initNav();
  initReveal();
  initPointerFX();
  initTagSphere();
  initCube();
  initDeckAndPaper();
  if (window.lucide) lucide.createIcons();
  initFlip();
  initForm();
  // start WebGL after first paint so the page is interactive immediately
  (window.requestIdleCallback || (fn => setTimeout(fn, 200)))(() => initThree(), { timeout: 1200 });
});
