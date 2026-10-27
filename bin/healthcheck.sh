#!/bin/bash
# Das Filter watchdog: restart a service only when it stops answering.
# Runs from cron every 2 minutes. Logs to /var/log/dasfilter-health.log.
# A restart is only triggered after 3 consecutive failures (~6 minutes).
set -u
COMPOSE="/usr/local/bin/docker-compose -f /root/dasfilter/docker-compose.yml"
LOG=/var/log/dasfilter-health.log
STATE=/run/dasfilter-health
mkdir -p "$STATE"

check() {
  local name="$1" url="$2" expect="$3"
  local code
  code=$(curl -s -k -m 10 -o /dev/null -w '%{http_code}' "$url" || echo 000)
  if [ "$code" = "$expect" ]; then
    rm -f "$STATE/$name.fail"
    return 0
  fi
  local n=0
  [ -f "$STATE/$name.fail" ] && n=$(cat "$STATE/$name.fail")
  n=$((n + 1)); echo "$n" > "$STATE/$name.fail"
  echo "$(date -Is) $name unhealthy (http $code), strike $n" >> "$LOG"
  if [ "$n" -ge 3 ]; then
    echo "$(date -Is) restarting $name" >> "$LOG"
    $COMPOSE restart -t 30 "$name" >> "$LOG" 2>&1
    rm -f "$STATE/$name.fail"
  fi
  return 1
}

# couchdb first: if it is down the app will fail too
check couchdb "http://127.0.0.1:5984/_up" 200 || exit 0
check app     "http://127.0.0.1:8080/s/404" 200
check nginx   "https://127.0.0.1:443/s/404" 200
