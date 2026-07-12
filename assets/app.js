/* Safetyline v2 — interactions */
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
     6b. Use-case device previews — selectors switch which app shows
         in a laptop; picking the ordering app morphs the laptop into
         a phone. Real app UIs mount into .uc-app-inner and are scaled
         to fit with `zoom`, recomputed on resize / device switch.
     ============================================================ */
  (() => {
    const tabsWrap = document.querySelector("[data-uc-tabs]");
    const stage = document.querySelector("[data-uc-stage]");
    if (!tabsWrap || !stage) return;

    const tabs = Array.from(tabsWrap.querySelectorAll(".uc-tab"));
    const indicator = tabsWrap.querySelector(".uc-tab-indicator");
    const caption = document.querySelector("[data-uc-caption]");
    const laptopVp = stage.querySelector('[data-uc-viewport="laptop"]');
    const phoneVp = stage.querySelector('[data-uc-viewport="phone"]');
    const NATIVE = { laptop: 1280, phone: 390 };
    const CAPTIONS = {
      ufms: "UFMS — running daily at Universal Farms, our founder’s own poultry operation.",
      os: "TruckVille OS — the operations backbone for a real Abuja food-court destination.",
      order: "TruckVille ordering — customers order from their phone; vendors see it instantly.",
      labour: "Membership portal — built for the Labour Party’s nationwide member registration.",
    };

    // scale each device's app to exactly fill its screen width
    const fitZoom = () => {
      [["laptop", laptopVp], ["phone", phoneVp]].forEach(([k, vp]) => {
        if (!vp || !vp.clientWidth) return;
        const inner = (vp.querySelector(".uc-app.is-active .uc-app-inner") || vp.querySelector(".uc-app-inner"));
        const wProp = inner && inner.style.getPropertyValue("--uc-w");
        const native = wProp ? parseFloat(wProp) : NATIVE[k];
        vp.style.setProperty("--uc-zoom", (vp.clientWidth / native).toFixed(4));
      });
    };

    const moveIndicator = (tab) => {
      if (!indicator) return;
      indicator.style.setProperty("--x", tab.offsetLeft + "px");
      indicator.style.setProperty("--w", tab.offsetWidth + "px");
      // tabs wrap to two rows on narrow screens — track y/height too
      indicator.style.setProperty("--y", tab.offsetTop + "px");
      indicator.style.setProperty("--h", tab.offsetHeight + "px");
    };

    const activate = (tab) => {
      const app = tab.dataset.app;
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      moveIndicator(tab);
      stage.dataset.device = tab.dataset.device;
      stage.querySelectorAll(".uc-app").forEach((v) => v.classList.toggle("is-active", v.dataset.appView === app));
      if (caption && CAPTIONS[app]) caption.textContent = CAPTIONS[app];
      requestAnimationFrame(fitZoom);
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

    // ?uc=<app> forces the initial device/app on load — QA/screenshot hook,
    // mirrors the site's ?solo / ?feature convention
    const qaUc = new URLSearchParams(location.search).get("uc");
    const initial = (qaUc && tabs.find((t) => t.dataset.app === qaUc)) ||
      tabs.find((t) => t.classList.contains("is-active")) || tabs[0];
    requestAnimationFrame(() => { activate(initial); fitZoom(); });
    window.addEventListener("resize", () => {
      const cur = tabs.find((t) => t.classList.contains("is-active"));
      if (cur) moveIndicator(cur);
      fitZoom();
    });
    // refit whenever the viewports themselves change size (density tiers,
    // media queries, device morph) — window resize alone misses these
    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(() => fitZoom());
      [laptopVp, phoneVp].forEach((vp) => { if (vp) ro.observe(vp); });
    }
  })();

  /* ============================================================
     6c. What-we-build feature-detail — a capability list drives a
         contextual dashboard preview window, auto-advancing with
         pause on hover/focus/out-of-view. Reduced motion: manual only.
     ============================================================ */
  (() => {
    const root = document.querySelector("[data-fd]");
    if (!root) return;
    const items = Array.from(root.querySelectorAll(".fd-item"));
    const screens = Array.from(root.querySelectorAll(".fd-screen"));
    const title = root.querySelector("[data-fd-title]");
    if (!items.length || !screens.length) return;

    const SLUGS = { ops: "operations", dash: "dashboard", flow: "automations", agent: "agent", admin: "access", custom: "platform" };
    const AUTOPLAY_MS = 4200;
    let active = Math.max(0, items.findIndex((el) => el.classList.contains("is-active")));
    let paused = false, inView = true, startedAt = 0;

    const setActive = (i) => {
      active = (i + items.length) % items.length;
      const key = items[active].dataset.fd;
      items.forEach((el, n) => {
        const on = n === active;
        el.classList.toggle("is-active", on);
        el.setAttribute("aria-selected", String(on));
        el.tabIndex = on ? 0 : -1;
      });
      screens.forEach((s) => {
        const on = s.dataset.fdScreen === key;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-hidden", String(!on));
      });
      if (title) title.textContent = SLUGS[key] || key;
      startedAt = performance.now();
    };

    items.forEach((el, i) => {
      el.addEventListener("click", () => setActive(i));
      el.addEventListener("mouseenter", () => setActive(i));
      el.addEventListener("focus", () => setActive(i));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(i); }
        if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      });
    });

    // ?fd=<key> forces the initial capability — QA/screenshot hook
    const qaFd = new URLSearchParams(location.search).get("fd");
    if (qaFd) { const qi = items.findIndex((el) => el.dataset.fd === qaFd); if (qi >= 0) active = qi; }

    setActive(active);
    if (reducedMotion || qaFd) return;

    root.addEventListener("mouseenter", () => { paused = true; });
    root.addEventListener("mouseleave", () => { paused = false; startedAt = performance.now(); });
    root.addEventListener("focusin", () => { paused = true; });
    root.addEventListener("focusout", () => { paused = false; startedAt = performance.now(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => { inView = es[0].isIntersecting; }, { threshold: 0.3 }).observe(root);
    }
    const tick = (t) => {
      if (!paused && inView && !document.hidden && (t - startedAt) >= AUTOPLAY_MS) setActive(active + 1);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  })();

  /* ============================================================
     6d. In-app preview navigation — a clickable sidebar switches
         pages inside a Use Cases app preview (UFMS: Dashboard ↔
         Records), so the laptop is browsable, not a single screen.
     ============================================================ */
  (() => {
    const navs = Array.from(document.querySelectorAll("[data-ufms-goto]"));
    if (!navs.length) return;
    navs.forEach((nav) => {
      nav.addEventListener("click", () => {
        const app = nav.closest(".ufms");
        if (!app) return;
        const key = nav.dataset.ufmsGoto;
        app.querySelectorAll("[data-ufms-goto]").forEach((n) => n.classList.toggle("is-active", n === nav));
        app.querySelectorAll("[data-ufms-page]").forEach((p) => p.classList.toggle("is-active", p.dataset.ufmsPage === key));
        const vp = app.closest(".uc-viewport");
        if (vp) vp.scrollTop = 0;
      });
    });
    // ?ufms=<page> forces a UFMS in-app page on load — QA/screenshot hook
    const qaUfms = new URLSearchParams(location.search).get("ufms");
    if (qaUfms) { const t = navs.find((n) => n.dataset.ufmsGoto === qaUfms); if (t) t.click(); }
  })();

  /* ============================================================
     7. Contact form (Netlify). On hosts without a form backend
        (e.g. GitHub Pages returns 405 for POST) the submission is
        NOT lost: the failure path rebuilds the whole enquiry into a
        prefilled email + WhatsApp link so the visitor can still send.
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

        // compose the enquiry as plain text (used by the fallback links)
        const composeEnquiry = () => {
          const v = (name) => (form.querySelector(`[name="${name}"]`) || {}).value || "";
          const parts = [
            `Name: ${v("name")}`,
            `Email: ${v("email")}`,
            v("company") ? `Company: ${v("company")}` : null,
            v("focus") ? `Wants to systemize: ${v("focus")}` : null,
            v("readiness_score") ? `Readiness score: ${v("readiness_score")}` : null
          ].filter(Boolean);
          return parts.join("\n") + "\n\n" + v("message");
        };

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
          if (status) {
            // build the fallback links from the visitor's own entries so
            // nothing they typed is lost (DOM nodes, no innerHTML)
            const body = composeEnquiry();
            status.textContent = "That didn't go through — send it directly instead: ";
            const mail = document.createElement("a");
            mail.href = "mailto:hello@safetyline.africa?subject=" +
              encodeURIComponent("Consultation request — Safetyline website") +
              "&body=" + encodeURIComponent(body);
            mail.textContent = "email your enquiry";
            const or = document.createTextNode(" or ");
            const wa = document.createElement("a");
            wa.href = "https://wa.me/2348102354786?text=" +
              encodeURIComponent("Hi Safetyline, consultation request:\n\n" + body);
            wa.target = "_blank";
            wa.rel = "noopener";
            wa.textContent = "send it on WhatsApp";
            status.append(mail, or, wa, document.createTextNode("."));
          }
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
    const WA_NUMBER = "2348102354786"; // Safetyline WhatsApp
    const MESSAGE = "Hi Safetyline, I'd like to talk about building an intelligent system for my business.";
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
     8c. Feature showcase (agents) — a numbered feature list that drives
         which phone "screen" is shown (chat/confirm/dashboard/audit), with
         an auto-advancing progress ring, pausing on hover/focus. Reduced
         motion: no auto-advance, plain instant switching only.
     ============================================================ */
  (() => {
    const root = document.querySelector("[data-feature-showcase]");
    const section = document.getElementById("agents");
    if (!root || !section) return;
    const items = Array.from(root.querySelectorAll(".feature-item"));
    const screensWrap = section.querySelector(".phone-screens");
    const screens = Array.from(section.querySelectorAll(".phone-screen"));
    const dots = Array.from(section.querySelectorAll(".phone-dot"));
    if (!items.length || !screens.length) return;

    // screen order, shared by the list, the in-phone dots and swipe
    const keys = items.map((el) => el.dataset.feature); // chat, confirm, dashboard, audit
    const AUTOPLAY_MS = 4800;
    let activeIndex = Math.max(0, items.findIndex((el) => el.classList.contains("is-active")));
    let startedAt = 0;
    let paused = false;
    let inView = true;
    let rafId = 0;

    const setActive = (index) => {
      activeIndex = (index + items.length) % items.length;
      const key = keys[activeIndex];
      items.forEach((el, i) => {
        const on = i === activeIndex;
        el.classList.toggle("is-active", on);
        el.setAttribute("aria-selected", String(on));
        if (!on) el.style.removeProperty("--progress");
      });
      screens.forEach((s) => {
        const on = s.dataset.screen === key;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-hidden", String(!on));
      });
      dots.forEach((d) => {
        const on = d.dataset.goto === key;
        d.classList.toggle("is-on", on);
        d.setAttribute("aria-selected", String(on));
      });
      // "it runs the numbers live" — the agent tallies the dashboard on arrival
      if (key === "dashboard" && !reducedMotion) animateDashNumbers();
      startedAt = performance.now();
    };

    const select = (index) => {
      if (index === activeIndex) return;
      setActive(index);
    };
    const selectKey = (key) => {
      const i = keys.indexOf(key);
      if (i >= 0) select(i);
    };

    // feature list — the desktop-side primary nav
    items.forEach((el, i) => {
      el.addEventListener("click", () => select(i));
      el.addEventListener("mouseenter", () => select(i));
      el.addEventListener("focus", () => select(i));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(i); }
        if (e.key === "ArrowRight") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
        if (e.key === "ArrowLeft") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      });
    });

    // in-phone dots — tap to jump to a screen, like a real app
    dots.forEach((d) => d.addEventListener("click", () => selectKey(d.dataset.goto)));

    // swipe left/right anywhere on the phone to change screens
    let sx = 0, sy = 0, swiping = false, tracking = false;
    if (screensWrap && window.PointerEvent) {
      screensWrap.addEventListener("pointerdown", (e) => { tracking = true; swiping = false; sx = e.clientX; sy = e.clientY; });
      screensWrap.addEventListener("pointermove", (e) => {
        if (!tracking) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (!swiping && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) swiping = true;
      });
      screensWrap.addEventListener("pointerup", (e) => {
        if (tracking && swiping && Math.abs(e.clientX - sx) > 40) select(activeIndex + (e.clientX - sx < 0 ? 1 : -1));
        tracking = false; swiping = false;
      });
      screensWrap.addEventListener("pointercancel", () => { tracking = false; swiping = false; });
    }

    // confirm screen — real Confirm / Cancel buttons
    section.querySelectorAll("[data-confirm]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".confirm-card");
        if (!card) return;
        if (btn.dataset.confirm === "yes") {
          card.classList.add("is-confirmed");
          paused = true;
          setTimeout(() => selectKey("dashboard"), 1150);
          setTimeout(() => { card.classList.remove("is-confirmed"); paused = false; startedAt = performance.now(); }, 1650);
        } else {
          card.classList.remove("is-confirmed");
          card.classList.add("is-shake");
          setTimeout(() => card.classList.remove("is-shake"), 480);
        }
      });
    });

    // dashboard — interactive Day / Week / Month range control
    const dash = section.querySelector("[data-dash]");
    if (dash) {
      const N = "₦"; // naira
      const segBtns = Array.from(dash.querySelectorAll(".dash-seg-btn"));
      const bars = Array.from(dash.querySelectorAll("[data-chart] span"));
      const axis = Array.from(dash.querySelectorAll(".dash-xaxis i"));
      const totalEl = dash.querySelector("[data-chart-total]");
      const kpi = (n) => dash.querySelector('[data-kpi="' + n + '"]');
      const DATA = {
        day:   { bars: [45, 60, 52, 74, 66, 88, 100], axis: ["8a", "10", "12", "2p", "4", "6", "8"], total: N + "728k", revenue: N + "728k", eggs: "112", orders: "37", mortality: "0.4%" },
        week:  { bars: [62, 70, 58, 80, 74, 92, 86], axis: ["M", "T", "W", "T", "F", "S", "S"], total: N + "4.9M", revenue: N + "4.9M", eggs: "784", orders: "251", mortality: "0.5%" },
        month: { bars: [50, 64, 72, 60, 84, 78, 96], axis: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"], total: N + "21M", revenue: N + "21M", eggs: "3.3k", orders: "1,090", mortality: "0.6%" },
      };
      const render = (range) => {
        const d = DATA[range];
        if (!d) return;
        bars.forEach((b, i) => b.style.setProperty("--h", (d.bars[i] || 40) + "%"));
        axis.forEach((a, i) => { a.textContent = d.axis[i] || ""; });
        if (totalEl) totalEl.textContent = d.total;
        const eggsEl = kpi("eggs");
        if (eggsEl && eggsEl.firstChild) eggsEl.firstChild.nodeValue = d.eggs; // keep the <span>crates</span>
        if (kpi("revenue")) kpi("revenue").textContent = d.revenue;
        if (kpi("orders")) kpi("orders").textContent = d.orders;
        if (kpi("mortality")) kpi("mortality").textContent = d.mortality;
      };
      segBtns.forEach((b) => b.addEventListener("click", () => {
        segBtns.forEach((x) => { const on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-selected", String(on)); });
        render(b.dataset.range);
      }));
    }

    // count a metric up from zero, preserving its prefix/suffix (₦…k, …%, …crates)
    const countUp = (el) => {
      const hasChild = el.children.length > 0;
      const node = hasChild ? el.firstChild : el;
      const finalText = hasChild ? (node ? node.nodeValue : "") : el.textContent;
      const m = String(finalText).match(/^([^\d]*)([\d.,]+)([\s\S]*)$/);
      if (!m) return;
      const prefix = m[1], raw = m[2], suffix = m[3];
      const target = parseFloat(raw.replace(/,/g, ""));
      if (!isFinite(target)) return;
      const decimals = (raw.split(".")[1] || "").length;
      const grouped = raw.indexOf(",") >= 0;
      const fmt = (v) => {
        const s = grouped
          ? v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
          : v.toFixed(decimals);
        return prefix + s + suffix;
      };
      const dur = 680, start = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const v = target * (1 - Math.pow(1 - p, 3));
        const out = p < 1 ? fmt(v) : finalText;
        if (hasChild) { if (node) node.nodeValue = out; } else { el.textContent = out; }
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const animateDashNumbers = () => {
      const d = section.querySelector("[data-dash]");
      if (!d) return;
      [...d.querySelectorAll("[data-kpi]"), d.querySelector("[data-chart-total]")]
        .filter(Boolean).forEach(countUp);
    };

    // ?feature=<key> forces the initial screen — QA/screenshot hook only,
    // mirrors the existing ?static / ?solo convention.
    const qaFeature = new URLSearchParams(location.search).get("feature");
    if (qaFeature) {
      const qaIndex = keys.indexOf(qaFeature);
      if (qaIndex >= 0) activeIndex = qaIndex;
    }

    // initialise ARIA + start the ring from a clean state
    setActive(activeIndex);

    // reduced motion → no auto-advance; a forced ?feature= (QA/screenshots)
    // also freezes autoplay so the requested screen stays put. Interactions
    // (list, dots, swipe, buttons) keep working in both cases.
    if (reducedMotion || qaFeature) return;

    // pause auto-advance while the user is on the list OR touching the phone
    const stage = section.querySelector(".iphone-stage");
    [root, stage].forEach((el) => {
      if (!el) return;
      el.addEventListener("mouseenter", () => { paused = true; });
      el.addEventListener("mouseleave", () => { paused = false; startedAt = performance.now(); });
      el.addEventListener("focusin", () => { paused = true; });
      el.addEventListener("focusout", () => { paused = false; startedAt = performance.now(); });
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => { inView = es[0].isIntersecting; }, { threshold: 0.25 }).observe(section);
    }

    const tick = (t) => {
      if (!paused && inView && !document.hidden) {
        const p = Math.min(1, (t - startedAt) / AUTOPLAY_MS);
        items[activeIndex].style.setProperty("--progress", p.toFixed(3));
        if (p >= 1) setActive(activeIndex + 1);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) startedAt = performance.now() - (AUTOPLAY_MS * (+items[activeIndex].style.getPropertyValue("--progress") || 0));
    });
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

    // Expose the readiness data + scoring so the chat dock can run the SAME quiz
    // inline — single source of truth for questions, tiers, and scoring.
    window.SL_BAR = {
      questions: QUESTIONS,
      tiers: TIERS,
      score: (answers) => Math.round(
        answers.reduce((sum, ai, qi) => sum + QUESTIONS[qi].weight * (QUESTIONS[qi].options[ai].lvl / 2), 0)
      ),
      tierFor: (score) => [...TIERS].reverse().find((t) => score >= t.min) || TIERS[0]
    };

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
    // Two selectable personas (Bari / Biba). The visitor picks one when the dock
    // opens; the choice is sent as `agent` on every live turn and flavours the
    // greeting. Falls back to a single persona for older configs.
    const PERSONAS = (Array.isArray(cfg.personas) && cfg.personas.length)
      ? cfg.personas
      : [{ key: "biba", name: cfg.persona || "Biba", tagline: "Safetyline assistant" }];
    const DEFAULT_AGENT = cfg.defaultPersona || PERSONAS[0].key;
    const agentOf = (k) => PERSONAS.find((p) => p.key === k) || PERSONAS[0];
    let agentKey = null;                        // chosen persona key (null = not yet picked)
    let persona = agentOf(DEFAULT_AGENT).name;  // current display name (used by greeting copy)
    const nameEl = document.getElementById("dock-name");
    if (nameEl) nameEl.textContent = PERSONAS.length > 1 ? "Safetyline" : persona;
    if (status) status.textContent = live ? "Online — Safetyline" : "Safetyline assistant";

    // First-party analytics — fire-and-forget POST to the /t ingest endpoint,
    // only when the live backend is configured. Never blocks the UI or throws.
    const trackUrl = live ? cfg.endpoint.replace(/\/chat\/?$/, "/t") : "";
    const track = (kind, extra) => {
      if (!trackUrl) return;
      try {
        fetch(trackUrl, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.assign({ kind }, extra || {})),
          keepalive: true
        }).catch(() => {});
      } catch (_) {}
    };
    // Honeypot: a hidden field humans never fill; bots autofill it. Its value
    // rides the chat POST body so the backend can drop bot traffic.
    let honeypot = null;
    try {
      honeypot = document.createElement("input");
      honeypot.type = "text";
      honeypot.name = "contact_time";
      honeypot.tabIndex = -1;
      honeypot.autocomplete = "off";
      honeypot.setAttribute("aria-hidden", "true");
      honeypot.style.cssText =
        "position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;";
      form.appendChild(honeypot);
    } catch (_) {}

    track("page_view", { path: location.pathname });
    document.addEventListener("click", (e) => {
      const el = e.target.closest && e.target.closest("[data-cta],[data-wa]");
      if (el) track("cta_click", { target: (el.getAttribute("data-cta") || "whatsapp").slice(0, 80) });
    }, { passive: true });

    let sessionId;
    try {
      sessionId = localStorage.getItem("hermes-session") ||
        (crypto.randomUUID ? crypto.randomUUID() : String(Math.floor(performance.now() * 1e6)));
      localStorage.setItem("hermes-session", sessionId);
    } catch {
      sessionId = "anon";
    }

    // WhatsApp-style message meta: a subtle timestamp, plus sent/read ticks on
    // the visitor's own messages.
    const fmtTime = () => {
      try { return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
      catch { return ""; }
    };

    // ── Conversation persistence (returning-visitor continuity) ─────────────
    // The plain-text transcript is saved to localStorage so a reload / return
    // visit resumes the chat. The backend session (httpOnly sl_sid cookie)
    // persists in parallel, so the agent keeps the full context too.
    const CHAT_KEY = "sl-chat";
    const CHAT_TTL = 3 * 24 * 3600 * 1000; // 3 days
    const transcript = [];
    let restoring = false;
    const persistChat = () => {
      try { localStorage.setItem(CHAT_KEY, JSON.stringify({ v: 1, agent: agentKey, at: Date.now(), msgs: transcript.slice(-40) })); }
      catch { /* private mode / quota */ }
    };
    const record = (who, text, time) => {
      if (restoring || !text) return;
      transcript.push({ who, text, time: time || fmtTime() });
      persistChat();
    };

    const addMeta = (el, who, time) => {
      const meta = document.createElement("span");
      meta.className = "dock-meta";
      meta.appendChild(document.createTextNode(time || fmtTime()));
      if (who === "user") {
        const tick = document.createElement("i");
        tick.className = "dock-tick";
        tick.textContent = "✓"; // ✓ sent → ✓✓ once the agent responds
        meta.appendChild(tick);
      }
      el.appendChild(meta);
    };
    // Once the agent responds, upgrade the visitor's ticks to "read".
    const markRead = () => {
      msgs.querySelectorAll(".dock-tick:not(.read)").forEach((t) => {
        t.textContent = "✓✓";
        t.classList.add("read");
      });
    };
    const add = (text, who, asHTML, time) => {
      const el = document.createElement("div");
      el.className = `dock-msg dock-msg--${who}`;
      if (asHTML) el.innerHTML = text;
      else if (text) el.textContent = text;
      msgs.appendChild(el);
      if (text || who === "user") addMeta(el, who, time); // empty bot bubbles get meta in renderBotMessage
      if (who === "bot") markRead();
      if (!asHTML && text) record(who, text, time); // persist plain user/bot text
      msgs.scrollTop = msgs.scrollHeight;
      return el;
    };

    // A WhatsApp glyph reused from the page's SVG symbol defs.
    const svgIcon = (id) => {
      const NS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(NS, "svg");
      const use = document.createElementNS(NS, "use");
      use.setAttribute("href", id);
      svg.appendChild(use);
      return svg;
    };

    // Linkify inline URLs safely — DOM nodes only, never innerHTML on model
    // output; hrefs are forced to http(s). Returns el.
    const LINK_RE = /(https?:\/\/[^\s<>]+|www\.[^\s<>]+)/gi;
    const renderRich = (el, text) => {
      let last = 0, m;
      LINK_RE.lastIndex = 0;
      while ((m = LINK_RE.exec(text)) !== null) {
        if (m.index > last) el.appendChild(document.createTextNode(text.slice(last, m.index)));
        let url = m[0], trail = "";
        const tm = url.match(/[.,);:!?]+$/); // keep trailing sentence punctuation as text
        if (tm) { trail = tm[0]; url = url.slice(0, -trail.length); }
        const a = document.createElement("a");
        a.href = /^https?:\/\//i.test(url) ? url : "https://" + url;
        a.target = "_blank"; a.rel = "noopener";
        a.textContent = url.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
        el.appendChild(a);
        if (trail) el.appendChild(document.createTextNode(trail));
        last = m.index + m[0].length;
      }
      if (last < text.length) el.appendChild(document.createTextNode(text.slice(last)));
      return el;
    };

    // A block-level, right-sized in-chat action button (WhatsApp/Telegram style).
    const makeAction = (label, iconId, cls, onClick, href) => {
      const b = document.createElement(href ? "a" : "button");
      b.className = "dock-action" + (cls ? " " + cls : "");
      if (href) { b.href = href; b.target = "_blank"; b.rel = "noopener"; }
      else { b.type = "button"; if (onClick) b.addEventListener("click", onClick); }
      if (iconId) b.appendChild(svgIcon(iconId));
      b.appendChild(document.createTextNode(label));
      return b;
    };

    // Render a bot message as rich content: the text (with inline links) plus a
    // dedicated ACTIONS row. A wa.me handoff link is lifted OUT of the prose and
    // turned into a proper "Continue on WhatsApp" button on its own row — never a
    // raw URL or an oversized chip jammed mid-sentence.
    const WA_IN_TEXT = /\bhttps?:\/\/wa\.me\/[^\s<>]+|\bwa\.me\/[^\s<>]+/i;
    const renderBotMessage = (el, text, time) => {
      el.textContent = "";
      // strip any [[actions: ...]] / stray [[...]] markers from the display text
      text = String(text).replace(/\[\[[^\]]*\]\]/g, "").replace(/\n{3,}/g, "\n\n").trim();
      let waHrefStr = null;
      const wm = text.match(WA_IN_TEXT);
      if (wm) {
        waHrefStr = /^https?:/i.test(wm[0]) ? wm[0] : "https://" + wm[0];
        text = text.replace(wm[0], "")
                   .replace(/[ \t]{2,}/g, " ")
                   .replace(/[ \t]*[:\-—][ \t]*(?=\n|$)/g, "")  // drop dangling "here:" lead-ins
                   .replace(/\n{3,}/g, "\n\n").trim();
      }
      const body = document.createElement("div");
      body.className = "dock-msg-text";
      renderRich(body, text);
      el.appendChild(body);
      if (waHrefStr) {
        const row = document.createElement("div");
        row.className = "dock-msg-actions";
        row.appendChild(makeAction("Continue on WhatsApp", "#i-whatsapp", "dock-action--wa", null, waHrefStr));
        el.appendChild(row);
      }
      record("bot", text, time); // persist the clean prose (streamed replies)
      addMeta(el, "bot", time);
      markRead();
      return el;
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

    // NDPA consent line — rendered once inside the panel on first open. Only
    // privacy surface in the widget for Milestone 2.
    const renderConsent = () => {
      if (!cfg.consentText) return;
      const el = document.createElement("p");
      el.className = "dock-consent";
      el.textContent = cfg.consentText;
      msgs.appendChild(el);
    };

    // Transient "working…" line for tool.activity. The backend (M4) sends a
    // customer-safe phrase (never a raw tool name) which we render here; falls
    // back to a generic label if none is supplied.
    const addWorking = (label) => {
      const el = document.createElement("div");
      el.className = "dock-working";
      el.textContent = label || "working…";
      msgs.appendChild(el);
      msgs.scrollTop = msgs.scrollHeight;
      return el;
    };

    // Lightweight first-touch UTM + referrer capture (none existed before). The
    // single-page site has no path/UTM richness — see SPEC §1/C10.
    const utmParams = (() => {
      let utm = {};
      try {
        const p = new URLSearchParams(location.search);
        ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
          const v = p.get(k);
          if (v) utm[k.slice(4)] = v; // {source, medium, campaign, term, content}
        });
        if (Object.keys(utm).length) sessionStorage.setItem("sl-utm", JSON.stringify(utm));
        else {
          const stored = sessionStorage.getItem("sl-utm");
          if (stored) utm = JSON.parse(stored);
        }
      } catch { utm = {}; }
      return utm;
    })();

    // Real single-page signals sent with every live turn.
    const pageContext = () => {
      const ctx = { referrer: document.referrer || "", utm: utmParams };
      const sec = document.querySelector("[data-nav].is-active");
      if (sec && sec.dataset.nav) ctx.section = sec.dataset.nav;                  // scrollspy section
      const uc = document.querySelector(".uc-tab.is-active");
      if (uc && uc.dataset.app) ctx.use_case = uc.dataset.app;                    // ufms|os|order|labour
      try {
        const score = sessionStorage.getItem("bar-score");                        // readiness test result
        if (score != null && score !== "") ctx.readiness_score = Number(score);
      } catch { /* no score yet */ }
      return ctx;
    };

    // Context-aware openers (M4 — visible agency). Tailor the greeting and the
    // teaser to what the visitor was actually looking at, using the same page
    // signals sent with every turn. Deterministic maps, no network; founder can
    // tune the copy. Falls back to the generic config lines.
    const USE_CASE_LABEL = {
      ufms: "UFMS, the farm system",
      os: "the operations system",
      order: "the ordering app",
      labour: "the membership portal"
    };
    const USE_CASE_TEASER = {
      ufms: "Curious about UFMS? Ask me →",
      os: "Questions on the ops system? →",
      order: "How the ordering app works? →",
      labour: "About the membership portal? →"
    };
    // A use-case tab is ALWAYS active by default (its tabs live in the
    // "products" section), so only treat it as a signal when the visitor is
    // actually in that section — otherwise everyone gets the UFMS opener.
    const activeUseCase = (ctx) => (ctx.section === "products" ? ctx.use_case : null);
    const contextualGreeting = () => {
      const ctx = pageContext();
      const uc = activeUseCase(ctx);
      if (uc && USE_CASE_LABEL[uc]) {
        return `Hi, I'm ${persona}. Saw you looking at ${USE_CASE_LABEL[uc]} — want the quick version of how it works, or something specific?`;
      }
      if (typeof ctx.readiness_score === "number") {
        return `Hi, I'm ${persona} — nice, you took the readiness test. Want to talk through what your score means for your business?`;
      }
      switch (ctx.section) {
        case "products":
        case "systems":
          return `Hi, I'm ${persona}. Looked like you were exploring what we build — want the short version, or is there something specific in mind?`;
        case "agents":
          return `Hi, I'm ${persona}. The agents are the part people ask about most — want to see how one would work for your business?`;
        case "readiness":
          return `Hi, I'm ${persona}. Curious how ready your business is for an agent? I can walk you through it — or take the 60-second test above.`;
        case "contact":
          return `Hi, I'm ${persona}. Thinking of reaching out? Ask me a quick question first, or I'll point you to the right next step.`;
        default:
          return agentOf(agentKey).greeting || cfg.greeting || `Hi, I'm ${persona} — how can I help?`;
      }
    };
    const contextualTeaser = () => {
      const ctx = pageContext();
      const uc = activeUseCase(ctx);
      if (uc && USE_CASE_TEASER[uc]) return USE_CASE_TEASER[uc];
      if (typeof ctx.readiness_score === "number") return "Want to talk through your score? →";
      if (ctx.section === "contact") return "Have a quick question first? →";
      return cfg.teaserText || "Questions? Ask me →";
    };

    // Hardcoded (non-model) error/degrade copy — safe to render as HTML.
    const ERROR_HTML = "I'm having trouble reaching the agent right now. You can always email <a href='mailto:hello@safetyline.africa'>hello@safetyline.africa</a> or <a href='#contact'>book a consultation</a>.";

    const waHref = () => {
      const num = cfg.waNumber || "2348102354786";
      const msg = "Hi Safetyline, I'd like to continue our chat.";
      return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
    };

    // On a per-session turn limit, swap the composer for a "continue on WhatsApp"
    // affordance (mirrors the site's [data-wa] link pattern).
    let composerSwapped = false;
    const swapComposerToWhatsApp = () => {
      if (composerSwapped) return;
      composerSwapped = true;
      hideTools();
      form.hidden = true;
      form.style.display = "none"; // beats .dock-form { display:flex } (the [hidden] UA rule alone can't)
      const wrap = document.createElement("div");
      wrap.className = "dock-form dock-form--wa";
      const a = document.createElement("a");
      a.className = "glass-btn glass-btn--accent dock-wa-btn";
      a.href = waHref();
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "Continue on WhatsApp";
      wrap.appendChild(a);
      form.parentNode.appendChild(wrap);
    };

    let greeted = false;
    let open = false;

    // ── Agent picker (Bari / Biba) ──────────────────────────────────────────
    // Renders a chooser as the first thing in the panel. Picking a persona sets
    // `agentKey`, updates the header, and greets in that voice. A small header
    // control lets the visitor switch mid-session.
    const renderPicker = () => {
      form.hidden = true; // no composer until they've chosen who to talk to
      hideTools();
      const wrap = document.createElement("div");
      wrap.className = "dock-picker";
      const h = document.createElement("p");
      h.className = "dock-picker-h";
      h.textContent = "Who would you like to chat with?";
      wrap.appendChild(h);
      PERSONAS.forEach((p) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "dock-agent dock-agent--" + p.key;
        const av = document.createElement("span");
        av.className = "dock-agent-av";
        av.textContent = (p.name || "?").charAt(0);
        const tx = document.createElement("span");
        tx.className = "dock-agent-t";
        const nm = document.createElement("strong");
        nm.textContent = p.name;
        const tg = document.createElement("small");
        tg.textContent = p.tagline || "";
        tx.appendChild(nm); tx.appendChild(tg);
        b.appendChild(av); b.appendChild(tx);
        b.addEventListener("click", () => chooseAgent(p.key));
        wrap.appendChild(b);
      });
      msgs.appendChild(wrap);
      msgs.scrollTop = msgs.scrollHeight;
    };

    const chooseAgent = (key) => {
      const p = agentOf(key);
      agentKey = p.key;
      persona = p.name;
      if (nameEl) nameEl.textContent = p.name;
      if (status) status.textContent = live ? `Online — ${p.name}` : `${p.name} · Safetyline`;
      dock.dataset.agent = p.key; // avatar/theme hook
      if (switchBtn) switchBtn.hidden = PERSONAS.length < 2;
      try { sessionStorage.setItem("sl-agent", p.key); } catch {}
      msgs.querySelectorAll(".dock-picker").forEach((el) => el.remove());
      form.hidden = false;
      add(contextualGreeting(), "bot");
      addStarters();
      showTools();
      setTimeout(() => input && input.focus(), 60);
    };

    // "Switch" control injected into the header (before the close button).
    let switchBtn = null;
    (() => {
      const head = panel.querySelector(".dock-head");
      const closeBtn = document.getElementById("dock-close");
      if (!head || PERSONAS.length < 2) return;
      switchBtn = document.createElement("button");
      switchBtn.type = "button";
      switchBtn.className = "dock-switch";
      switchBtn.hidden = true;
      switchBtn.setAttribute("aria-label", "Switch agent");
      switchBtn.textContent = "⇄";
      head.insertBefore(switchBtn, closeBtn || null);
      switchBtn.addEventListener("click", () => {
        // Seamless handover to the next persona — KEEP the whole conversation and
        // context; the backend + strengthened identity rule make the new persona
        // take over cleanly (no restart, no lost history).
        const idx = PERSONAS.findIndex((x) => x.key === agentKey);
        const next = PERSONAS[(idx + 1) % PERSONAS.length];
        if (!next || next.key === agentKey) return;
        const fromName = persona;
        const p = agentOf(next.key);
        agentKey = p.key;
        persona = p.name;
        if (nameEl) nameEl.textContent = p.name;
        if (status) status.textContent = live ? `Online — ${p.name}` : `${p.name} · Safetyline`;
        dock.dataset.agent = p.key;
        try { sessionStorage.setItem("sl-agent", p.key); } catch {}
        const div = document.createElement("div");
        div.className = "dock-divider";
        div.innerHTML = ""; // built via DOM below
        div.appendChild(document.createTextNode(`${fromName} handed you over to ${p.name}`));
        msgs.appendChild(div);
        add(p.handover || `Hi, I'm ${p.name} — I've got everything from your chat so far. How can I help?`, "bot");
        msgs.scrollTop = msgs.scrollHeight;
        setTimeout(() => input && input.focus(), 60);
      });
    })();

    // ── In-chat quick actions (WhatsApp / Telegram style) ───────────────────
    // Programmatic send — lets chips and the tool bar drive the conversation.
    const sendText = (t) => {
      if (composerSwapped || !t) return;
      input.value = t;
      form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    };

    // One-tap suggestion chips shown after the greeting to get people talking.
    const STARTERS = [
      { label: "How does it work?", send: "How does it work?" },
      { label: "🧮 Check my AI readiness", quiz: true },
      { label: "What would it cost?", send: "What would it cost?" },
    ];
    const runStarter = (a, wrap) => {
      wrap.remove();
      if (a.quiz) startReadinessQuiz();
      else if (a.send) sendText(a.send);
    };
    const addStarters = () => {
      const wrap = document.createElement("div");
      wrap.className = "dock-chips";
      STARTERS.forEach((a) => {
        const c = document.createElement("button");
        c.type = "button";
        c.className = "dock-chip";
        c.textContent = a.label;
        c.addEventListener("click", () => runStarter(a, wrap));
        wrap.appendChild(c);
      });
      msgs.appendChild(wrap);
      msgs.scrollTop = msgs.scrollHeight;
    };

    // Persistent quick-actions bar pinned above the composer — always-available
    // tools, like a messaging app's reply keyboard.
    let toolsBar = null;
    const TOOLS = [
      { label: "Book a call", icon: "#i-clock", lead: true },
      { label: "WhatsApp", icon: "#i-whatsapp", cls: "dock-tool--wa", wa: true },
      { label: "Readiness", icon: "#i-target", quiz: true },
    ];
    const showTools = () => {
      if (toolsBar) { toolsBar.hidden = false; return; }
      toolsBar = document.createElement("div");
      toolsBar.className = "dock-tools";
      TOOLS.forEach((a) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "dock-tool" + (a.cls ? " " + a.cls : "");
        b.appendChild(svgIcon(a.icon));
        b.appendChild(document.createTextNode(a.label));
        b.addEventListener("click", () => {
          if (a.wa) window.open(waHref(), "_blank", "noopener");
          else if (a.quiz) startReadinessQuiz();
          else if (a.lead) openLeadCard();
          else if (a.scroll) { setOpen(false); document.querySelector(a.scroll)?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" }); }
          else if (a.send) sendText(a.send);
        });
        toolsBar.appendChild(b);
      });
      form.parentNode.insertBefore(toolsBar, form);
    };
    const hideTools = () => { if (toolsBar) toolsBar.hidden = true; };

    // ── In-chat AI Readiness test — interactive, button-driven, inline ──────
    // Runs the SAME 7-question quiz as the page (window.SL_BAR), rendered as
    // tappable option buttons in the chat (WhatsApp/Telegram style). Feeds the
    // score into the agent's context (sessionStorage bar-score → page.readiness).
    let quizActive = false;
    const startReadinessQuiz = () => {
      const BAR = window.SL_BAR;
      if (quizActive) return;
      if (!BAR || !BAR.questions) { // fallback to the on-page test
        setOpen(false);
        document.querySelector("#readiness")?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" });
        return;
      }
      quizActive = true;
      add("Let's do a quick readiness check — 7 short questions, about a minute. Just tap your answer for each.", "bot");
      const answers = [];
      const askQ = (i) => {
        if (i >= BAR.questions.length) return finishQuiz(answers);
        const q = BAR.questions[i];
        const msg = add("", "bot");
        const t = document.createElement("div");
        t.className = "dock-msg-text";
        t.textContent = `Question ${i + 1} of ${BAR.questions.length}\n${q.q}`;
        msg.appendChild(t);
        const opts = document.createElement("div");
        opts.className = "dock-quiz-opts";
        q.options.forEach((opt, oi) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "dock-quiz-opt";
          b.textContent = opt.label;
          b.addEventListener("click", () => {
            opts.querySelectorAll("button").forEach((x) => { x.disabled = true; });
            b.classList.add("is-chosen");
            add(opt.label, "user");
            answers[i] = oi;
            setTimeout(() => askQ(i + 1), 260);
          });
          opts.appendChild(b);
        });
        msg.appendChild(opts);
        msgs.scrollTop = msgs.scrollHeight;
      };
      askQ(0);
    };
    const finishQuiz = (answers) => {
      const BAR = window.SL_BAR;
      const score = BAR.score(answers);
      const tier = BAR.tierFor(score);
      try { sessionStorage.setItem("bar-score", String(score)); } catch {}
      const field = document.getElementById("readiness-score-field");
      if (field) field.value = `${score}/100 — ${tier.name}`;

      const msg = add("", "bot");
      msg.classList.add("dock-result");
      const card = document.createElement("div");
      card.className = "dock-result-card";
      const sc = document.createElement("div");
      sc.className = "dock-result-score";
      const big = document.createElement("strong"); big.textContent = String(score);
      const outof = document.createElement("span"); outof.textContent = "/100";
      sc.appendChild(big); sc.appendChild(outof);
      const tn = document.createElement("div");
      tn.className = "dock-result-tier"; tn.textContent = tier.name;
      card.appendChild(sc); card.appendChild(tn);
      msg.appendChild(card);
      const sum = document.createElement("div");
      sum.className = "dock-msg-text"; sum.textContent = tier.summary;
      msg.appendChild(sum);
      const ul = document.createElement("ul");
      ul.className = "dock-result-recs";
      (tier.recs || []).slice(0, 2).forEach((r) => {
        const li = document.createElement("li"); li.textContent = r; ul.appendChild(li);
      });
      if (ul.children.length) msg.appendChild(ul);
      const acts = document.createElement("div");
      acts.className = "dock-msg-actions";
      acts.appendChild(makeAction(
        tier.cta || "Book my free consultation", "#i-clock", "dock-action--primary",
        () => sendText(`I just did the readiness test — I scored ${score}/100 (${tier.name}). I'd like to book my free consultation.`)
      ));
      msg.appendChild(acts);
      msgs.scrollTop = msgs.scrollHeight;
      quizActive = false;
    };

    // ── Contextual action suggestions (best-of-WhatsApp/Telegram smart replies) ──
    // After an agent reply, offer up to 3 tappable next-steps — from explicit
    // [[actions: ...]] markers the agent may emit AND client-side intent
    // detection of the reply. Only shows on a real signal (never spammy), and
    // always points toward a next step / CTA.
    const ACTION_DEFS = {
      readiness: { label: "🧮 Check my readiness", run: () => startReadinessQuiz() },
      book:      { label: "📅 Leave my details",   run: () => openLeadCard() },
      usecases:  { label: "📂 See our work",       run: () => showUseCaseGallery() },
      whatsapp:  { label: "💬 WhatsApp",           run: () => window.open(waHref(), "_blank", "noopener") },
    };
    const detectActions = (text) => {
      const t = (text || "").toLowerCase();
      const keys = [];
      if (/\breadiness\b|how ready|where you stand|readiness (test|check)|60-second|60 second/.test(t)) keys.push("readiness");
      if (/\bbook\b|consultation|discovery call|schedule a|hop on a call|free call|leave your details|your details|reach out/.test(t)) keys.push("book");
      if (/use case|we (built|'ve built|have built)|for example|portfolio|proof|ufms|truckville|labour party|systems we've/.test(t)) keys.push("usecases");
      return keys;
    };
    const parseMarkers = (raw) => {
      const keys = [];
      (String(raw || "").match(/\[\[\s*actions?\s*:\s*([^\]\n]+)\]\]/gi) || []).forEach((m) => {
        m.replace(/\[\[\s*actions?\s*:\s*/i, "").replace(/\]\]$/, "")
         .split(/[,\s]+/).forEach((k) => { k = k.trim().toLowerCase(); if (ACTION_DEFS[k]) keys.push(k); });
      });
      return keys;
    };
    const addSuggestions = (rawText, markerKeys) => {
      const keys = [];
      [...(markerKeys || []), ...detectActions(rawText)].forEach((k) => { if (ACTION_DEFS[k] && !keys.includes(k)) keys.push(k); });
      if (!keys.length) return;
      const wrap = document.createElement("div");
      wrap.className = "dock-suggestions";
      keys.slice(0, 3).forEach((k) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "dock-suggest";
        b.textContent = ACTION_DEFS[k].label;
        b.addEventListener("click", () => { wrap.remove(); ACTION_DEFS[k].run(); });
        wrap.appendChild(b);
      });
      msgs.appendChild(wrap);
      msgs.scrollTop = msgs.scrollHeight;
    };

    // Gentle, once-per-session re-engagement: if the visitor has chatted a bit
    // then goes quiet after a reply, offer a soft next step (never nags).
    let nudged = false, nudgeTimer = null, exchanges = 0;
    const clearNudge = () => { if (nudgeTimer) { clearTimeout(nudgeTimer); nudgeTimer = null; } };
    const scheduleNudge = () => {
      clearNudge();
      if (nudged || exchanges < 2) return;
      nudgeTimer = setTimeout(() => {
        if (nudged || !open || leadCardOpen || quizActive || composerSwapped) return;
        nudged = true;
        add("Whenever you're ready, I can set up a quick call or connect you on WhatsApp — no pressure at all.", "bot");
        addSuggestions("", ["book", "whatsapp"]);
      }, 32000);
    };

    // Use-case gallery card — a rich, tappable showcase of what we've built.
    const USE_CASES = [
      { emoji: "🐔", name: "UFMS", desc: "Poultry farm system", q: "Tell me about UFMS, the farm system." },
      { emoji: "🍔", name: "TruckVille OS", desc: "Food-venue operations", q: "Tell me about TruckVille OS." },
      { emoji: "📱", name: "Ordering App", desc: "Customer ordering", q: "Tell me about the TruckVille ordering app." },
      { emoji: "🗳️", name: "Labour Party", desc: "Membership portal", q: "Tell me about the Labour Party membership portal." },
    ];
    const showUseCaseGallery = () => {
      const msg = add("", "bot");
      const t = document.createElement("div");
      t.className = "dock-msg-text";
      t.textContent = "Here's some of what we've built — tap any to hear more:";
      msg.appendChild(t);
      const grid = document.createElement("div");
      grid.className = "dock-gallery";
      USE_CASES.forEach((u) => {
        const c = document.createElement("button");
        c.type = "button";
        c.className = "dock-uc";
        const e = document.createElement("span"); e.className = "dock-uc-emoji"; e.textContent = u.emoji;
        const tx = document.createElement("span"); tx.className = "dock-uc-t";
        const nm = document.createElement("strong"); nm.textContent = u.name;
        const ds = document.createElement("small"); ds.textContent = u.desc;
        tx.appendChild(nm); tx.appendChild(ds);
        c.appendChild(e); c.appendChild(tx);
        c.addEventListener("click", () => sendText(u.q));
        grid.appendChild(c);
      });
      msg.appendChild(grid);
      msgs.scrollTop = msgs.scrollHeight;
    };

    // Inline lead-capture card — a strong, low-friction conversion CTA.
    let leadCardOpen = false;
    const openLeadCard = () => {
      if (leadCardOpen || composerSwapped) return;
      leadCardOpen = true;
      const msg = add("", "bot");
      const t = document.createElement("div");
      t.className = "dock-msg-text";
      t.textContent = "Leave your details and the team will reach out — no obligation.";
      msg.appendChild(t);
      const box = document.createElement("div");
      box.className = "dock-leadform";
      const nameI = document.createElement("input"); nameI.type = "text"; nameI.placeholder = "Your name"; nameI.autocomplete = "name"; nameI.setAttribute("aria-label", "Your name");
      const phoneI = document.createElement("input"); phoneI.type = "tel"; phoneI.placeholder = "WhatsApp number"; phoneI.autocomplete = "tel"; phoneI.setAttribute("aria-label", "WhatsApp number");
      const wantI = document.createElement("input"); wantI.type = "text"; wantI.placeholder = "What you'd like to build (optional)"; wantI.setAttribute("aria-label", "What you'd like to build");
      const submit = document.createElement("button");
      submit.type = "button"; submit.className = "dock-action dock-action--primary dock-lead-send"; submit.textContent = "Send my details";
      submit.addEventListener("click", () => {
        const name = nameI.value.trim(), phone = phoneI.value.trim(), want = wantI.value.trim();
        if (!name || !phone) { box.classList.add("is-error"); (name ? phoneI : nameI).focus(); return; }
        box.querySelectorAll("input,button").forEach((x) => { x.disabled = true; });
        leadCardOpen = false;
        const done = document.createElement("p"); done.className = "dock-leadform-done";
        done.textContent = "✓ Sent — the team will reach out. Thank you!";
        box.appendChild(done);
        sendText(`Please have the team follow up with me. Name: ${name}. WhatsApp: ${phone}.${want ? " I'd like to build: " + want + "." : ""}`);
      });
      [nameI, phoneI, wantI, submit].forEach((x) => box.appendChild(x));
      msg.appendChild(box);
      msgs.scrollTop = msgs.scrollHeight;
      setTimeout(() => nameI.focus(), 60);
    };

    // Restore a saved conversation on a return visit (plain-text transcript).
    const restoreChat = (saved) => {
      restoring = true;
      const p = agentOf(saved.agent);
      agentKey = p.key;
      persona = p.name;
      if (nameEl) nameEl.textContent = p.name;
      if (status) status.textContent = live ? `Online — ${p.name}` : `${p.name} · Safetyline`;
      dock.dataset.agent = p.key;
      if (switchBtn) switchBtn.hidden = PERSONAS.length < 2;
      try { sessionStorage.setItem("sl-agent", p.key); } catch {}
      const div = document.createElement("div");
      div.className = "dock-divider";
      div.appendChild(document.createTextNode("Welcome back — picking up where we left off"));
      msgs.appendChild(div);
      (saved.msgs || []).forEach((m) => {
        if (m.who === "user") add(m.text, "user", false, m.time);
        else renderBotMessage(add("", "bot"), m.text, m.time);
      });
      transcript.push(...(saved.msgs || []));
      restoring = false;
      form.hidden = false;
      showTools();
      setTimeout(() => input && input.focus(), 60);
    };

    const setOpen = (next) => {
      open = next;
      btn.setAttribute("aria-expanded", String(next));
      if (next) {
        dismissTeaser();
        panel.hidden = false;
        void panel.offsetWidth; // flush styles so the open transition runs
        panel.classList.add("open");
        if (!greeted) {
          greeted = true;
          renderConsent();
          let savedChat = null;
          try { savedChat = JSON.parse(localStorage.getItem(CHAT_KEY) || "null"); } catch {}
          const canRestore = savedChat && Array.isArray(savedChat.msgs) && savedChat.msgs.length &&
            (Date.now() - (savedChat.at || 0) < CHAT_TTL) && PERSONAS.some((p) => p.key === savedChat.agent);
          if (canRestore) {
            restoreChat(savedChat);
          } else {
            let saved = null;
            try { saved = sessionStorage.getItem("sl-agent"); } catch {}
            if (saved && PERSONAS.some((p) => p.key === saved)) chooseAgent(saved);
            else if (PERSONAS.length > 1) renderPicker();
            else chooseAgent(PERSONAS[0].key);
          }
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

    // Teaser state — a one-line bubble beside the closed button, shown once per
    // session, dismissible, that opens the dock on tap. (Proactive dwell-trigger
    // openers are backend Milestone 4 — no timers here.)
    let teaserEl = null;
    const dismissTeaser = () => {
      if (!teaserEl) return;
      teaserEl.remove();
      teaserEl = null;
    };
    const maybeTeaser = () => {
      let seen = false;
      try { seen = Boolean(sessionStorage.getItem("hermes-teaser")); } catch { seen = true; }
      if (seen) return;
      try { sessionStorage.setItem("hermes-teaser", "1"); } catch { /* private mode */ }

      teaserEl = document.createElement("div");
      teaserEl.className = "dock-teaser";
      const label = document.createElement("button");
      label.type = "button";
      label.className = "dock-teaser-open";
      label.textContent = contextualTeaser();
      const x = document.createElement("button");
      x.type = "button";
      x.className = "dock-teaser-x";
      x.setAttribute("aria-label", "Dismiss");
      x.textContent = "✕";
      teaserEl.appendChild(label);
      teaserEl.appendChild(x);
      dock.appendChild(teaserEl);

      label.addEventListener("click", () => setOpen(true)); // setOpen also dismisses
      x.addEventListener("click", (e) => { e.stopPropagation(); dismissTeaser(); });
      requestAnimationFrame(() => teaserEl && teaserEl.classList.add("show"));
    };

    // Proactive dwell trigger (M4): don't nag on cold load. Wait until the
    // visitor has dwelled, or has settled on a high-intent section, then show
    // the context-aware teaser once (maybeTeaser is still once-per-session +
    // dismissible). If they open the dock first, it never fires.
    let teaserArmed = false;
    const armTeaser = () => { if (teaserArmed || open) return; teaserArmed = true; maybeTeaser(); };
    setTimeout(armTeaser, 20000); // general engaged-dwell fallback
    const HIGH_INTENT = new Set(["products", "systems", "agents", "readiness", "contact"]);
    let sectionTimer = null;
    window.addEventListener("scroll", () => {
      if (teaserArmed || open) return;
      const sec = document.querySelector("[data-nav].is-active");
      const id = sec && sec.dataset.nav;
      if (id && HIGH_INTENT.has(id)) {
        if (!sectionTimer) sectionTimer = setTimeout(armTeaser, 3500); // settled on a high-intent section
      } else if (sectionTimer) {
        clearTimeout(sectionTimer);
        sectionTimer = null;
      }
    }, { passive: true });

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
        return "The Business Agentic Readiness test takes about a minute — seven questions, instant score. <a href='#readiness'>Take it here</a>.";
      }
      if (/farm|ufms|poultry/.test(t)) {
        return "UFMS is our farm operations system — daily records, egg production, feed, mortality, and finance, run by a WhatsApp agent. Check <a href='#products'>Use Cases</a>.";
      }
      return `${cfg.offlineNote || "Here's where to go:"} <a href='#readiness'>take the 60-second readiness test</a>, <a href='#contact'>book a free consultation</a>, or email <a href='mailto:hello@safetyline.africa'>hello@safetyline.africa</a>.`;
    };

    // Offline scripted responder (also the graceful fallback when the live
    // agent is unreachable) — keeps the widget from ever dead-ending.
    const offlineReply = (text) => {
      const t2 = typing();
      setTimeout(() => {
        t2.remove();
        add(scripted(text), "bot", true);
      }, reducedMotion ? 50 : 700);
    };

    // SSE-over-fetch client. Reads response.body as a stream, parses SSE frames
    // (event:/data: lines, blank-line delimited) and renders each named event.
    // Returns true if a terminal event (assistant.completed | limit | error) was
    // rendered, so the caller knows the turn produced a real answer.
    // Hide code-y bits WHILE streaming so the visitor never sees a raw handoff
    // URL or [[actions:...]] marker mid-type — they resolve into a clean button
    // / text only at the end. Handles complete AND trailing-partial fragments.
    const cleanStreaming = (text) => text
      .replace(/\[\[[^\]]*\]\]/g, "")
      .replace(/\[\[[^\]]*$/g, "")
      .replace(/\bhttps?:\/\/wa\.me\/\S*/gi, "")
      .replace(/\bwa\.me\/\S*/gi, "")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n");

    const streamLive = async (res, typingEl) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let bubble = null;       // growing bot bubble (built on first delta / completed)
      let acc = "";            // full accumulated text to reveal
      let finalText = null;    // authoritative final text (from assistant.completed)
      let workingEl = null;
      let terminal = false, streamEnded = false, finalized = false, answered = false;

      // Typewriter reveal — a pleasant, slightly-slow ChatGPT/Claude-style type-out.
      let revealed = 0, rafId = 0, lastT = 0, resolveReveal;
      const revealDone = new Promise((r) => { resolveReveal = r; });
      const CPS = 58; // characters per second

      const clearTyping = () => { if (typingEl && typingEl.parentNode) typingEl.remove(); };
      const clearWorking = () => { if (workingEl) { workingEl.remove(); workingEl = null; } };
      const ensureBubble = () => {
        if (!bubble) { clearTyping(); bubble = add("", "bot"); } // add() uses textContent (I5)
        return bubble;
      };
      const finalize = () => {
        if (finalized) return;
        finalized = true;
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
        const text = (finalText != null && finalText) ? finalText : acc;
        if (bubble || text) {
          renderBotMessage(ensureBubble(), text);
          addSuggestions(text, parseMarkers(text));
          answered = true;
        }
        scheduleNudge();
        resolveReveal();
      };
      const tick = (t) => {
        if (reducedMotion) {
          revealed = acc.length;
        } else {
          if (!lastT) lastT = t;
          const dt = Math.min(90, t - lastT); lastT = t;
          const backlog = acc.length - revealed;
          // speed up when far behind so long replies never drag
          const rate = CPS * (backlog > 160 ? 2.4 : backlog > 70 ? 1.5 : 1);
          revealed = Math.min(acc.length, revealed + (rate * dt) / 1000);
        }
        if (bubble) {
          bubble.textContent = cleanStreaming(acc.slice(0, Math.floor(revealed)));
          msgs.scrollTop = msgs.scrollHeight;
        }
        if (revealed >= acc.length && (finalText != null || streamEnded)) { finalize(); return; }
        rafId = requestAnimationFrame(tick);
      };
      const startReveal = () => { if (!rafId && !finalized) { lastT = 0; rafId = requestAnimationFrame(tick); } };

      const handle = (name, dataStr) => {
        let data = {};
        try { data = dataStr ? JSON.parse(dataStr) : {}; } catch { data = {}; }
        switch (name) {
          case "session":
            break; // session id lives in the httpOnly sl_sid cookie — store nothing
          case "assistant.delta":
            clearWorking();
            if (typeof data.text === "string" && data.text) {
              acc += data.text;
              ensureBubble();  // the typewriter reveals cleaned text — never raw code
              startReveal();
            }
            break;
          case "tool.activity":
            // Render the backend's customer-safe phrase (M4). It guarantees
            // phrase-only text (no raw tool name), so this is safe as textContent.
            if (data.phase === "completed" || data.phase === "failed") {
              clearWorking();
            } else if (!bubble) {
              const label = (typeof data.text === "string" && data.text) ? data.text : "working…";
              if (workingEl) workingEl.textContent = label;
              else workingEl = addWorking(label);
            }
            break;
          case "assistant.completed":
            clearWorking();
            finalText = (typeof data.text === "string") ? data.text : "";
            if (finalText) acc = finalText;   // reveal the authoritative final text
            terminal = true;
            ensureBubble();
            startReveal();                    // animate even if it never streamed deltas
            break;
          case "limit":
            clearWorking();
            if (bubble && acc) finalize(); else if (!finalized) { finalized = true; resolveReveal(); }
            clearTyping();
            add(data.message || "You've reached the limit for this chat — let's continue on WhatsApp.", "bot");
            swapComposerToWhatsApp();
            terminal = true; answered = true;
            break;
          case "error":
            clearWorking();
            if (bubble && acc) finalize(); else if (!finalized) { finalized = true; resolveReveal(); }
            clearTyping();
            add(ERROR_HTML, "bot", true); // hardcoded, non-model copy — HTML is safe
            terminal = true; answered = true;
            break;
          case "done":
            clearWorking();
            streamEnded = true;
            if (!rafId && !finalized) startReveal();                 // let the reveal finalize
            if (!bubble && finalText == null) { finalized = true; resolveReveal(); } // nothing produced
            break;
        }
      };

      const flushFrame = (frame) => {
        let name = "message";
        const dataLines = [];
        frame.split("\n").forEach((line) => {
          if (line.startsWith(":")) return; // SSE comment / keep-alive
          if (line.startsWith("event:")) name = line.slice(6).trim();
          else if (line.startsWith("data:")) dataLines.push(line.slice(5).replace(/^ /, ""));
        });
        if (dataLines.length || name !== "message") handle(name, dataLines.join("\n"));
      };

      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          buffer = buffer.replace(/\r\n/g, "\n");
          let idx;
          while ((idx = buffer.indexOf("\n\n")) !== -1) {
            const frame = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);
            if (frame.trim()) flushFrame(frame);
          }
        }
        if (buffer.trim()) flushFrame(buffer);
      } catch {
        // mid-stream network drop (common on mobile): finalize whatever partial
        // answer was shown; if nothing rendered, surface the standard error line.
        // Either way the turn is "handled" — return true so the caller never
        // stacks a second fallback beneath a partial reply.
        clearTyping();
        if (bubble && acc) { finalize(); }
        else { clearWorking(); if (!finalized) { finalized = true; resolveReveal(); } add(ERROR_HTML, "bot", true); }
        return true;
      }
      streamEnded = true;
      startReveal();
      // wait for the type-out to catch up (safety cap so a stuck stream can't hang)
      await Promise.race([revealDone, new Promise((r) => setTimeout(r, 15000))]);
      if (!finalized) finalize();
      clearWorking(); clearTyping();
      // "produced an answer" = a bot bubble/text was finalized or a terminal
      // event fired. Otherwise (200 + only session/done) return false so the
      // caller fires the offline fallback instead of dead-ending silently.
      return answered || terminal || Boolean(bubble);
    };

    // Telegram-style header status: "{persona} is typing…" during a live turn.
    const setTyping = (on) => {
      if (!status) return;
      status.textContent = on
        ? `${persona} is typing…`
        : (live ? `Online — ${persona}` : `${persona} · Safetyline`);
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (composerSwapped) return;
      const text = (input.value || "").trim();
      if (!text) return;
      input.value = "";
      add(text, "user");
      exchanges += 1;
      clearNudge();

      if (live) {
        setTyping(true);
        const t = typing();
        try {
          const res = await fetch(cfg.endpoint, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: text,
              agent: agentKey || DEFAULT_AGENT,
              page: pageContext(),
              contact_time: honeypot ? honeypot.value : ""
            })
          });
          // 429 / non-200 / missing body → degrade to the offline scripted path
          if (!res.ok || !res.body) throw new Error("http " + res.status);
          // a stream that ends without ever producing an answer must still
          // fall back rather than leave the message unanswered
          const produced = await streamLive(res, t);
          if (!produced && !composerSwapped) {
            if (cfg.degradedCopy) add(cfg.degradedCopy, "bot");
            offlineReply(text);
          }
        } catch {
          if (t.parentNode) t.remove();
          if (!composerSwapped) {
            if (cfg.degradedCopy) add(cfg.degradedCopy, "bot");
            offlineReply(text);
          }
        } finally {
          setTyping(false);
        }
      } else {
        offlineReply(text);
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
    const sections = Array.from(document.querySelectorAll(".hero, main > .section, main > .statement-band"));
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
      if (e.target.closest(".bar-option, [data-bar-retake], .uc-tab, .fd-item")) queueFit(120);
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
