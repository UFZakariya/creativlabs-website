# Creativ Labs Website v2

Ground-up rebuild of the Creativ Labs site. Single-page, zero build step, deploys anywhere static files are served (Netlify-ready, forms included).

## Highlights

- **Agentic positioning** — the differentiator (Digital Operations Systems + the AI agents that run them) leads the copy, with a dedicated `#agents` section featuring a WhatsApp-style conversation mock (preview → confirm flow, staggered reveal, typing indicator).
- **Liquid glass design system** — layered refraction (backdrop blur + saturation + SVG displacement where supported), rim light, and a travelling specular sheen. Applied to the nav bar, buttons, cards, tabs, chips, and the contact panel.
- **Interactive hero logo** — big, static (no spin/3D): it leans toward the cursor, a specular light sweeps across its silhouette (CSS mask on the logo alpha), the glow responds to proximity, and it pops on click/tap.
- **Same palette** as v1: cobalt `#083cff`, azure `#00b7ff`, cyan `#33f2ff` on white, with the signature animated wave ribbons fixed behind every section (never fading on scroll).
- Full copy deck implemented: positioning, what we build, hidden problem, solution pillars, product focus areas (UFMS, TruckVille, Creativ Listen), process, why-us, impact, CTA + contact.
- Scrollspy nav with a sliding glass indicator, reveal-on-scroll animation, animated product tab showcase, scroll progress hairline.
- **Signature pointer FX** (desktop fine-pointers, skipped under reduced motion): the wave ribbons bend and shimmer around the cursor and ripple on click (shader-level `u_mouse`/`u_energy`/`u_click` uniforms); glass cards tilt in 3D with a specular hotspot that tracks the pointer; buttons are gently magnetic; the hero plays a staggered blur-to-sharp entrance. A fine film grain sits over everything at 3.5%.
- Accessible: semantic sections, ARIA tabs, keyboard navigation, `prefers-reduced-motion` support, visible focus rings.

## Files

- `index.html` — the whole site (single page)
- `assets/styles.css` — design system + layout
- `assets/app.js` — interactions (logo pointer FX, scrollspy, tabs, form, interactive waves)
- `assets/logo-640.png` / `assets/logo-128.png` — optimized logo renditions
- `preview-server.mjs` — local preview server

## Local preview

```sh
node preview-server.mjs
# → http://127.0.0.1:8767/
```

## Deploy

Drop the folder into Netlify (or any static host). The contact form is wired for Netlify Forms (`data-netlify="true"`, form name `contact`); submissions appear in the Netlify dashboard under Forms. The local preview server fakes the POST so the success state can be tested offline.
