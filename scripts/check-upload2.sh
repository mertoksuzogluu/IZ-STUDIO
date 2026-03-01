#!/bin/bash
cd /var/www/feelstudio
echo "=== Son 20 PM2 hata logu ==="
pm2 logs feelstudio --lines 20 --nostream 2>&1 | grep -i -E "error|hata|upload|page-images|File"
echo ""
echo "=== Curl ile upload testi ==="
echo "test" > /tmp/test-upload.jpg
curl -s -X POST http://localhost:3010/api/admin/page-images \
  -H "Cookie: $(cat /tmp/feel-cookie.txt 2>/dev/null)" \
  -F "page=hero" \
  -F "file=@/tmp/test-upload.jpg;type=image/jpeg" 2>&1
echo ""
echo ""
echo "=== Route dosyasi kontrol ==="
head -20 /var/www/feelstudio/app/api/admin/page-images/route.ts 2>/dev/null || echo "route.ts kaynak yok (build'den calisiyordur)"
echo ""
echo "=== Build route kontrol ==="
ls -la /var/www/feelstudio/.next/server/app/api/admin/page-images/ 2>/dev/null
echo ""
echo "=== instanceof File var mi? ==="
grep -o "instanceof File" /var/www/feelstudio/.next/server/app/api/admin/page-images/route.js 2>/dev/null && echo "HALA MEVCUT - eski build!" || echo "instanceof File YOK - build guncel"
echo ""
echo "=== TAMAMLANDI ==="
