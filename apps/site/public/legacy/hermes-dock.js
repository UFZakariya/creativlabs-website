/* Legacy Safetyline dock module — extracted verbatim from the LIVE site's app.js (section 11); outer-scope dep shimmed */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  (() => {
    const dock = document.getElementById("hermes-dock");
    const btn = document.getElementById("dock-btn");
    const panel = document.getElementById("dock-panel");
    const msgs = document.getElementById("dock-msgs");
    const form = document.getElementById("dock-form");
    const input = document.getElementById("dock-input");
    const status = document.getElementById("dock-status");
    if (!dock || !btn || !panel || !msgs || !form) return;

    /* ---------- launcher motion (roll-out / roll-home + attention bounce) ----
       Motion ported from the chat-dock animation handoff, on our own glass and
       palette. Our dock is a separate launcher + panel rather than the
       reference's single morphing object, so the roll runs the launcher across
       the panel's foot while the panel reveals as a compact card and then grows
       up into the full dock. Close is the exact reverse.

       A monotonically increasing token guards every await, so a stale sequence
       can never keep running after a reset and leave the panel half-grown. */
    const ROLL = 620;      /* logo roll-out + compact-card reveal            */
    const GROW = 420;      /* card grows up into the dock                    */
    const HOME = 380;      /* logo rolls back to its corner                  */
    const FOLD = 340;      /* dock folds back down to the compact card       */
    let seq = 0;
    let anims = [];
    const alive = (run) => run === seq;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const stopAnims = () => { anims.forEach((a) => { try { a.cancel(); } catch {} }); anims = []; };
    const play = (el, frames, ms, ease) => {
      const a = el.animate(frames, { duration: ms, easing: ease || "linear", fill: "forwards" });
      anims.push(a);
      return a.finished.catch(() => {});
    };
    /* how far the launcher travels: the panel's width less the launcher, so it
       stops at the far edge of the card and rolls home along the same line */
    const travel = (shellW) => {
      const b = btn.getBoundingClientRect().width || 58;
      return Math.max(0, Math.round((shellW || 320) - b));
    };
    const resetLauncher = () => {
      stopAnims();
      btn.style.transform = "";
      dock.style.width = "";
      dock.style.height = "";
      panel.classList.remove("is-morph", "is-content");
      dock.classList.remove("is-animating", "is-shell-open");
    };
    /* the shell's open size, measured from CSS rather than hard-coded */
    const shellSize = () => {
      dock.classList.add("is-shell-open");
      const r = dock.getBoundingClientRect();
      const size = { w: Math.round(r.width), h: Math.round(r.height) };
      dock.classList.remove("is-shell-open");
      return size;
    };
    /* one descending three-bounce on the whole launcher — glass, logo and the
       unread dot travel together (the dot is a child, so it rides along) */
    const attention = () => {
      if (reducedMotion || open || dock.classList.contains("is-animating")) return;
      btn.animate(
        [
          { transform: "translateY(0) scale(1, 1)" },
          { transform: "translateY(-26px) scale(0.94, 1.07)", offset: 0.22 },
          { transform: "translateY(0) scale(1.06, 0.94)", offset: 0.44 },
          { transform: "translateY(-12px) scale(0.97, 1.03)", offset: 0.66 },
          { transform: "translateY(0) scale(1.03, 0.97)", offset: 0.85 },
          { transform: "translateY(0) scale(1, 1)" },
        ],
        { duration: 1200, easing: "ease-out" }
      );
    };

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
    // Durable lead intake (same backend) — the lead card posts here FIRST so a
    // captured lead survives even if the conversational turn fails.
    const leadUrl = live ? cfg.endpoint.replace(/\/chat\/?$/, "/lead") : "";
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
    // Shared with the page modules (contact form, quiz) so the whole funnel
    // reports into one place. Defined here because only the dock knows the
    // ingest URL.
    try { window.SL_TRACK = track; } catch (_) {}
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
      // skip during restore, and during the in-chat quiz (its Q/A/result render
      // as rich cards that don't round-trip cleanly — persisting only the bare
      // answers would restore an incoherent history).
      if (restoring || quizActive || !text) return;
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
      const forRecord = text; // keep the wa link so a restored message rebuilds the button
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
      record("bot", forRecord, time); // persist WITH the wa link so restore rebuilds the button
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
      // SITE PATCH (2026-07-28): slow first turns feel like a hang — after 8s
      // of dots, reassure the visitor; cleared automatically when the reply
      // lands (clearTyping removes the element, so the check is parentNode).
      setTimeout(() => {
        if (!el.parentNode) return;
        const note = document.createElement("div");
        note.className = "dock-msg dock-msg--bot";
        note.style.opacity = "0.75";
        note.textContent = "Still with you — one moment…";
        el.parentNode.insertBefore(note, el);
        msgs.scrollTop = msgs.scrollHeight;
        const tidy = setInterval(() => {
          if (!el.parentNode) { note.remove(); clearInterval(tidy); }
        }, 500);
      }, 8000);
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
    const ERROR_HTML = "I'm having trouble reaching the agent right now. You can always <a href='https://wa.me/2348102354786' target='_blank' rel='noopener'>message us on WhatsApp</a> or <a href='#contact'>book a consultation</a>.";

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
    // Auto-start with the default persona — a decision screen ("who would you
    // like to chat with?") about two names a first-time visitor has never met
    // costs a full step before any value. Instead the greeting lands instantly
    // and a one-line divider offers the handover to the other persona (the
    // existing seamless-switch mechanism).
    const offerSwitchLine = () => {
      if (PERSONAS.length < 2) return;
      const other = PERSONAS.find((x) => x.key !== agentKey);
      if (!other) return;
      const div = document.createElement("div");
      div.className = "dock-divider";
      div.appendChild(document.createTextNode(`You're with ${persona} · `));
      const sw = document.createElement("button");
      sw.type = "button";
      sw.className = "dock-divider-link";
      sw.textContent = `prefer ${other.tagline ? other.tagline.toLowerCase() : "the other style"}? Chat with ${other.name} ⇄`;
      sw.addEventListener("click", () => { div.remove(); switchBtn && switchBtn.click(); });
      div.appendChild(sw);
      msgs.appendChild(div);
    };

    const chooseAgent = (key, opts) => {
      const p = agentOf(key);
      agentKey = p.key;
      persona = p.name;
      if (nameEl) nameEl.textContent = p.name;
      if (status) status.textContent = live ? `Online — ${p.name}` : `${p.name} · Safetyline`;
      dock.dataset.agent = p.key; // avatar/theme hook
      if (switchBtn) switchBtn.hidden = PERSONAS.length < 2;
      try { sessionStorage.setItem("sl-agent", p.key); } catch {}
      form.hidden = false;
      add(contextualGreeting(), "bot");
      if (opts && opts.offerSwitch) offerSwitchLine();
      addStarters();
      showTools();
      scheduleFirstNudge();
      if (finePointer) setTimeout(() => input && input.focus(), 60);
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
        quizActive = false; leadCardOpen = false; // handover resets transient flows
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
      track("quiz_complete", { score: String(score), tier: tier.name, target: "dock" });

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
      // Tight patterns — only fire on a genuine signal so chips never feel spammy.
      const t = (text || "").toLowerCase();
      const keys = [];
      if (/\breadiness\b|readiness (test|check)|where you stand|how ready is your|60[ -]second/.test(t)) keys.push("readiness");
      if (/\bbook a\b|consultation|discovery call|schedule a call|hop on a call|free call|leave your details/.test(t)) keys.push("book");
      if (/\buse cases?\b|we (built|'ve built|have built)|our portfolio|\bproof\b|\bufms\b|truckville|labour party|systems we've built/.test(t)) keys.push("usecases");
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

    // Zero-message nudge — the biggest chat drop-off is "opened, read the
    // greeting, stalled". One soft re-offer of the starters, once per session.
    let firstNudged = false, firstNudgeTimer = null;
    const clearFirstNudge = () => { if (firstNudgeTimer) { clearTimeout(firstNudgeTimer); firstNudgeTimer = null; } };
    const scheduleFirstNudge = () => {
      if (firstNudged) return;
      clearFirstNudge();
      firstNudgeTimer = setTimeout(() => {
        if (firstNudged || !open || exchanges > 0 || leadCardOpen || quizActive || composerSwapped) return;
        firstNudged = true;
        add("No pressure — most people start with the 60-second readiness check, or just tell me what your business does.", "bot");
        addStarters();
      }, 40000);
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
      quizActive = false; // opening the form abandons any in-chat quiz
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
      submit.addEventListener("click", async () => {
        const name = nameI.value.trim(), phone = phoneI.value.trim(), want = wantI.value.trim();
        if (!name || !phone) { box.classList.add("is-error"); (name ? phoneI : nameI).focus(); return; }
        box.querySelectorAll("input,button").forEach((x) => { x.disabled = true; });
        leadCardOpen = false;
        track("lead_submit", {});
        // Durable capture FIRST (deterministic lead store + team alert); the
        // confirmation is only shown once it actually lands — no false "Sent".
        let saved = false;
        if (leadUrl) {
          try {
            const res = await fetch(leadUrl, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, phone, need: want })
            });
            saved = res.ok;
          } catch (_) { /* fall through to the WhatsApp fallback */ }
        }
        const done = document.createElement("p"); done.className = "dock-leadform-done";
        if (saved) {
          done.textContent = "✓ Sent — the team will reach out. Thank you!";
          box.appendChild(done);
          // Conversational context for the agent (best-effort; lead is safe).
          sendText(`Please have the team follow up with me. Name: ${name}. WhatsApp: ${phone}.${want ? " I'd like to build: " + want + "." : ""}`);
        } else {
          done.textContent = "Couldn't send just now — tap below and your details are ready to go:";
          box.appendChild(done);
          const wa = document.createElement("a");
          wa.className = "dock-action dock-action--wa";
          wa.href = "https://wa.me/" + (cfg.waNumber || "2348102354786") + "?text=" +
            encodeURIComponent(`Hi Safetyline! Please follow up with me. Name: ${name}. WhatsApp: ${phone}.${want ? " I'd like to build: " + want + "." : ""}`);
          wa.target = "_blank"; wa.rel = "noopener";
          wa.textContent = "Send on WhatsApp";
          box.appendChild(wa);
        }
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
        rollOpen();
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
            else chooseAgent(DEFAULT_AGENT, { offerSwitch: true });
          }
        }
        track("dock_opened", {});
        if (finePointer) setTimeout(() => input?.focus(), 250);
      } else {
        quizActive = false;   // don't leave the Readiness tool latched off
        clearNudge();
        clearFirstNudge();
        rollClose();
      }
    };

    /* opening: launcher rolls out along the panel foot while the panel reveals
       as a compact card; only once it lands does the card grow up into the full
       dock, and only then does any content appear. */
    async function rollOpen() {
      resetLauncher();
      const { w, h } = shellSize();
      if (reducedMotion) {                          // immediate open
        dock.classList.add("is-shell-open");
        panel.classList.add("is-morph", "is-content");
        return;
      }
      const run = ++seq;
      const x = travel(w);
      dock.classList.add("is-animating");
      panel.classList.add("is-morph");              // content stays hidden
      dock.style.width = "58px";
      dock.style.height = "58px";
      /* the shell widens into a compact card while the logo rolls out across it */
      await Promise.all([
        play(dock, [{ width: "58px" }, { width: w + "px" }], ROLL),
        play(btn, [{ transform: "translate(0,0) rotate(0deg)" },
                   { transform: `translate(${-x}px,0) rotate(-450deg)` }], ROLL),
      ]);
      if (!alive(run)) return;
      /* then it grows up into the dock while the logo rolls home to the corner */
      await Promise.all([
        play(dock, [{ height: "58px" }, { height: h + "px" }], GROW, "cubic-bezier(.16,.82,.22,1)"),
        play(btn, [{ transform: `translate(${-x}px,0) rotate(-450deg)` },
                   { transform: "translate(0,0) rotate(0deg)" }], HOME),
      ]);
      if (!alive(run)) return;
      stopAnims();
      dock.style.width = "";
      dock.style.height = "";
      dock.classList.add("is-shell-open");
      btn.style.transform = "";
      panel.classList.add("is-content");            // content only at full size
      dock.classList.remove("is-animating");
    }

    /* closing is the exact reverse: content out, fold down while the launcher
       rolls out, then the card retracts as the launcher rolls home. */
    async function rollClose() {
      const r = dock.getBoundingClientRect();
      const w = Math.round(r.width), h = Math.round(r.height);
      if (reducedMotion) {
        panel.classList.remove("open");
        resetLauncher();
        setTimeout(() => { panel.hidden = true; }, 200);
        return;
      }
      const run = ++seq;
      const x = travel(w);
      stopAnims();
      dock.classList.add("is-animating");
      dock.classList.remove("is-shell-open");       // drive the size ourselves
      dock.style.width = w + "px";
      dock.style.height = h + "px";
      panel.classList.add("is-morph");
      panel.classList.remove("is-content");         // 1. content out first
      await wait(200);
      if (!alive(run)) return;
      await Promise.all([                           // 2. fold down + roll out
        play(dock, [{ height: h + "px" }, { height: "58px" }], FOLD, "cubic-bezier(.16,.82,.22,1)"),
        play(btn, [{ transform: "translate(0,0) rotate(0deg)" },
                   { transform: `translate(${-x}px,0) rotate(-450deg)` }], HOME),
      ]);
      if (!alive(run)) return;
      await Promise.all([                           // 3. retract + roll home
        play(dock, [{ width: w + "px" }, { width: "58px" }], ROLL),
        play(btn, [{ transform: `translate(${-x}px,0) rotate(-450deg)` },
                   { transform: "translate(0,0) rotate(0deg)" }], ROLL),
      ]);
      if (!alive(run)) return;
      panel.classList.remove("open");
      panel.hidden = true;
      resetLauncher();
    }

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
      /* a message arriving while the dock is shut is the unread moment — one
         descending bounce on the launcher, never a continuous loop */
      attention();
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
      return `${cfg.offlineNote || "Here's where to go:"} <a href='#readiness'>take the 60-second readiness test</a>, <a href='#contact'>book a free consultation</a>, or <a href='https://wa.me/2348102354786' target='_blank' rel='noopener'>message us on WhatsApp</a>.`;
    };

    // Offline scripted responder (also the graceful fallback when the live
    // agent is unreachable) — keeps the widget from ever dead-ending.
    const offlineReply = (text) => {
      const t2 = typing();
      setTimeout(() => {
        t2.remove();
        add(scripted(text), "bot", true);
        scheduleNudge(); // degraded conversations still get the soft close
      }, reducedMotion ? 50 : 700);
    };

    // Degraded-mode honesty: apologise ONCE per outage (not on every failed
    // turn) and stop claiming "Online" while unreachable; recover on success.
    let degradedShown = false;
    const showDegraded = () => {
      if (!degradedShown && cfg.degradedCopy) { add(cfg.degradedCopy, "bot"); degradedShown = true; }
      if (status) status.textContent = `${persona} · offline — WhatsApp is fastest`;
    };
    const clearDegraded = () => {
      if (!degradedShown) return;
      degradedShown = false;
      if (status) status.textContent = live ? `Online — ${persona}` : `${persona} · Safetyline`;
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
          // Announce the COMPLETED reply once to screen readers. The streaming
          // bubble is no longer a live region (it rewrote textContent ~58×/s,
          // which queued dozens of re-announcements per message); a dedicated
          // hidden live region gets the final text a single time.
          try {
            const liveEl = document.getElementById("dock-live");
            if (liveEl) liveEl.textContent = cleanStreaming(text);
          } catch (_) {}
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

    let sending = false; // one live turn at a time — no concurrent streams
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (composerSwapped || sending) return;
      const text = (input.value || "").trim();
      if (!text) return;
      input.value = "";
      quizActive = false; // sending a message cleanly abandons any in-chat quiz
      add(text, "user");
      exchanges += 1;
      clearNudge();

      if (live) {
        sending = true;
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
          if (produced) clearDegraded();
          if (!produced && !composerSwapped) {
            showDegraded();
            offlineReply(text);
          }
        } catch {
          if (t.parentNode) t.remove();
          if (!composerSwapped) {
            showDegraded();
            offlineReply(text);
          }
        } finally {
          setTyping(false);
          sending = false;
        }
      } else {
        offlineReply(text);
      }
    });

    // Page-level hook: lets the on-page readiness quiz (an earlier module)
    // hand its completers into the chat — the greeting is already score-aware
    // via window.SL_BAR.
    try { window.SL_DOCK = { open: () => setOpen(true), isOpen: () => open }; } catch (_) {}
  })();
