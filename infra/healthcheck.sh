#!/bin/bash
# Uptime watchdog for the Sardauna site (safetyline.com.ng), cron */5.
# Mirrors /opt/safetyline-desk/uptime-check.sh: sustained failure -> owner
# WhatsApp alert via the Cloud Graph API (hourly cooldown) + recovery notice.
# Adds self-heal: restarts the sardauna-site container before alerting, and
# says whether the restart fixed it. Creds come from the desk .env (same box).
URL="https://safetyline.com.ng/"
ENVF="/opt/safetyline-desk/data/.env"
STATE="/opt/sardauna-site/.uptime-state"
LOG="/opt/sardauna-site/uptime.log"
COOLDOWN=3600
ts(){ date -u +"%Y-%m-%dT%H:%M:%SZ"; }
now(){ date -u +%s; }
log(){ echo "$(ts) $*" >> "$LOG"; }
envval(){ grep -E "^(export )?$1=" "$ENVF" 2>/dev/null | tail -1 | sed -E "s/^(export )?$1=//; s/^[\"']//; s/[\"']$//"; }
send_owner(){
  local msg="$1" TOKEN PHONE_ID TO VER code
  TOKEN=$(envval WHATSAPP_CLOUD_ACCESS_TOKEN); PHONE_ID=$(envval WHATSAPP_CLOUD_PHONE_NUMBER_ID)
  TO=$(envval WHATSAPP_CLOUD_HOME_CHANNEL); VER=$(envval WHATSAPP_CLOUD_API_VERSION); VER=${VER:-v21.0}
  case "$VER" in v*) ;; *) VER="v$VER";; esac
  if [ -z "$TOKEN" ] || [ -z "$PHONE_ID" ] || [ -z "$TO" ]; then log "WARN alert skipped: missing creds"; return 1; fi
  local payload; payload=$(printf '{"messaging_product":"whatsapp","recipient_type":"individual","to":"%s","type":"text","text":{"preview_url":false,"body":"%s"}}' "$TO" "$msg")
  code=$(curl -sS -m 15 -o /dev/null -w "%{http_code}" -X POST \
    "https://graph.facebook.com/${VER}/${PHONE_ID}/messages" \
    -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" -d "$payload")
  log "owner alert http=$code msg=\"$msg\""
}
probe(){
  local c i
  for i in 1 2 3; do
    c=$(curl -s -m 10 -o /dev/null -w "%{http_code}" "$URL")
    [ "$c" = "200" ] && return 0
    sleep 3
  done
  LAST_CODE="$c"
  return 1
}

if probe; then
  if [ -f "$STATE" ]; then
    log "RECOVERED (200)"
    send_owner "[Safetyline] The website safetyline.com.ng is back online."
    rm -f "$STATE"
  fi
  exit 0
fi

# down: try self-heal once before alerting
log "DOWN (code=$LAST_CODE) - restarting sardauna-site"
docker restart sardauna-site >/dev/null 2>&1
sleep 20
if probe; then
  log "SELF-HEALED after container restart"
  send_owner "[Safetyline] Heads up: safetyline.com.ng went down (HTTP $LAST_CODE) but auto-recovered after a container restart. No action needed; check /opt/sardauna-site/uptime.log if it repeats."
  exit 0
fi

if [ -f "$STATE" ]; then
  LAST=$(cat "$STATE" 2>/dev/null || echo 0)
  if [ $(( $(now) - LAST )) -ge "$COOLDOWN" ]; then
    log "STILL DOWN (code=$LAST_CODE)"; send_owner "[Safetyline] safetyline.com.ng is STILL DOWN (HTTP $LAST_CODE) and a container restart did not fix it - likely the shared proxy or the box. Please check the server."; now > "$STATE"
  else
    log "DOWN (within cooldown; no re-alert)"
  fi
else
  log "DOWN first-detection (code=$LAST_CODE), restart did not recover"
  send_owner "[Safetyline] URGENT: the website safetyline.com.ng is DOWN (HTTP $LAST_CODE) and auto-restart did not recover it. Please check the server (see CUTOVER-RUNBOOK rollback if needed)."
  now > "$STATE"
fi
exit 0
