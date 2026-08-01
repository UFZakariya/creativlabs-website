# Sardauna launch kit

Everything here is ready to copy-paste. Three owner actions are marked ⚠ —
they need your accounts, not mine.

---

## 1 ⚠ Google Search Console (10 minutes, biggest single lever)

1. Go to https://search.google.com/search-console and sign in with your Google
   account.
2. Add property → **Domain** → `safetyline.com.ng`.
3. It will ask for a DNS TXT record. Add it in **Cloudflare** (not Hostinger —
   Cloudflare owns the DNS now): dashboard → safetyline.com.ng → DNS →
   Add record → TXT, name `@`, paste the value. Verification usually passes in
   minutes.
4. In Search Console: Sitemaps → submit `https://safetyline.com.ng/sitemap.xml`.
5. Optional but useful: URL Inspection → paste `https://safetyline.com.ng/` →
   Request indexing. Repeat for `/pricing`.

## 2 ⚠ Cloudflare: allow AI crawlers (your decision, one toggle)

Dashboard → safetyline.com.ng → **Security → Bots** → turn OFF the
"Block AI bots" / managed robots.txt option. After you toggle it, tell me and
I'll verify the app's own robots.txt is being served.

## 3 ⚠ WhatsApp Status / Broadcast (your voice, your number)

> We just launched something we've been building for a long time.
>
> **Sardauna** — an AI business assistant that runs a whole staff for your
> business on WhatsApp. It answers your customers 24/7, chases your money,
> keeps your books, and sends you one daily brief of everything that happened.
>
> It starts **free**: a clean business website, a WhatsApp door for your
> customers, and an audit of what an AI employee would take off your plate.
> No monthly fee on the free tier — we only earn a small cut of sales made
> through the platform we run for you.
>
> Paid tiers from ₦19,999/month when you're ready.
>
> See it working (the chat on the site is Sardauna itself):
> 👉 https://safetyline.com.ng
>
> Reply here or tap the chat on the site — I read every message.

## 4 LinkedIn post

> Most Nigerian business owners run two businesses: the one they dreamed of,
> and the one that eats their day.
>
> Today we launched **Sardauna** — an AI business assistant that takes the
> second job. A chief-of-staff agent runs departments of specialist AI staff
> for your business: customer chat answered 24/7 on WhatsApp, invoices
> chased, stock and orders tracked, books kept current, and one daily brief
> that tells you the whole story. Anything outbound waits for your approval,
> and every action is audit-logged.
>
> We built it on real operations first — a working poultry farm, a food
> court's daily closeouts, a national membership register — before selling a
> single seat. The front desk on our own site is Sardauna, answering right
> now.
>
> It starts free, and paid tiers are published openly from ₦19,999/month —
> no "book a demo to see the price."
>
> https://safetyline.com.ng

## 5 X / Twitter post

> Your business, answered 24/7 on WhatsApp. Invoices chased. Books kept.
> One daily brief.
>
> Sardauna — an AI staff for Nigerian businesses, built on real operations
> before we sold a seat. Starts free, paid from ₦19,999/mo, prices public.
>
> The chat on the site IS the product → https://safetyline.com.ng

## 6 Instagram caption

> Meet Sardauna 🇳🇬 — the AI business assistant that runs a whole staff for
> your business on the WhatsApp you already use.
>
> ✅ Customers answered 24/7
> ✅ Invoices chased politely and persistently
> ✅ Orders, stock and books kept current
> ✅ One daily brief — the whole business in one message
> ✅ You approve anything that leaves the house
>
> Starts FREE (yes, actually free — no card). Paid tiers from ₦19,999/month,
> prices published on the site.
>
> Link in bio → safetyline.com.ng · Tap the chat when you land — that's
> Sardauna talking.

## 7 Who to tell first (highest-yield, lowest effort)

- Your existing WhatsApp contacts who run businesses — the Status post above,
  then personal follow-ups to the ten most likely buyers.
- The TruckVille and Universal Farms networks — they are your proof, and their
  operators know other operators.
- Nigerian SMB / startup WhatsApp and Telegram groups you're already in — the
  Status text works nearly verbatim; lead with the free tier, not the tech.
- Local business associations (chambers, market unions, estate business
  forums) — the "free website + WhatsApp door" tier is the opener there.

## Already done (no action needed)

- Sitemap live at /sitemap.xml, all 17 routes 200, canonicals set.
- Offer schema on /pricing (Google can show the prices in results).
- The four industry landing pages are linked from every footer.
- Old GitHub Pages copy of the v1 site is offline.
- Terms and privacy pages live, agents aligned with both.
