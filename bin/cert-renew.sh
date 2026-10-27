#!/bin/bash
# Renew the Let's Encrypt certificate (only when <30 days left) and reload nginx.
# Runs weekly from root's crontab; log in /var/log/dasfilter-cert.log
cd /root/dasfilter || exit 1
PATH=/usr/local/bin:/usr/bin:/bin
LOG=/var/log/dasfilter-cert.log
{
  echo "$(date -Is) certbot renew"
  docker run --rm --security-opt seccomp:/root/dasfilter/config/seccomp-enosys.json \
    -v /root/dasfilter/data/certbot/conf:/etc/letsencrypt \
    -v /root/dasfilter/data/certbot/www:/var/www/certbot \
    certbot/certbot renew --webroot -w /var/www/certbot --quiet "$@" \
  && docker-compose exec -T nginx nginx -s reload
  echo "$(date -Is) exit $?"
} >> "$LOG" 2>&1
