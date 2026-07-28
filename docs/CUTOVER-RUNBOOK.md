# Cutover runbook — safetyline.com.ng → the Sardauna site

> Status: **prepared, NOT executed.** Every step below is reversible and the
> rollback is a single Caddy edit. Nothing here runs without the owner's word.
>
> Verified against the live box on 2026-07-27.

## What's true right now

| | |
|---|---|
| Live site | old static build, nginx container `safetyline-site`, web root `/opt/safetyline-site/site` |
| Caddy block | `/opt/ufms/infra/hostinger/Caddyfile` line ~204, `reverse_proxy safetyline-site:80` |
| New site (staging) | `sardauna-preview` (node:22-alpine) at `/opt/sardauna-preview`, no auth, `https://sardauna.187.77.174.115.sslip.io` |
| Proxy | shared `ufms-caddy-1` — also fronts UFMS, TruckVille, the desk gateway |

**Old indexed URLs (all 5 from the old sitemap) and where they land:**

| Old URL | New route | Handling |
|---|---|---|
| `/` | `/` | direct |
| `/farm-management-system-nigeria/` | same, no trailing slash | Next redirects `/path/` → `/path` automatically |
| `/food-business-operations-nigeria/` | same | ditto |
| `/ai-agent-for-business-nigeria/` | same | ditto |
| `/membership-management-nigeria/` | same | ditto |

No redirect map is needed — the new site kept every indexed URL. The only
orphan surface is `/assets/*` (old CSS/JS/images); nothing external should
deep-link those, but the fallback below keeps them alive if you want belt-and-braces.

## Step 1 — build for production (tracking ON)

Staging builds bake in `NEXT_PUBLIC_DISABLE_TRACK=1`. Production must **not**:

```bash
cd apps/site && npm run build
```

(no env var — that's the whole difference). Then assemble and package:

```bash
cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/ && tar czf sardauna-site.tar.gz -C .next/standalone .
```

## Step 2 — stand up a SEPARATE production container

Do **not** repoint the domain at `sardauna-preview` — staging must stay
independent so future work has somewhere to land.

```bash
scp -i ~/.ssh/ufms_hostinger_ed25519 sardauna-site.tar.gz root@187.77.174.115:/opt/sardauna-site/
```

On the box: `/opt/sardauna-site/docker-compose.yml` — same shape as the preview,
container name `sardauna-site`, `NODE_ENV=production`, port 3000, `restart: unless-stopped`.
Bring it up and confirm it answers **before** touching Caddy:

```bash
docker compose up -d && docker exec sardauna-site wget -qO- http://127.0.0.1:3000/ | head -c 80
```

## Step 3 — join it to the proxy network

```bash
docker network connect sardauna-site_default ufms-caddy-1
```

Persist it in `/opt/ufms/docker-compose.yml` (external network on the caddy
service) so a future Caddy **recreate** doesn't orphan the site.

## Step 4 — the switch (one line)

In `/opt/ufms/infra/hostinger/Caddyfile`, inside the `safetyline.com.ng` block:

- `reverse_proxy safetyline-site:80` → `reverse_proxy sardauna-site:3000`
- update the immutable-cache matcher: `path /assets/*` → `path /_next/static/*`
  (Next fingerprints its assets there; the old `/assets` path no longer exists)
- optional belt-and-braces: `handle_path /assets/* { root * /opt/safetyline-site/site; file_server }`
  keeps old asset URLs alive.

Back the file up first (`cp Caddyfile Caddyfile.bak-cutover`), then:

```bash
docker exec -w /etc/caddy ufms-caddy-1 caddy validate --config /etc/caddy/Caddyfile && docker restart ufms-caddy-1
```

⚠️ **`caddy reload` does not apply changes on this box** — it exits 0 and does
nothing. Only `docker restart ufms-caddy-1` takes effect (~3s blip across all
sites; a restart preserves network attachments, a *recreate* would not).

## Step 5 — verify before declaring done

```bash
for p in / /product /use-cases /pricing /customers /security /channels /about /contact \
         /farm-management-system-nigeria /membership-management-nigeria /sitemap.xml /robots.txt; do
  printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' https://safetyline.com.ng$p)" "$p"
done
```

Then confirm, in order:

1. **Neighbours unharmed** — UFMS, TruckVille, `dashboard.…sslip.io` (should still 401), `chat.safetyline.com.ng`.
2. **Share card** — `https://safetyline.com.ng/share-card.png` returns 200 (it 404s today; the canonical URL has always pointed forward to this moment).
3. **Analytics live** — a page view reaches `/t`; the dock still answers.
4. **The contact wizard** — submit one real enquiry and confirm it lands in the lead pipeline and the morning digest.
5. **Old trailing-slash URLs** — `/farm-management-system-nigeria/` 308s to the clean path.

## Rollback (under a minute)

Restore the one line and restart:

```bash
cp /opt/ufms/infra/hostinger/Caddyfile.bak-cutover /opt/ufms/infra/hostinger/Caddyfile
docker restart ufms-caddy-1
```

The old nginx container is never stopped during cutover, so rollback is instant.
Leave `safetyline-site` running for at least a week before retiring it.

## Before you run any of this

- [ ] Naira price bands published, or the "priced on the intro call" line accepted as launch copy
- [ ] Team photos + bios, or the placeholder cards accepted
- [ ] Case-study figures, or the non-numeric billboards accepted
- [ ] Owner has walked the staging site on a phone
- [ ] Someone is free for the next hour in case of rollback
