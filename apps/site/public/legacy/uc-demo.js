/* Legacy Use Cases device previews — modules 6b + 6d extracted VERBATIM from
   the OLD static site's assets/app.js. Outer-scope dep (reducedMotion) shimmed
   at the top, everything wrapped in one IIFE so nothing leaks to the global
   script scope (hermes-dock.js already declares a top-level reducedMotion).
   Loaded by components/UcShowcase.tsx AFTER the shell markup is injected. */
(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    const laptopHint = stage.querySelector('[data-uc-hint="laptop"]');
    const phoneHint = stage.querySelector('[data-uc-hint="phone"]');
    const NATIVE = { laptop: 1280, phone: 390 };
    const CAPTIONS = {
      ufms: "UFMS — running daily at Universal Farms, our founder’s own poultry operation.",
      os: "TruckVille OS — the operations backbone for a real Abuja food-court destination.",
      order: "TruckVille ordering — customers order from their phone; vendors see it instantly.",
      labour: "Membership portal — a national organisation’s member registration and records, down to the ward.",
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
      updateHint(laptopVp, laptopHint);
      updateHint(phoneVp, phoneHint);
    };

    // The device screens hide their scrollbar to look like real hardware, so
    // when the (real, working) content runs taller than the screen, nothing
    // tells a visitor there's more below — it just reads as cut off. Fade the
    // bottom edge + a bouncing chevron whenever there's unseen content, and
    // hide it again once they've scrolled to the end (or there's nothing to
    // scroll at all — e.g. this app fits the screen, or reduced-height stage).
    const updateHint = (vp, hint) => {
      if (!vp || !hint) return;
      const hasMore = vp.scrollHeight - vp.clientHeight > 4 &&
        vp.scrollTop < vp.scrollHeight - vp.clientHeight - 4;
      hint.classList.toggle("is-visible", hasMore);
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
      // Both laptop apps (UFMS / TruckVille OS / Member Portal) share ONE
      // scrolling viewport — without this, switching tabs after scrolling
      // down in one app opened the next one already scrolled partway (or
      // past its own content), looking blank/broken instead of starting
      // fresh at the top.
      const activeVp = tab.dataset.device === "phone" ? phoneVp : laptopVp;
      if (activeVp) activeVp.scrollTop = 0;
      // keep the tapped/keyboard-focused tab visible in the horizontally
      // scrollable mobile tab strip (no-op when it isn't scrollable)
      if (tabsWrap.scrollWidth > tabsWrap.clientWidth) {
        tab.scrollIntoView({ inline: "nearest", block: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
      }
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
    // live-update the scroll hint as the visitor scrolls each device screen
    laptopVp && laptopVp.addEventListener("scroll", () => updateHint(laptopVp, laptopHint), { passive: true });
    phoneVp && phoneVp.addEventListener("scroll", () => updateHint(phoneVp, phoneHint), { passive: true });
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
        if (!vp) return;
        vp.scrollTop = 0;
        // Dashboard ↔ Records differ in height — refresh the "more below"
        // hint for this new page too (module 6b owns the same check for
        // top-level tab switches; this internal nav has its own scroll
        // reset and needs the same follow-up).
        const hint = vp.parentElement && vp.parentElement.querySelector(".uc-scroll-hint");
        if (hint) {
          requestAnimationFrame(() => {
            const hasMore = vp.scrollHeight - vp.clientHeight > 4;
            hint.classList.toggle("is-visible", hasMore);
          });
        }
      });
    });
    // ?ufms=<page> forces a UFMS in-app page on load — QA/screenshot hook
    const qaUfms = new URLSearchParams(location.search).get("ufms");
    if (qaUfms) { const t = navs.find((n) => n.dataset.ufmsGoto === qaUfms); if (t) t.click(); }
  })();
  /* ============================================================
     6e. Parallel in-app navigation for the other previews — the
         same data-*-goto contract module 6d gives UFMS, one wiring
         per namespace:
           data-tvos-goto → [data-tvos-page]  TruckVille OS pages (?tvos=)
           data-tvcl-goto → [data-tvcl-page]  TVOS closeout steps  (?tvcl=)
           data-lp-goto   → [data-lp-page]    Member portal pages  (?lp=)
           data-lpp-goto  → [data-lpp-panel|page] member panels    (?lpp=)
         Only elements marked data-goto-nav carry active state
         (is-active/is-on) — plain action buttons ("Open closeout",
         "Next: confirm money") just navigate. Optional
         data-goto-title on a nav swaps the app masthead title.
     ============================================================ */
  (() => {
    const qs = new URLSearchParams(location.search);
    const wire = (key, opts) => {
      const navs = Array.from(document.querySelectorAll("[data-" + key + "-goto]"));
      if (!navs.length) return;
      const pageAttr = "data-" + key + "-page";
      const go = (target) => {
        const pages = Array.from(document.querySelectorAll("[" + pageAttr + "]"));
        if (!pages.some((p) => p.getAttribute(pageAttr) === target)) return;
        pages.forEach((p) => p.classList.toggle("is-active", p.getAttribute(pageAttr) === target));
        navs.forEach((n) => {
          if (!n.hasAttribute("data-goto-nav")) return;
          const on = n.getAttribute("data-" + key + "-goto") === target;
          // sidebar items style with is-active, top-nav links with is-on —
          // toggling both keeps one handler for every skin
          n.classList.toggle("is-active", on);
          n.classList.toggle("is-on", on);
        });
        if (opts && opts.title) {
          const t = document.querySelector(opts.title);
          const src = navs.find((n) => n.getAttribute("data-" + key + "-goto") === target && n.dataset.gotoTitle);
          if (t && src) t.textContent = src.dataset.gotoTitle;
        }
        // page heights differ — restart at the top and refresh the
        // "more below" hint, exactly like 6d does for UFMS
        const vp = pages[0] && pages[0].closest(".uc-viewport");
        if (!vp) return;
        vp.scrollTop = 0;
        const hint = vp.parentElement && vp.parentElement.querySelector(".uc-scroll-hint");
        if (hint) {
          requestAnimationFrame(() => {
            hint.classList.toggle("is-visible", vp.scrollHeight - vp.clientHeight > 4);
          });
        }
      };
      navs.forEach((n) => n.addEventListener("click", () => go(n.getAttribute("data-" + key + "-goto"))));
      const qa = qs.get(key); // ?<key>=<page> — QA/screenshot hook
      if (qa) go(qa);
    };
    wire("tvos", { title: ".tvos-top .mock-h1" }); // Dashboard ↔ Closeout
    wire("tvcl");                                  // closeout stepper: review/money/close
    wire("lp");                                    // portal: member ↔ register
    wire("lpp");                                   // member panels: dashboard/profile/card/update
  })();
  /* ============================================================
     6f. Live tickers — subtle proof-of-life: values marked
         data-tick-key creep upward on an interval (eggs collected,
         orders recorded). Elements sharing a key stay in sync (the
         dashboard KPI and the closeout figure show the same count).
         Step/interval read from the first element of each group.
     ============================================================ */
  (() => {
    const els = Array.from(document.querySelectorAll("[data-tick-key]"));
    if (!els.length) return;
    const groups = new Map();
    els.forEach((el) => {
      const k = el.dataset.tickKey;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(el);
    });
    groups.forEach((list) => {
      const lead = list[0];
      const step = Math.max(1, parseInt(lead.dataset.tickStep || "1", 10));
      const every = Math.max(1500, parseInt(lead.dataset.tickEvery || "6000", 10));
      let val = parseInt((lead.textContent || "").replace(/[^0-9]/g, ""), 10);
      if (!isFinite(val)) return;
      setInterval(() => {
        if (document.hidden) return; // no pointless churn in background tabs
        val += Math.max(1, Math.round(step * (0.5 + Math.random())));
        const txt = val.toLocaleString("en-US");
        list.forEach((el) => { el.textContent = txt; });
      }, every);
    });
  })();
})();
