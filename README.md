# Safetyline Website v2

Ground-up rebuild of the Safetyline site. Single-page, zero build step, deploys anywhere static files are served (Netlify-ready, forms included).

## Highlights

- **Agent as a System positioning** — the differentiator (systems + the AI agents that run them) leads the copy, with a dedicated `#agents` section featuring the agent conversation on a **realistic iPhone with a WhatsApp interface** (status bar, Dynamic Island, bubbles with ticks, preview → confirm flow, one-shot playback).
- **Business Agentic Readiness™ test** (`#readiness`) — a 7-question weighted assessment right after the hero: progress bar, animated gauge (0–100), four tiers (Start With the Basics / Building the Foundation / Nearly Ready / Agent-Ready) each with tailored recommendations and a consultation CTA; the score feeds a hidden field in the Netlify consultation form and sessionStorage.
- **Hermes assistant dock** — floating chat bubble (bottom-right) with a glass panel, persona "Ada". Scripted answers + quick-action chips until the real agent is live; set `endpoint` in `assets/hermes-config.js` and it switches to the live streaming agent (POST `{message, page}` read as an SSE stream — full wire contract documented in that file), no other changes needed.
- **Use Cases device previews** (`#products`) — four real products (UFMS, TruckVille OS, the TruckVille ordering app, the Labour Party membership portal) rebuilt pixel-faithfully inside a laptop mockup that morphs into a phone for the mobile app; UFMS is browsable (Dashboard ↔ Records).
- **Consultation-led journey** — brand sits outside a content-fit glass nav pill (Readiness · Agents · What We Build · Use Cases · Process · Book a Consultation); every path (hero CTA, quiz result, dock, WhatsApp FAB) funnels to the consultation form.
- **Liquid glass design system** — every glass surface wears a masked 1.4px **gradient rim** (bright specular top edge → azure glow at the bottom, via `mask-composite: exclude`) instead of a flat border, over layered refraction (backdrop blur + saturation + SVG displacement where supported) and a travelling specular sheen. Nested glass-within-glass icon squares on cards. Applied to the nav bar, buttons, cards, tabs, chips, and the contact panel.
- **Interactive hero logo** — big, static (no spin/3D): it leans toward the cursor, a specular light sweeps across its silhouette (CSS mask on the logo alpha), the glow responds to proximity, and it pops on click/tap.
- **Same palette** as v1: cobalt `#083cff`, azure `#00b7ff`, cyan `#33f2ff` on white, with the signature animated wave ribbons fixed behind every section (never fading on scroll).
- Full copy deck implemented: positioning, what we build, hidden problem, solution pillars, product focus areas (UFMS, TruckVille, Safetyline Listen), process, why-us, impact, CTA + contact.
- Scrollspy nav with a sliding glass indicator, reveal-on-scroll animation, scroll progress hairline, and a fit engine that compresses each section (`.s-snug` → `.s-tight` → `.s-tighter`) so every section is one viewport tall at any screen size.
- **Signature pointer FX** (desktop fine-pointers, skipped under reduced motion): the wave ribbons bend and shimmer around the cursor and ripple on click (shader-level `u_mouse`/`u_energy`/`u_click` uniforms); glass cards tilt in 3D with a specular hotspot that tracks the pointer; buttons are gently magnetic; the hero plays a staggered blur-to-sharp entrance. A fine film grain sits over everything at 3.5%.
- Accessible: semantic sections, ARIA tabs, keyboard navigation, `prefers-reduced-motion` support, visible focus rings.

## Files

- `index.html` — the whole site (single page)
- `assets/styles.css` — design system + layout
- `assets/app.js` — interactions (logo pointer FX, scrollspy, tabs, quiz, dock, form, interactive waves, fit engine)
- `assets/hermes-config.js` — assistant dock configuration + wire contract
- `assets/logo-640.webp` — hero logo (LCP image); `assets/logo-640.png` — og:image/404 fallback; `assets/logo-128.png` — favicon/avatars
- `preview-server.mjs` — local preview server

## Local preview

```sh
node preview-server.mjs
# → http://127.0.0.1:8767/
```

## Deploy

Currently deployed via **GitHub Pages** from the `main` branch root (pushing to `main` redeploys automatically). The repo is also Netlify-ready: drop the folder into Netlify and the contact form wires up to Netlify Forms (`data-netlify="true"`, form name `contact`); submissions appear in the Netlify dashboard under Forms. Note the form backend requires Netlify — on GitHub Pages the form POST has no handler. The local preview server fakes the POST so the success state can be tested offline.
