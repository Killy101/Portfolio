/* ═══════════════════════════════════════
   MJL PORTFOLIO — script.js
═══════════════════════════════════════ */

// ── Theme ──────────────────────────────
const root = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");

function setTheme(t) {
  root.setAttribute("data-theme", t);
  localStorage.setItem("mjl-theme", t);
  themeBtn.textContent = t === "dark" ? "Light" : "Dark";
}

(function initTheme() {
  const saved = localStorage.getItem("mjl-theme") || "dark";
  setTheme(saved);
})();

themeBtn.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

// ── Custom cursor ───────────────────────
(function initCursor() {
  const dot = document.getElementById("mjl-dot");
  const ring = document.getElementById("mjl-ring");
  const fine = window.matchMedia("(pointer: fine)").matches;
  const noMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (!fine || noMotion) return;

  document.body.classList.add("has-cursor");
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
  });

  (function tick() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(tick);
  })();

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("expanded"));
    el.addEventListener("mouseleave", () => ring.classList.remove("expanded"));
  });
})();

// ── Navbar scroll effect ────────────────
const navbar = document.getElementById("navbar");
window.addEventListener(
  "scroll",
  () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  },
  { passive: true },
);

// ── Active nav link on scroll ───────────
const sectionIds = [
  "hero",
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
];
const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.dataset.section === id);
        });
      }
    });
  },
  { threshold: 0.35 },
);

sectionIds.forEach((id) => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

// ── Smooth scroll for nav links ─────────
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

// ── Reveal on scroll ────────────────────
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in-view");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.05, rootMargin: "0px 0px -50px 0px" },
);

revealEls.forEach((el) => revealObserver.observe(el));

// ── Stat counter animation ──────────────
const statEls = document.querySelectorAll("[data-stat]");
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const n = parseInt(el.dataset.stat);
      const suffix = el.dataset.suffix !== undefined ? el.dataset.suffix : "+";
      if (isNaN(n)) return;
      let t0 = null;
      const dur = 1100;
      const run = (t) => {
        if (!t0) t0 = t;
        const p = Math.min((t - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(n * ease) + (p >= 1 ? suffix : "");
        if (p < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
      statObserver.unobserve(el);
    });
  },
  { threshold: 0.5 },
);

statEls.forEach((el) => statObserver.observe(el));

// ── Profile image grayscale toggle ──────
const profileImg = document.getElementById("profile-img");
if (profileImg) {
  profileImg.addEventListener("mouseenter", () => {
    profileImg.style.filter = "grayscale(0%)";
  });
  profileImg.addEventListener("mouseleave", () => {
    profileImg.style.filter = "grayscale(100%)";
  });
}

// ── Toast ───────────────────────────────
const toast = document.getElementById("toast");
let toastTimer;
function showToast(msg, ok = true) {
  toast.textContent = "";
  const icon = document.createElement("span");
  icon.textContent = ok ? "✓ " : "! ";
  icon.style.color = ok ? "var(--accent)" : "#ef4444";
  icon.style.fontWeight = "700";
  toast.appendChild(icon);
  toast.appendChild(document.createTextNode(msg));
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3500);
}

// ── Contact form ────────────────────────
const sendBtn = document.getElementById("send-btn");
sendBtn.addEventListener("click", () => {
  const name = document.getElementById("c-name").value.trim();
  const email = document.getElementById("c-email").value.trim();
  const msg = document.getElementById("c-msg").value.trim();

  if (!name || !email || !msg) {
    showToast("Please fill out all fields.", false);
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast("Enter a valid email address.", false);
    return;
  }
  const sub = encodeURIComponent("Portfolio Contact from " + name);
  const body = encodeURIComponent(
    "Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + msg,
  );
  window.location.href =
    "mailto:michaeljameslabitad018@gmail.com?subject=" + sub + "&body=" + body;
  showToast("Opening your email client…");
});
