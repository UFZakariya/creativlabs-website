# Sardauna Site — Consolidated Build Brief

> Output of the grilling session (2026-07-25). This is the locked spec for rebuilding
> safetyline.com.ng as a Viktor-class product site for **Sardauna by Safetyline**.
> Design language inspired by viktor.com; **implementation, copy, and assets are original**
> (no cloned code, no transcribed copy, no lifted assets, licensed fonts only).

---

## 1. Positioning

- **Company:** Safetyline (site name and brand). Nigerian AI-integration company.
- **Product:** **Sardauna** — the agentic system (replaces "Safetyline Business Suite" as the
  public name). Sardauna is BOTH the product and the name of its chief-of-staff agent —
  the same product-is-the-agent naming model Viktor uses, with an original, culturally
  resonant name.
- **"House of Agents"** — Safetyline's brand phrase for agent orchestration (the architecture
  story: a chief of staff who runs department-head agents, who run specialist agents).
- **Wedge vs Viktor:** they are Slack/Teams-first for Western teams; we are **WhatsApp-first
  for African business reality**, with Facebook, Instagram, X, Teams, Slack presented as
  offered integrations (owner's decision: sell-then-build; delivery risk accepted by owner).
- Old "we build custom websites/apps" promise is **retired**. UFMS, TruckVille OS, ordering
  app, membership portal become **proof** ("built and run on our own agents"), not offerings.
  Custom work survives only as quiet secondary capability, not a promise.
- Requested line to place: *"Think, ideate, plan — while the agents do the dirty work."*
  (fits as hero subhead or the rotating-statement interstitial).

## 2. Naming register (use consistently everywhere)

| Thing | Name |
|---|---|
| Company / site | Safetyline |
| Product | Sardauna |
| Chief-of-staff agent | Sardauna (repo currently "Ada" — repo renames later; site leads) |
| Orchestration brand phrase | House of Agents |
| Department heads (from suite repo) | Kola (Ops) · Ngozi (Finance) · Tunde (Growth) · Amara (Delivery) · Zara (Comms) · Emeka (Analyst) |
| Website front-desk chat | Bari & Biba (unchanged, keeps running) |
| Domain | safetyline.com.ng (live site untouched until sign-off) |

## 3. Claims register (site is bound by "agents never lie")

**TRUE today (verified in suite repo — say it with confidence):**
- Chief-of-staff orchestration over department-head agents (depth-guarded delegation runtime)
- Agents managing agents (House of Agents); fixed roster + hire-your-own agent builder
- Tiered autonomy: internal actions auto-run; outbound/spend/admin require owner approval
- Agent quality lifecycle: versioned agents, **draft → evaluate → shadow → canary → live with
  rollback** + evals suite ("self-improving" is phrased through this real mechanism)
- Live-aware projects (agents read real repos/folders → honest status)
- 7-module dashboard (CoS chat, Operations, Finance, Marketing/CRM, Projects, Messages, Agents)
- WhatsApp + email wired into design; WhatsApp proven live (Bari/Biba + UFMS agents in production)
- Nigerian context built-in (CAMA/VAT/WHT compliance calendar, WHT-aware invoices)

**OFFERED (owner's sell-then-build decision — presented as available):**
- Facebook, Instagram, X, Teams, Slack channels; LinkedIn draft-assist

**DROPPED unless owner shows code:** "knowledge graphs" (no repo evidence; replaced by the
live-aware/business-context story). Owner may overrule at copy review.

**Demo honesty line:** WhatsApp demo mirrors real proven flows; Instagram demo is equal-polish
product vision with specifics kept generic (nothing checkably false).

## 4. Design language (from the 12-page teardown)

**Stack (mirrors Viktor AND the suite):** Next.js App Router (latest stable; Viktor runs 16) ·
React 19 · Tailwind CSS v4 (CSS-first config) · **framer-motion** (their entire animation
stack — confirmed; no GSAP) · Swiper for carousels · shadcn/ui conventions. Full Next
deployment (owner chose full architecture over static export): Docker + Caddy on the VPS
when we ship; local dev + secret-gated staging until then.

**Fonts — theirs are commercial (UlmGrotesk, Gellix — cannot use).** Ours: **Geist**
(display Bold w/ tight -0.04 to -0.06em tracking + body) via next/font — free, already the
suite's font, brand-consistent. Roboto Mono for ticker/label accents. Chat mockups use a
system stack for platform authenticity.

**Palette mapping (their roles → our brand; keep Safetyline logo + palette):**

| Role | Viktor | Sardauna site |
|---|---|---|
| Light canvas | beige #faf5f1 | soft azure-white #f6f8ff |
| Ink | #1a182b | #10142a |
| Dark-section base | indigo #150079 | deep navy (derive from #083cff family, ~#040b34) |
| Accent-1 | purple #6e47ff | Safetyline blue #083cff |
| Accent-2 warm glow | peach #ffbb98 | azure/cyan glow (the "azure dawn" gradient: cyan hotspot → azure → blue → deep navy) |
| Glass system | white/10 + blur 22px + gradient hairline ring | same technique, our tints |

**Signature patterns to rebuild (original implementations):** floating glass pill navbar
(3-col, dropdowns, scroll-solid, hamburger pill <xl) · dark rounded-bottom hero band ·
**scripted chat showcase player** (stagger-in messages, channel sidebar crossfade, segmented
skin toggle, invisible pre-measured duplicate to prevent layout jump, --showcase-scale unit
scaling on mobile) · rotating-statement interstitial (stacked variants, opacity+blur cycle,
ghost sizing) · glass proof-card grids w/ dark visual insets · tabbed comparison demo ·
3-step onboarding · control/safety band (maps to REAL tiered-autonomy feature) · logo drum
("slot-machine" lockstep loops) · FAQ split accordion · stat-sentence case-study billboards ·
multistep contact wizard · mega footer with giant wordmark. **Plus ours kept: the WebGL wave
shader + hover effect** (ported as a React component; still-frame on touch, as today).

## 5. Page map (all Viktor pages in scope — phased)

**Phase 1 (launch set):**
| Sardauna page | Modeled on | Notes |
|---|---|---|
| / (home) | viktor.com/ | hero showcase = WhatsApp workspace player; skin toggle WhatsApp ↔ Instagram |
| /product | /product | 3-step onboarding, capabilities grid, House-of-Agents org-chart section (our unique add — Viktor can't show this; we can) |
| /pricing | /pricing | credit/plan model TBD with owner; naira-first, free-trial hero |
| /use-cases | /use-case | tabbed starter demo: #Support · #Sales · #Ops · #Finance · #Growth threads; function spotlight rows with chat transcripts (customer orders → update → payment → owner analytics beat) |
| /channels | /integrations | WhatsApp takes Slack's structural role; directory of offered channels |
| /security | /security | tiered autonomy + approvals + audit trail = our REAL trust story |
| /customers | /case-study | stat billboards from real deployments: UFMS, TruckVille OS, ordering app, membership portal, Bari & Biba front desk |
| /customers/[slug] | /case-study/element-turf | 3-rail template w/ scroll-spy TOC; start with UFMS + TruckVille |
| /contact | /contact-sales | multistep wizard → posts to existing /web/lead backend |
| /about | /about | mission, real team/founder photo (owner to supply), values |

**Phase 2 (post-launch):** /enterprise, /docs, /changelog, /academy-style content, blog.
**Archived from old site:** hero/quiz/agents/process sections as-is (quiz may return inside
/use-cases later); 4 SEO landing pages get rewritten to Sardauna positioning (keep URLs, keep
sitemap juice — do NOT 404 them).

**Carried over untouched:** Bari & Biba dock (ported to a React island), /web/lead form
backend, /t funnel tracking, share-card + OG system, sitemap/robots (updated), redirects.

## 6. Hero + comparison copy (original, owner picks at review)

Owner asked for original alternatives in Viktor's voice (short contrast, period rhythm) —
NOT one-word swaps of their taglines:

**Hero H1 options:**
1. "One hire. A whole house of agents."
2. "Meet Sardauna. Your chief of staff — with staff of his own."
3. "Stop running your business. Start directing it."
4. "The workforce that lives in your WhatsApp."
5. "Your business, fully staffed. No new desks."

**Sub (uses owner's requested line):** "Think, ideate, plan — while the agents do the dirty
work. Sardauna is a house of agents: a chief of staff who runs departments of specialists
across operations, finance, growth and support — on the WhatsApp your business already uses."

**Comparison-band options (replaces "chatbot vs" line):**
1. "Chatbots end at the reply. Sardauna ends at done."
2. "A chatbot gives answers. Sardauna gives outcomes."
3. "Chatbots talk about work. Sardauna turns it in."

**Rotating interstitial:** "Sardauna is the house of agents that runs the work you…"
[can't get to today / keep postponing / shouldn't be doing yourself]

## 7. Execution plan

1. **Scaffold** `apps/site` Next app on branch `feat/sardauna-site` (this repo, GitHub attached);
   Tailwind v4 + framer-motion + next/font Geist; tokens file from §4.
2. **Design system primitives:** glass card/ring system, pill buttons, type scale, section
   bands, navbar, footer, logo drum, FAQ accordion.
3. **Homepage** end-to-end incl. WhatsApp showcase player + skin toggle + wave shader port.
4. Remaining Phase-1 pages.
5. **Copy pass** grounded in suite repo (claims register §3), owner reviews line-by-line.
6. **Staging:** preview.safetyline.com.ng (secret-gated, Docker+Caddy) → owner reviews on
   phone → iterate → explicit owner sign-off → deliberate cutover. **Live site untouched
   until then.** Old static site archived in-repo (tag + folder), not deleted.

## 8. Open items owner owes

- Pricing model + naira numbers for /pricing
- Team/founder photo for /about
- Verdicts on hero/comparison copy options (§6)
- (Optional) KG code pointer if "knowledge graphs" should return to claims
