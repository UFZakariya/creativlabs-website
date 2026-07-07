/* Creativ Labs v2 — interactions */
(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // SVG backdrop filters render only in Chromium; @supports cannot detect that
  // (other engines parse url() as valid, then drop the whole filter chain).
  if (navigator.userAgentData && navigator.userAgentData.brands.some((b) => /Chromium/i.test(b.brand))) {
    document.documentElement.classList.add("svg-backdrop");
  }

  /* ============================================================
     1. Hero logo — static mark, pointer-reactive: leans toward the
        cursor, a specular light sweeps its silhouette, pops on click
     ============================================================ */
  (() => {
    const stage = document.getElementById("logo-stage");
    const wrap = document.getElementById("logo-wrap");
    const hero = document.querySelector(".hero");
    if (!stage || !wrap || !hero) return;

    // click / tap pop — works on every device
    stage.addEventListener("pointerdown", () => {
      wrap.classList.remove("logo-pop");
      void wrap.offsetWidth; // restart the animation
      wrap.classList.add("logo-pop");
    });

    if (!finePointer || reducedMotion) return;

    let raf = 0;
    hero.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = stage.getBoundingClientRect();
        if (!r.width) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const reach = Math.max(r.width, 240) * 1.5;
        const pull = Math.max(0, 1 - Math.hypot(dx, dy) / reach);
        wrap.style.setProperty("--px", `${((dx / reach) * 30 * pull).toFixed(1)}px`);
        wrap.style.setProperty("--py", `${((dy / reach) * 22 * pull).toFixed(1)}px`);
        const lx = Math.max(-20, Math.min(120, ((e.clientX - r.left) / r.width) * 100));
        const ly = Math.max(-20, Math.min(120, ((e.clientY - r.top) / r.height) * 100));
        wrap.style.setProperty("--lx", `${lx.toFixed(1)}%`);
        wrap.style.setProperty("--ly", `${ly.toFixed(1)}%`);
        wrap.style.setProperty("--lo", (pull * 0.9).toFixed(2));
        stage.style.setProperty("--glow-boost", (0.7 + pull * 0.45).toFixed(2));
      });
    }, { passive: true });

    hero.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      wrap.style.setProperty("--px", "0px");
      wrap.style.setProperty("--py", "0px");
      wrap.style.setProperty("--lo", "0");
      stage.style.setProperty("--glow-boost", "0.7");
    });
  })();

  /* ============================================================
     2. Header — mobile menu, scrolled state, hide on scroll down
     ============================================================ */
  (() => {
    const header = document.getElementById("site-header");
    if (!header) return;
    const menuBtn = header.querySelector(".menu-btn");
    const menu = header.querySelector(".mobile-menu");

    if (menuBtn && menu) {
      const setMenu = (open) => {
        header.classList.toggle("menu-open", open);
        menuBtn.setAttribute("aria-expanded", String(open));
        if (open) {
          menu.removeAttribute("inert");
        } else {
          // keep the closed (invisible) menu out of the tab order and AT tree
          if (menu.contains(document.activeElement)) menuBtn.focus();
          menu.setAttribute("inert", "");
        }
      };
      menu.setAttribute("inert", "");
      menuBtn.addEventListener("click", () => setMenu(!header.classList.contains("menu-open")));
      menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
      document.addEventListener("click", (e) => {
        if (!header.contains(e.target)) setMenu(false);
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setMenu(false);
      });
      window.addEventListener("resize", () => {
        if (window.innerWidth > 880) setMenu(false);
      });
    }

    let lastY = window.scrollY || 0;
    const onScroll = () => {
      const y = window.scrollY || 0;
      header.classList.toggle("scrolled", y > 24);
      const delta = y - lastY;
      if (Math.abs(delta) > 4) {
        if (y > 420 && delta > 0 && !header.classList.contains("menu-open")) {
          header.classList.add("nav-hidden");
        } else if (delta < 0 || y <= 420) {
          header.classList.remove("nav-hidden");
        }
        lastY = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // a hidden header must reappear when keyboard focus moves into it
    header.addEventListener("focusin", () => header.classList.remove("nav-hidden"));
  })();

  /* ============================================================
     3. Scrollspy + sliding glass indicator in the nav
     ============================================================ */
  (() => {
    const navWrap = document.getElementById("nav-links");
    if (!navWrap) return;
    const indicator = navWrap.querySelector(".nav-indicator");
    const links = Array.from(navWrap.querySelectorAll("a[data-nav]"));
    const sections = ["top", "readiness", "agents", "systems", "products", "process", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    let activeId = "top";

    const positionIndicator = (link) => {
      if (!indicator) return;
      if (!link) {
        indicator.style.setProperty("--on", "0");
        return;
      }
      indicator.style.setProperty("--x", `${link.offsetLeft}px`);
      indicator.style.setProperty("--w", `${link.offsetWidth}px`);
      indicator.style.setProperty("--on", "1");
    };

    const applyActive = (id) => {
      activeId = id;
      let activeLink = null;
      links.forEach((l) => {
        const on = l.dataset.nav === id;
        l.classList.toggle("is-active", on);
        if (on) activeLink = l;
      });
      document.querySelectorAll(".mobile-menu a[data-nav]").forEach((l) => {
        l.classList.toggle("is-active", l.dataset.nav === id);
      });
      positionIndicator(activeLink);
    };

    const spy = () => {
      const probe = window.scrollY + window.innerHeight * 0.35;
      let current = "top";
      for (const s of sections) {
        if (s.offsetTop <= probe) current = s.id;
      }
      if (current !== activeId) applyActive(current);
    };

    window.addEventListener("scroll", spy, { passive: true });
    window.addEventListener("resize", () => applyActive(activeId));
    spy();
    applyActive(activeId);

    // hover preview: indicator follows hovered link, returns to active
    links.forEach((l) => {
      l.addEventListener("mouseenter", () => positionIndicator(l));
    });
    navWrap.addEventListener("mouseleave", () => {
      applyActive(activeId);
    });
  })();

  /* ============================================================
     4. Scroll progress hairline
     ============================================================ */
  (() => {
    const bar = document.querySelector(".scroll-progress span");
    if (!bar) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty("--progress", max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  })();

  /* ============================================================
     5. Reveal on scroll (staggered per group)
     ============================================================ */
  (() => {
    const items = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!items.length) return;

    // index each group child so CSS can stagger via calc(var(--i) * var(--stag))
    document.querySelectorAll("[data-reveal-group]").forEach((group) => {
      group.querySelectorAll("[data-reveal]").forEach((el, i) => {
        el.style.setProperty("--i", i);
      });
    });

    // ?static=1 renders everything revealed — used for screenshot/QA tooling.
    // ?solo=<section-id> additionally shows only that section (QA captures).
    const params = new URLSearchParams(location.search);
    const staticMode = params.has("static");
    const solo = params.get("solo");
    if (solo && document.getElementById(solo)) {
      document.querySelectorAll("main > section, main > .statement-band").forEach((s) => {
        if (s.id !== solo) s.style.display = "none";
      });
      document.getElementById(solo).style.minHeight = "auto";
    }
    if (reducedMotion || staticMode || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in-view"));
      return;
    }

    // REVERSIBLE: toggle .in-view on enter AND leave, keep observing — so each
    // element re-animates every time it re-enters the viewport, up or down.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("in-view", entry.isIntersecting);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -18% 0px" }
    );

    items.forEach((el) => io.observe(el));
  })();

  /* ============================================================
     6. Product tabs
     ============================================================ */
  (() => {
    const tabsWrap = document.querySelector(".product-tabs");
    const showcase = document.querySelector(".product-showcase");
    if (!tabsWrap || !showcase) return;

    const tabs = Array.from(tabsWrap.querySelectorAll(".product-tab"));
    const indicator = tabsWrap.querySelector(".tab-indicator");
    const titleEl = showcase.querySelector("[data-product-title]");
    const copyEl = showcase.querySelector("[data-product-copy]");
    const exampleEl = showcase.querySelector("[data-product-example]");
    const badgeEl = showcase.querySelector("[data-product-badge]");
    const chipsEl = showcase.querySelector("[data-product-chips]");
    const bars = Array.from(showcase.querySelectorAll(".pv-bar"));
    const sparks = Array.from(showcase.querySelectorAll(".pv-spark span"));

    const PRODUCTS = {
      business: {
        badge: "Business OS",
        title: "Business Operations Systems",
        copy: "Custom internal systems for companies that need to manage staff, tasks, customers, inventory, payments, expenses, and reports — with an AI agent your team can chat with.",
        example: null,
        chips: ["Admin dashboards", "Staff management", "Inventory tracking", "Customer records", "Revenue & expense reports", "Approval workflows", "Branch monitoring"],
        bars: [62, 84, 45],
        sparks: [40, 65, 52, 78, 60, 92, 70]
      },
      farm: {
        badge: "UFMS",
        title: "Farm Operations Systems",
        copy: "Digital management systems for farms — production, feed, mortality, sales, hatchery, and finance records — run by a WhatsApp agent your staff already know how to use.",
        example: "UFMS — running daily at Universal Farms, our founder's own poultry operation",
        chips: ["Daily farm records", "Egg production tracking", "Feed usage monitoring", "Mortality & health logs", "Hatchery records", "Staff activity logs", "Weekly & monthly reports"],
        bars: [78, 56, 88],
        sparks: [55, 72, 48, 84, 66, 90, 76]
      },
      venue: {
        badge: "TruckVille",
        title: "Hospitality & Venue Operations Systems",
        copy: "Digital systems for restaurants, food courts, lifestyle venues, and multi-vendor destinations that need better control over vendors, orders, staff, payments, and events.",
        example: "TruckVille Operations System — in development for a real Abuja food-court destination",
        chips: ["Vendor management", "Order tracking", "Sales visibility", "Staff dashboards", "Event management", "Payment & payout visibility", "Tablet-friendly tools"],
        bars: [70, 48, 90],
        sparks: [62, 45, 80, 58, 88, 70, 95]
      },
      listen: {
        badge: "Creativ Listen",
        title: "AI Social Intelligence Systems",
        copy: "AI-powered systems for monitoring public conversations, detecting sentiment, identifying trends, and generating insights from multilingual and code-mixed African language content.",
        example: "Creativ Listen — in development: Hausa & Nigerian-language sentiment at its core",
        chips: ["Social listening", "Hausa & Nigerian-language sentiment", "Topic discovery", "Public feedback analysis", "Brand reputation monitoring", "AI insight reports", "Multilingual dashboards"],
        bars: [52, 76, 64],
        sparks: [48, 70, 90, 55, 75, 62, 85]
      }
    };

    const moveIndicator = (tab) => {
      if (!indicator) return;
      indicator.style.setProperty("--x", `${tab.offsetLeft}px`);
      indicator.style.setProperty("--w", `${tab.offsetWidth}px`);
    };

    const restartAnimations = (els) => {
      if (reducedMotion) return;
      els.forEach((el) => {
        el.getAnimations().forEach((a) => {
          a.cancel();
          a.play();
        });
      });
    };

    const activate = (tab) => {
      const data = PRODUCTS[tab.dataset.product];
      if (!data) return;

      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      moveIndicator(tab);
      showcase.setAttribute("aria-labelledby", tab.id);

      titleEl.textContent = data.title;
      copyEl.textContent = data.copy;
      badgeEl.textContent = data.badge;

      const exampleWrap = exampleEl.closest(".product-example");
      exampleWrap.hidden = !data.example;
      exampleEl.textContent = data.example || "";

      bars.forEach((b, i) => b.style.setProperty("--w", `${data.bars[i] || 50}%`));
      sparks.forEach((s, i) => s.style.setProperty("--h", `${data.sparks[i] || 40}%`));

      chipsEl.innerHTML = "";
      data.chips.forEach((c) => {
        const li = document.createElement("li");
        li.textContent = c;
        chipsEl.appendChild(li);
      });

      restartAnimations([...bars, ...sparks]);
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const next = tabs[(tabs.indexOf(tab) + dir + tabs.length) % tabs.length];
        next.focus();
        activate(next);
      });
    });

    const initial = tabs.find((t) => t.classList.contains("is-active")) || tabs[0];
    requestAnimationFrame(() => activate(initial));
    window.addEventListener("resize", () => {
      const current = tabs.find((t) => t.classList.contains("is-active"));
      if (current) moveIndicator(current);
    });
  })();

  /* ============================================================
     7. Contact form (Netlify)
     ============================================================ */
  (() => {
    document.querySelectorAll(".contact-form").forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        const status = form.querySelector(".form-status");
        const original = button ? button.textContent : "";

        if (button) {
          button.textContent = button.dataset.submittingLabel || "Sending…";
          button.disabled = true;
        }
        if (status) status.textContent = "";

        try {
          const res = await fetch(form.getAttribute("action") || "/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(new FormData(form)).toString()
          });
          if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
          form.reset();
          if (button) button.textContent = button.dataset.successLabel || "Sent";
          if (status) status.textContent = form.dataset.successMessage || "Thank you — we will be in touch.";
        } catch (err) {
          if (button) {
            button.textContent = original;
            button.disabled = false;
          }
          if (status) status.textContent = "Something went wrong. Please email hello@creativlabs.africa instead.";
        }
      });
    });
  })();

  /* ============================================================
     8. Footer year
     ============================================================ */
  (() => {
    const el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  })();

  /* ============================================================
     8a. WhatsApp links — one number populates every [data-wa]
         >>> REPLACE WA_NUMBER with the real business number
         (digits only, international format, no + or spaces) <<<
     ============================================================ */
  (() => {
    const WA_NUMBER = "2348102354786"; // Creativ Labs WhatsApp
    const MESSAGE = "Hi Creativ Labs, I'd like to talk about building an intelligent system for my business.";
    const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;
    document.querySelectorAll("[data-wa]").forEach((el) => {
      el.setAttribute("href", href);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
  })();

  /* ============================================================
     8b'. Agent chat — one-shot play when it scrolls into view
          (kills the forever-typing dot; static under reduced motion)
     ============================================================ */
  (() => {
    const chat = document.getElementById("agent-chat");
    if (!chat) return;
    const msgs = Array.from(chat.querySelectorAll(".msg"));
    if (!msgs.length) return;

    if (reducedMotion || !("IntersectionObserver" in window)) return; // leave full transcript visible

    chat.classList.add("chat--anim"); // now CSS hides bubbles until .is-shown

    const makeTyping = () => {
      const t = document.createElement("span");
      t.className = "msg msg--agent typing";
      t.setAttribute("aria-hidden", "true");
      t.innerHTML = "<i></i><i></i><i></i>";
      return t;
    };

    let played = false;
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));

    const play = () => {
      if (played) return;
      played = true;
      // msgs: [0]=user, [1]=agent preview, [2]=user confirm, [3]=agent recorded
      const show = (el) => el.classList.add("is-shown");
      at(150, () => show(msgs[0]));
      at(800, () => {
        const t = makeTyping();
        msgs[1].before(t);
        requestAnimationFrame(() => t.classList.add("is-shown"));
        at(900, () => { t.remove(); show(msgs[1]); });
      });
      at(2500, () => show(msgs[2]));
      at(3100, () => {
        const t = makeTyping();
        msgs[3].before(t);
        requestAnimationFrame(() => t.classList.add("is-shown"));
        at(900, () => { t.remove(); show(msgs[3]); });
      });
    };

    // primary trigger: IntersectionObserver. fallback: a scroll check, so the
    // chat can never be left permanently blank if the threshold is never met
    // (very short viewport, or chat taller than the screen).
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { play(); cleanup(); }
      });
    }, { threshold: 0.3 });
    io.observe(chat);

    const onScroll = () => {
      const r = chat.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.82 && r.bottom > 0) { play(); cleanup(); }
    };
    const cleanup = () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* ============================================================
     8b. Hero entrance choreography (one-shot, CSS-driven)
     ============================================================ */
  document.body.classList.add("fx-enter");

  /* ============================================================
     8b2. BlurText — split the hero headline into words that blur in
          one by one. Skipped under reduced motion; if it fails the
          headline keeps the block-level entrance.
     ============================================================ */
  (() => {
    if (reducedMotion) return;
    const h1 = document.querySelector(".hero-title");
    if (!h1) return;

    const words = [];
    Array.from(h1.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(" "));
            return;
          }
          const s = document.createElement("span");
          s.className = "blur-word";
          s.textContent = part;
          words.push(s);
          frag.appendChild(s);
        });
        h1.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // e.g. the gradient "Agentic" span — animate it as one word
        child.classList.add("blur-word");
        words.push(child);
      }
    });

    if (!words.length) return;
    h1.setAttribute("aria-label", h1.textContent.replace(/\s+/g, " ").trim());
    words.forEach((w, i) => w.style.setProperty("--wi", i));
    h1.classList.add("title-split");
  })();

  /* ============================================================
     8c. Signature pointer FX — 3D card tilt with tracked specular,
         magnetic buttons, cursor light. Desktop fine-pointers only.
     ============================================================ */
  (() => {
    if (reducedMotion || !finePointer) return;
    document.body.classList.add("fx");

    /* 3D tilt + pointer-tracked specular hotspot on glass cards */
    const MAX_TILT = 3.5; // degrees
    let card = null, cardRaf = 0, lastMove = null;

    const resetCard = (el) => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };

    const applyTilt = () => {
      cardRaf = 0;
      if (!card || !lastMove) return;
      const r = card.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const px = Math.min(1, Math.max(0, (lastMove.clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (lastMove.clientY - r.top) / r.height));
      card.style.setProperty("--rx", `${((0.5 - py) * MAX_TILT * 2).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${((px - 0.5) * MAX_TILT * 2).toFixed(2)}deg`);
      card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    };

    document.addEventListener("pointerover", (e) => {
      const c = e.target.closest(".glass-card");
      if (c === card) return;
      if (card) resetCard(card);
      card = c;
    });

    document.addEventListener("pointermove", (e) => {
      if (!card) return;
      lastMove = e;
      if (!cardRaf) cardRaf = requestAnimationFrame(applyTilt);
    }, { passive: true });

    document.addEventListener("pointerout", (e) => {
      if (card && !card.contains(e.relatedTarget)) {
        resetCard(card);
        card = null;
      }
    });

    /* magnetic pull on glass buttons */
    document.querySelectorAll(".glass-btn").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const dx = Math.max(-0.6, Math.min(0.6, (e.clientX - (r.left + r.width / 2)) / r.width));
        const dy = Math.max(-0.6, Math.min(0.6, (e.clientY - (r.top + r.height / 2)) / r.height));
        btn.style.setProperty("--magx", `${(dx * 7).toFixed(1)}px`);
        btn.style.setProperty("--magy", `${(dy * 5).toFixed(1)}px`);
      }, { passive: true });
      btn.addEventListener("pointerleave", () => {
        btn.style.setProperty("--magx", "0px");
        btn.style.setProperty("--magy", "0px");
      });
    });
  })();

  /* ============================================================
     9. Wisp waves — animated WebGL ribbons, fixed behind every
        section (never fades on scroll; still frame under reduced motion)
     ============================================================ */
  (() => {
    const canvas = document.getElementById("wisp-canvas");
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    // shader time used for the reduced-motion still frame
    const STILL_TIME = 5.0;

    const vs = `
      attribute vec2 position;
      void main() { gl_Position = vec4(position, 0.0, 1.0); }
    `;

    const fs = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;   // pointer in wave-space
      uniform float u_energy; // 0..1 recent pointer activity
      uniform vec3 u_click;   // xy = wave-space click pos, z = shader time of click

      void main() {
        vec2 screenUv = gl_FragCoord.xy / u_resolution.xy;
        vec2 uv = screenUv;
        float aspect = u_resolution.x / u_resolution.y;
        uv.y -= 0.24;
        uv.x *= aspect;

        vec3 cobalt = vec3(0.02, 0.15, 0.82);
        vec3 azure  = vec3(0.00, 0.36, 0.88);
        vec3 cyan   = vec3(0.04, 0.68, 0.90);

        // pointer influence: strands shimmer inside a soft radius around the cursor
        float mdist = length(uv - u_mouse);
        float minfluence = exp(-mdist * mdist * 6.0) * u_energy;

        // click ripple: an expanding, decaying ring
        float ct = max(u_time - u_click.z, 0.0);
        float cdist = length(uv - u_click.xy);
        float ring = exp(-pow((cdist - ct * 0.6) * 9.0, 2.0)) * exp(-ct * 1.6) * step(0.001, u_click.z);

        vec3 finalColor = vec3(0.0);
        float finalAlpha = 0.0;

        for (float i = 1.0; i <= 6.0; i++) {
          float t = u_time * 0.3 + i * 0.15;
          float y = sin(uv.x * (1.5 + i * 0.2) + t) * 0.15 * cos(t * 0.5);
          y += cos(uv.x * (1.0 + i * 0.3) - t * 0.8) * 0.1;
          y += sin(12.0 * mdist - u_time * 4.0 + i * 0.6) * 0.05 * minfluence;
          y += ring * 0.045 * sin(i * 1.7);

          float d = abs(uv.y - y);
          float core = smoothstep(0.014 + i * 0.0012, 0.0, d);
          float halo = smoothstep(0.085 + i * 0.006, 0.0, d) * 0.18;

          float phase = 0.5 + 0.5 * sin(uv.x * 1.1 + t + i * 0.42);
          vec3 strand = mix(cobalt, azure, phase * 0.62);
          strand = mix(strand, cyan, smoothstep(3.0, 6.0, i) * 0.34);
          strand += vec3(0.08, 0.22, 0.28) * minfluence;

          finalColor += strand * (core * 0.92 + halo * 0.20);
          finalAlpha += core * 0.46 + halo * 0.24;
        }

        vec3 color = clamp(finalColor, 0.0, 1.0);
        float topFade = 1.0 - smoothstep(0.42, 0.54, screenUv.y);
        float alpha = clamp(finalAlpha * topFade, 0.0, 0.62);
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const shader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vs));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uEnergy = gl.getUniformLocation(program, "u_energy");
    const uClick = gl.getUniformLocation(program, "u_click");

    // pointer state, smoothed per frame so the ribbons react fluidly
    const pointer = { x: -10, y: -10, tx: -10, ty: -10, energy: 0, target: 0 };
    const click = { x: 0, y: 0, t: -1000 };
    let shaderTime = 0;

    // convert client coords into the shader's wave-space
    // (screenUv with y flipped, then y -= 0.24 and x *= aspect)
    const toWaveSpace = (cx, cy) => {
      const aspect = window.innerWidth / Math.max(1, window.innerHeight);
      return {
        x: (cx / Math.max(1, window.innerWidth)) * aspect,
        y: (1 - cy / Math.max(1, window.innerHeight)) - 0.24
      };
    };

    window.addEventListener("pointermove", (e) => {
      const p = toWaveSpace(e.clientX, e.clientY);
      pointer.tx = p.x;
      pointer.ty = p.y;
      pointer.target = 1;
    }, { passive: true });

    window.addEventListener("pointerdown", (e) => {
      const p = toWaveSpace(e.clientX, e.clientY);
      click.x = p.x;
      click.y = p.y;
      click.t = shaderTime;
    }, { passive: true });

    document.documentElement.addEventListener("pointerleave", () => {
      pointer.target = 0;
    });

    const draw = (time) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (w === 0 || h === 0) return; // hidden/prerendered — retry later
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      shaderTime = time;
      pointer.target *= 0.985; // idle pointer → ribbons settle back down
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      pointer.energy += (pointer.target - pointer.energy) * 0.06;
      gl.uniform1f(uTime, time);
      gl.uniform2f(uRes, w, h);
      gl.uniform2f(uMouse, pointer.x, pointer.y);
      gl.uniform1f(uEnergy, pointer.energy);
      gl.uniform3f(uClick, click.x, click.y, click.t);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    if (reducedMotion) {
      // respect the motion preference: same ribbons, one still frame
      const drawStill = () => draw(STILL_TIME);
      window.addEventListener("resize", drawStill);
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) drawStill();
      });
      drawStill();
      return;
    }

    let rafId = 0;
    const loop = (t) => {
      draw(t * 0.001);
      rafId = requestAnimationFrame(loop);
    };

    // pause only when the tab itself is hidden — never on scroll
    document.addEventListener("visibilitychange", () => {
      cancelAnimationFrame(rafId);
      if (!document.hidden) rafId = requestAnimationFrame(loop);
    });

    rafId = requestAnimationFrame(loop);
  })();

  /* ============================================================
     10. Business Agentic Readiness — quiz engine
     ============================================================ */
  (() => {
    const quiz = document.getElementById("bar-quiz");
    const result = document.getElementById("bar-result");
    if (!quiz || !result) return;

    // Seven weighted questions (research-derived: Cisco AI Readiness Index
    // pillars compressed through BridgeView's SMB quiz pattern). Graded
    // 3-level answers (0/1/2 — never yes/no); weights sum to 100.
    const QUESTIONS = [
      {
        q: "If a key staff member left tomorrow, could someone follow written steps and do their job?",
        weight: 20,
        options: [
          { label: "No — the steps live in people's heads", lvl: 0 },
          { label: "Partly — some things are written down", lvl: 1 },
          { label: "Yes — our key processes are documented", lvl: 2 }
        ]
      },
      {
        q: "Where do your business records — sales, bookings, stock — live today?",
        weight: 20,
        options: [
          { label: "Paper, notebooks, or memory", lvl: 0 },
          { label: "Spreadsheets, WhatsApp chats, phone photos", lvl: 1 },
          { label: "Software the team actually uses", lvl: 2 }
        ]
      },
      {
        q: "How much time goes to the same repeated tasks each week — replying, recording, reporting, chasing?",
        weight: 20,
        options: [
          { label: "Very little — our work is rarely routine", lvl: 0 },
          { label: "A few hours per person, most days", lvl: 1 },
          { label: "A huge share — the same tasks, every day", lvl: 2 }
        ]
      },
      {
        q: "Does the business already run on digital channels — WhatsApp Business, POS, an accounting app?",
        weight: 15,
        options: [
          { label: "Not really — we're mostly offline", lvl: 0 },
          { label: "Some — WhatsApp yes, the rest is manual", lvl: 1 },
          { label: "Yes — several tools, used daily", lvl: 2 }
        ]
      },
      {
        q: "Is there one person who could own the agent — checking its work and reports every week?",
        weight: 10,
        options: [
          { label: "No obvious person right now", lvl: 0 },
          { label: "Maybe — someone could grow into it", lvl: 1 },
          { label: "Yes — I know exactly who", lvl: 2 }
        ]
      },
      {
        q: "Can you name the ONE process that, if automated, would most change your business?",
        weight: 10,
        options: [
          { label: "Not yet — everything feels tangled", lvl: 0 },
          { label: "I have two or three candidates", lvl: 1 },
          { label: "Instantly — I already know it", lvl: 2 }
        ]
      },
      {
        q: "How do you feel about a system drafting records and replies that a human approves before saving?",
        weight: 5,
        options: [
          { label: "Cautious — I'd need to see it working first", lvl: 0 },
          { label: "Open to it, with tight controls", lvl: 1 },
          { label: "That's exactly what I want", lvl: 2 }
        ]
      }
    ];

    // Four tiers, explicit cutoffs, encouraging names, strengths-first
    // summaries (low scorers should still feel momentum, not shame).
    const TIERS = [
      {
        min: 0,
        name: "Start With the Basics",
        summary: "Every agent-run business started exactly here — and you have the advantage of starting deliberately. Right now your operations live in people's heads and pockets, which means the fastest, most visible wins are all still ahead of you.",
        recs: [
          "Put ONE core process — daily sales, stock, or records — into a simple digital system first",
          "The task your team repeats most is your future agent's first job; note it down",
          "Our consultation maps the shortest path from where you are to agent-ready — in plain steps"
        ],
        cta: "Start My Systemization Plan"
      },
      {
        min: 30,
        name: "Building the Foundation",
        summary: "You have real strengths to build on — digital habits are forming and the repetitive work an agent thrives on is clearly there. The gaps are honest but fixable, and we design the system and the agent together so you never need a year of 'digital transformation' first.",
        recs: [
          "Centralize your scattered records — one place the whole team trusts",
          "Document your most repeated process; that becomes the agent's playbook",
          "A consultation will show which gap to close first for the fastest payoff"
        ],
        cta: "Map My Path to Agent-Ready"
      },
      {
        min: 55,
        name: "Nearly Ready",
        summary: "You're closer than you think. Solid digital habits, real structure, and plenty of routine work worth handing over — usually just one process to document or one record to centralize before an agent slots in. This is exactly the stage where an Agent-as-a-System build pays off fastest.",
        recs: [
          "Connect the tools you already use into one operating layer for the business",
          "Your team's daily channels are the agent's front door — it meets them where they are",
          "In the consultation we'll pick the first workflow the agent takes over"
        ],
        cta: "Book My Free Readiness Consultation"
      },
      {
        min: 80,
        name: "Agent-Ready",
        summary: "Documented processes, digital records, an owner in mind, and clear intent — your business has the foundations most companies spend a year building. An AI agent could be doing real, supervised work here within weeks, not months.",
        recs: [
          "Pilot an agent on your highest-volume workflow first — that's where weeks are won",
          "Preview→confirm control means you keep full authority while the agent works",
          "The consultation scopes your first agent: timeline, integrations, and cost"
        ],
        cta: "Scope My First Agent"
      }
    ];

    const els = {
      current: quiz.querySelector("[data-bar-current]"),
      total: quiz.querySelector("[data-bar-total]"),
      fill: quiz.querySelector(".bar-progress-fill"),
      question: quiz.querySelector("[data-bar-question]"),
      options: quiz.querySelector("[data-bar-options]"),
      back: quiz.querySelector(".bar-back"),
      score: result.querySelector("[data-bar-score]"),
      tier: result.querySelector("[data-bar-tier]"),
      summary: result.querySelector("[data-bar-summary]"),
      recs: result.querySelector("[data-bar-recs]"),
      cta: result.querySelector("[data-bar-cta]"),
      retake: result.querySelector("[data-bar-retake]"),
      gauge: result.querySelector(".bar-gauge-fill"),
      gaugeWrap: result.querySelector("[data-bar-gauge-label]")
    };

    let step = 0;
    const answers = new Array(QUESTIONS.length).fill(null);

    els.total.textContent = String(QUESTIONS.length);

    const render = () => {
      const item = QUESTIONS[step];
      els.current.textContent = String(step + 1);
      els.fill.style.width = `${(step / QUESTIONS.length) * 100}%`;
      els.question.textContent = item.q;
      els.options.innerHTML = "";
      item.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "bar-option";
        btn.innerHTML = `<span class="bar-dot" aria-hidden="true"></span><span>${opt.label}</span>`;
        btn.addEventListener("click", () => {
          answers[step] = i;
          step += 1;
          if (step >= QUESTIONS.length) finish();
          else render();
        });
        els.options.appendChild(btn);
      });
      els.back.hidden = step === 0;
    };

    const finish = () => {
      // weighted maturity score: each question contributes weight * level/2
      const score = Math.round(
        answers.reduce((sum, ai, qi) => sum + QUESTIONS[qi].weight * (QUESTIONS[qi].options[ai].lvl / 2), 0)
      );
      const tier = [...TIERS].reverse().find((t) => score >= t.min) || TIERS[0];

      quiz.hidden = true;
      result.hidden = false;

      els.tier.textContent = tier.name;
      els.summary.textContent = tier.summary;
      els.recs.innerHTML = "";
      tier.recs.forEach((r) => {
        const li = document.createElement("li");
        li.textContent = r;
        els.recs.appendChild(li);
      });
      els.cta.innerHTML = `${tier.cta} <span class="btn-arrow" aria-hidden="true">&rarr;</span>`;
      if (els.gaugeWrap) els.gaugeWrap.setAttribute("aria-label", `Business Agentic Readiness score: ${score} out of 100 — ${tier.name}`);

      // feed the score into the consultation form + remember it
      const field = document.getElementById("readiness-score-field");
      if (field) field.value = `${score}/100 — ${tier.name}`;
      try { sessionStorage.setItem("bar-score", String(score)); } catch {}

      // animate count + gauge
      const C = 326.7;
      requestAnimationFrame(() => {
        els.gauge.style.strokeDashoffset = String(C - (C * score) / 100);
      });
      if (reducedMotion) {
        els.score.textContent = String(score);
      } else {
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / 1000);
          els.score.textContent = String(Math.round(score * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    };

    els.back.addEventListener("click", () => {
      if (step > 0) {
        step -= 1;
        render();
      }
    });

    els.retake.addEventListener("click", () => {
      step = 0;
      answers.fill(null);
      result.hidden = true;
      quiz.hidden = false;
      els.gauge.style.strokeDashoffset = "326.7";
      render();
    });

    render();
  })();

  /* ============================================================
     11. Hermes dock — site assistant. Scripted until the real
         agent endpoint is set in assets/hermes-config.js.
     ============================================================ */
  (() => {
    const dock = document.getElementById("hermes-dock");
    const btn = document.getElementById("dock-btn");
    const panel = document.getElementById("dock-panel");
    const msgs = document.getElementById("dock-msgs");
    const form = document.getElementById("dock-form");
    const input = document.getElementById("dock-input");
    const status = document.getElementById("dock-status");
    if (!dock || !btn || !panel || !msgs || !form) return;

    const cfg = window.HERMES || {};
    const live = Boolean(cfg.endpoint);
    if (status) status.textContent = live ? "Online — Creativ Labs agent" : "Creativ Labs assistant";

    let sessionId;
    try {
      sessionId = localStorage.getItem("hermes-session") ||
        (crypto.randomUUID ? crypto.randomUUID() : String(Math.floor(performance.now() * 1e6)));
      localStorage.setItem("hermes-session", sessionId);
    } catch {
      sessionId = "anon";
    }

    const add = (text, who, asHTML) => {
      const el = document.createElement("div");
      el.className = `dock-msg dock-msg--${who}`;
      if (asHTML) el.innerHTML = text;
      else el.textContent = text;
      msgs.appendChild(el);
      msgs.scrollTop = msgs.scrollHeight;
      return el;
    };

    const addQuick = () => {
      const wrap = document.createElement("div");
      wrap.className = "dock-quick";
      [
        ["Take the readiness test", "#readiness"],
        ["What do you build?", "#systems"],
        ["Book a consultation", "#contact"]
      ].forEach(([label, target]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.addEventListener("click", () => {
          setOpen(false);
          document.querySelector(target)?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" });
        });
        wrap.appendChild(b);
      });
      msgs.appendChild(wrap);
      msgs.scrollTop = msgs.scrollHeight;
    };

    const typing = () => {
      const el = document.createElement("span");
      el.className = "dock-typing";
      el.setAttribute("aria-hidden", "true");
      el.innerHTML = "<i></i><i></i><i></i>";
      msgs.appendChild(el);
      msgs.scrollTop = msgs.scrollHeight;
      return el;
    };

    let greeted = false;
    let open = false;

    const setOpen = (next) => {
      open = next;
      btn.setAttribute("aria-expanded", String(next));
      if (next) {
        panel.hidden = false;
        void panel.offsetWidth; // flush styles so the open transition runs
        panel.classList.add("open");
        if (!greeted) {
          greeted = true;
          add(cfg.greeting || "Hi! How can I help?", "bot");
          if (!live) addQuick();
        }
        setTimeout(() => input?.focus(), 250);
      } else {
        panel.classList.remove("open");
        setTimeout(() => { panel.hidden = true; }, 220);
      }
    };

    btn.addEventListener("click", () => setOpen(!open));
    document.getElementById("dock-close")?.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    });

    // scripted answers until the VPS agent is plugged in
    const scripted = (text) => {
      const t = text.toLowerCase();
      if (/price|cost|how much|pay/.test(t)) {
        return "Pricing depends on the size of the system and agent you need — most projects are scoped in the free consultation so you get a real number, not a guess. <a href='#contact'>Book one here</a>.";
      }
      if (/whatsapp|agent|bot/.test(t)) {
        return "Every system we build ships with an AI agent your team talks to on WhatsApp — it records data, runs reports, and asks for confirmation before saving anything. See it in action in the <a href='#agents'>Agents section</a>.";
      }
      if (/ready|test|score|quiz/.test(t)) {
        return "The Business Agentic Readiness test takes under a minute — six questions, instant score. <a href='#readiness'>Take it here</a>.";
      }
      if (/farm|ufms|poultry/.test(t)) {
        return "UFMS is our farm operations system — daily records, egg production, feed, mortality, and finance, run by a WhatsApp agent. Check <a href='#products'>Use Cases</a>.";
      }
      return `${cfg.offlineNote || "Here's where to go:"} <a href='#readiness'>take the 60-second readiness test</a>, <a href='#contact'>book a free consultation</a>, or email <a href='mailto:hello@creativlabs.africa'>hello@creativlabs.africa</a>.`;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = (input.value || "").trim();
      if (!text) return;
      input.value = "";
      add(text, "user");
      const t = typing();

      if (live) {
        try {
          const res = await fetch(cfg.endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, sessionId, page: location.pathname })
          });
          if (!res.ok) throw new Error(String(res.status));
          const data = await res.json();
          t.remove();
          add(data.reply || "Sorry — I didn't catch that. Try again?", "bot");
        } catch {
          t.remove();
          add("I'm having trouble reaching the agent right now. You can always email <a href='mailto:hello@creativlabs.africa'>hello@creativlabs.africa</a> or <a href='#contact'>book a consultation</a>.", "bot", true);
        }
      } else {
        setTimeout(() => {
          t.remove();
          add(scripted(text), "bot", true);
        }, reducedMotion ? 50 : 700);
      }
    });
  })();

  /* ============================================================
     12. Fit engine — every section is one viewport tall in every
         view. Measures each section against the real viewport and
         applies the lightest density tier that fits:
         (roomy) → .s-tight → .s-tighter. Re-runs on resize, font
         load, quiz/tab/FAQ state changes.
     ============================================================ */
  (() => {
    const sections = Array.from(document.querySelectorAll(".hero, main > .section, main > .statement"));
    if (!sections.length) return;

    // measure the true small-viewport height (svh) once per resize
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;top:0;left:0;height:100svh;width:1px;visibility:hidden;pointer-events:none;";
    document.body.appendChild(probe);

    // layout-based measurement: offsetTop/offsetHeight ignore transforms, so
    // entrance/reveal animations (which translate elements downward) can't
    // inflate the reading. Sections are position:relative, making children's
    // offsetTop section-relative.
    const neededHeight = (sec) => {
      let max = 0;
      for (const c of sec.children) {
        if (!c.offsetHeight && !c.offsetWidth) continue; // display:none
        // absolutely-positioned decoration (e.g. .scroll-cue) is anchored to
        // a corner of the section independent of content — its offsetTop
        // reflects that anchor, not "how tall is my content", so counting
        // it here would make sections falsely read as overflowing forever
        if (getComputedStyle(c).position === "absolute") continue;
        const b = c.offsetTop + c.offsetHeight;
        if (b > max) max = b;
      }
      return max + parseFloat(getComputedStyle(sec).paddingBottom || "0");
    };

    // graduated stages, applied cumulatively until the section fits:
    // s-snug  — geometry only (spacing/type shrink, no text lost)
    // s-tight — adds gentle 2-3 line clamps on secondary text
    // s-tighter — essentials only
    const STAGES = ["s-snug", "s-tight", "s-tighter"];

    const fit = () => {
      const vh = probe.offsetHeight || window.innerHeight;
      sections.forEach((sec) => {
        if (sec.style.display === "none") return; // ?solo QA mode
        sec.classList.remove(...STAGES);
        for (const stage of STAGES) {
          // reading layout after each class change forces a reflow,
          // so every measurement is accurate
          if (neededHeight(sec) <= vh + 2) break;
          sec.classList.add(stage);
        }
      });
    };

    let t = 0;
    const queueFit = (delay) => {
      clearTimeout(t);
      t = setTimeout(fit, delay);
    };

    window.addEventListener("resize", () => queueFit(120));
    window.addEventListener("orientationchange", () => queueFit(220));
    // mobile URL-bar show/hide changes the visual viewport without always
    // firing window resize
    if (window.visualViewport) window.visualViewport.addEventListener("resize", () => queueFit(150));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => queueFit(0));

    // content that changes a section's height after load
    document.addEventListener("click", (e) => {
      if (e.target.closest(".bar-option, [data-bar-retake], .product-tab")) queueFit(120);
    });
    document.addEventListener("toggle", () => queueFit(60), true);

    fit();
  })();

  /* ============================================================
     13. Statement transition bands — scroll-scrubbed. Each breath-line
         rises + sharpens + brightens as it nears viewport centre, then
         drifts + softens + fades as it leaves. Animates coming IN and
         going OUT, continuously tied to scroll position.
     ============================================================ */
  (() => {
    const lines = Array.from(document.querySelectorAll(".statement-text"));
    if (!lines.length) return;

    // reduced motion (or no rAF): show them plainly, no scrub
    if (reducedMotion) {
      document.documentElement.classList.add("no-scrub");
      return;
    }

    const scrub = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const half = vh / 2;
      for (const el of lines) {
        const r = el.getBoundingClientRect();
        if (r.height === 0) continue;
        const centre = r.top + r.height / 2;
        // signed distance from viewport centre, normalised to roughly [-1, 1]:
        // >0 while the line sits below centre (entering), <0 above (leaving)
        let dir = (centre - half) / (half + r.height / 2);
        dir = Math.max(-1.2, Math.min(1.2, dir));
        const p = Math.max(0, 1 - Math.abs(dir)); // 0 at edges → 1 at centre
        el.style.setProperty("--p", p.toFixed(3));
        el.style.setProperty("--dir", dir.toFixed(3));
      }
    };

    // cancel-and-reschedule: coalesces to one update per frame and can never
    // get permanently stuck (a dropped frame just gets superseded)
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(scrub);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    if (window.visualViewport) window.visualViewport.addEventListener("resize", onScroll, { passive: true });
    scrub(); // set initial state for whatever is already on screen
  })();

  /* ============================================================
     14. The two designated scroll-scrubs (per the motion spec):
         (a) readiness heading — horizontal clip-wipe as it enters
         (b) agents iPhone — a 3D dolly (tilts upright + pushes forward)
         Both are per-frame scroll-linked; pinned to rest under reduced
         motion or ?static (QA), and the phone dolly is desktop-only so it
         never shifts the phone out of its narrow mobile column.
     ============================================================ */
  (() => {
    const staticMode = new URLSearchParams(location.search).has("static");
    if (reducedMotion || staticMode) return; // elements sit at their CSS rest state

    const phone = document.querySelector(".iphone-stage");
    const agents = document.getElementById("agents");
    const readH2 = document.querySelector("#readiness .section-head h2");
    if (!phone && !readH2) return;

    // 0 as a section's reference point sits near the bottom of the viewport
    // (just entering), 1 once it has travelled up to the settle line. Clamped.
    const progress = (el, startFrac, endFrac) => {
      const top = el.getBoundingClientRect().top;
      const vh = window.innerHeight || 1;
      return Math.max(0, Math.min(1, (startFrac * vh - top) / ((startFrac - endFrac) * vh)));
    };

    const scrub = () => {
      if (phone && agents) {
        if (window.innerWidth >= 880) {
          const p = progress(agents, 0.9, 0.4);
          const k = 1 - p;
          phone.style.opacity = (0.25 + 0.75 * p).toFixed(3);
          phone.style.transform =
            `perspective(1400px) rotateY(${(-10 * k).toFixed(2)}deg) rotateX(${(4 * k).toFixed(2)}deg) ` +
            `translateZ(${(-64 * k).toFixed(1)}px) translateX(${(32 * k).toFixed(1)}px)`;
        } else {
          // mobile: no 3D dolly (would shift the phone out of its column)
          phone.style.opacity = "";
          phone.style.transform = "";
        }
      }
      if (readH2) {
        const p = progress(readH2, 0.92, 0.5);
        readH2.style.setProperty("--wipe-r", `${((1 - p) * 100).toFixed(1)}%`);
      }
    };

    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(scrub);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    if (window.visualViewport) window.visualViewport.addEventListener("resize", onScroll, { passive: true });
    scrub();
  })();

})();
