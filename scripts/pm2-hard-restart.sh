#!/bin/bash
cd /var/www/feelstudio
echo "=== PM2 tamamen durdur ==="
pm2 stop feelstudio
pm2 delete feelstudio

echo "=== PM2 yeniden baslat ==="
pm2 start ecosystem.config.cjs
pm2 save

echo "=== 3 saniye bekle ==="
sleep 3

echo "=== PM2 durum ==="
pm2 status

echo "=== Build kontrol (son) ==="
grep -o "instanceof File" .next/server/app/api/admin/example-videos/upload/route.js 2>/dev/null && echo "BUILD ESKI!" || echo "BUILD GUNCEL"

echo "=== TAMAMLANDI ==="
