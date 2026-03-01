#!/bin/bash
set -e
cd /var/www/feelstudio

echo "=== Kaynak dosya kontrol ==="
grep "instanceof File" app/api/admin/page-images/route.ts 2>/dev/null && echo "SORUN: kaynak dosyada hala instanceof File var!" || echo "Kaynak OK"

echo ""
echo "=== Eski build siliniyor ==="
rm -rf .next

echo "=== Yeniden build ==="
npm run build 2>&1 | tail -8

echo ""
echo "=== Build sonrasi kontrol ==="
grep -o "instanceof File" .next/server/app/api/admin/page-images/route.js 2>/dev/null && echo "HATA: build hala eski!" || echo "BUILD GUNCEL - instanceof File YOK"

echo ""
echo "=== PM2 restart ==="
pm2 restart feelstudio
echo ""
echo "=== TAMAMLANDI ==="
