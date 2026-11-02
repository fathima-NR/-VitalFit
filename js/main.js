const NAV_LINKS = [
  { href: "index.html", label: "Home" },
  { href: "programs.html", label: "Programs" },
  { href: "trainers.html", label: "Trainers" },
  { href: "schedule.html", label: "Schedule" },
  { href: "pricing.html", label: "Pricing" },
  { href: "about.html", label: "About" },
  { href: "contact.html", label: "Contact" },
];

const LOGO = `
  <a href="index.html" class="logo">
    <svg class="logo-mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 6l12 20L28 6" /><path d="M10 6l6 10 6-10" />
    </svg>
    VITALFIT
  </a>`;

function currentPage() {
  const file = location.pathname.split("/").pop();
  return file === "" ? "index.html" : file;
}

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const page = currentPage();
  el.className = "site-header";
  el.innerHTML = `
    <div class="container nav">
      ${LOGO}
      <nav class="nav-links" id="nav-links">
        ${NAV_LINKS.map(
          (l) => `<a href="${l.href}" class="${l.href === page ? "active" : ""}">${l.label}</a>`
        ).join("")}
      </nav>
      <div class="nav-actions">
        <a href="pricing.html" class="btn btn-dark">Join Now <span class="arrow">→</span></a>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
      </div>
    </div>`;

  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    links.classList.toggle("open");
  });
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.className = "site-footer";
  el.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          ${LOGO}
          <p>Personalized training, smarter nutrition and real results. Stronger every day, together.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>${NAV_LINKS.slice(1, 5).map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="about.html">About Us</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="pricing.html#faq">FAQ</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4>Stay in the loop</h4>
          <p>Weekly workouts, recipes and tips straight to your inbox.</p>
          <form class="newsletter" onsubmit="event.preventDefault(); this.querySelector('input').value=''; this.querySelector('button').textContent='Subscribed ✓';">
            <input type="email" placeholder="Your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} VitalFit. All rights reserved.</span>
        <span>Mon–Sat 5:00 AM – 11:00 PM · Sun 7:00 AM – 8:00 PM</span>
      </div>
    </div>`;
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((i) => i.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((i) => io.observe(i));
}

function initFilters() {
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const target = document.querySelector(group.dataset.filterGroup);
    group.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      group.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      target.querySelectorAll("[data-category]").forEach((item) => {
        const match = f === "all" || item.dataset.category.split(" ").includes(f);
        item.style.display = match ? "" : "none";
      });
    });
  });
}

function initPricingToggle() {
  const sw = document.getElementById("billing-switch");
  if (!sw) return;
  sw.addEventListener("click", () => {
    const yearly = sw.classList.toggle("on");
    document.querySelectorAll("[data-monthly]").forEach((el) => {
      el.textContent = yearly ? el.dataset.yearly : el.dataset.monthly;
    });
    document.querySelectorAll(".period").forEach((el) => {
      el.textContent = yearly ? "/mo, billed yearly" : "/month";
    });
  });
}

function initFaq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : 0;
    });
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("[name=name]").value.trim();
    form.querySelector(".form-msg").textContent = `Thanks ${name || "there"}! Our team will get back to you within 24 hours.`;
    form.reset();
  });
}

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = parseFloat(el.dataset.count);
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const suffix = el.dataset.suffix || "";
      const start = performance.now();
      const step = (t) => {
        const p = Math.min((t - start) / 1400, 1);
        el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => io.observe(c));
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  initReveal();
  initFilters();
  initPricingToggle();
  initFaq();
  initContactForm();
  initCounters();
});
