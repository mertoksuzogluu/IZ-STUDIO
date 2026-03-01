#!/bin/bash
# Sunucuda cron job kurar: her gece 03:00'te tamamlanan eski siparisleri temizler
# Kullanım: bash scripts/setup-cron.sh

CLEANUP_SECRET=$(grep CLEANUP_SECRET /var/www/feelstudio/.env.local 2>/dev/null | cut -d'"' -f2)

if [ -z "$CLEANUP_SECRET" ]; then
  CLEANUP_SECRET=$(openssl rand -hex 16)
  echo "CLEANUP_SECRET=\"$CLEANUP_SECRET\"" >> /var/www/feelstudio/.env.local
  echo "CLEANUP_SECRET olusturuldu ve .env.local'e eklendi: $CLEANUP_SECRET"
fi

CRON_LINE="0 3 * * * curl -s 'http://localhost:3010/api/admin/cleanup?secret=$CLEANUP_SECRET' >> /var/log/feelstudio-cleanup.log 2>&1"

(crontab -l 2>/dev/null | grep -v "admin/cleanup"; echo "$CRON_LINE") | crontab -

echo "Cron job kuruldu:"
crontab -l | grep cleanup
echo ""
echo "Her gece 03:00'te 14 gunden eski tamamlanan siparisler silinecek."
echo "Log: /var/log/feelstudio-cleanup.log"
