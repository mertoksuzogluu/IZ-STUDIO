#!/bin/bash
cd /var/www/feelstudio

echo "=== Dizin izinleri ==="
ls -la public/ | head -10
echo ""
ls -la public/page-media/ 2>/dev/null || echo "public/page-media/ YOK"
echo ""

echo "=== Dizin olusturma testi ==="
mkdir -p public/page-media/hero public/page-media/ask public/page-media/hatira public/page-media/cocuk
ls -la public/page-media/
echo ""

echo "=== Yazma testi ==="
echo "test" > public/page-media/hero/test.txt && echo "Yazma OK" && rm -f public/page-media/hero/test.txt || echo "YAZMA HATASI"
echo ""

echo "=== PM2 loglarindaki son hatalar ==="
pm2 logs feelstudio --lines 30 --nostream 2>&1 | grep -i -E "error|hata|upload|page-images" | tail -15
echo ""

echo "=== API test (curl) ==="
curl -s -o /dev/null -w "HTTP %{http_code}" http://localhost:3010/api/admin/page-images?page=hero
echo ""
echo ""

echo "=== next.config body limit ==="
grep -i "bodyParser\|bodySizeLimit\|serverActions" next.config.js 2>/dev/null || echo "(next.config.js'de body limit ayari yok)"
echo ""

echo "=== TAMAMLANDI ==="
