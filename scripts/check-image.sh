#!/bin/bash
cd /var/www/feelstudio

echo "=== page-media icerik ==="
find public/page-media/ -type f 2>/dev/null
echo ""

echo "=== Dosya boyutlari ==="
ls -lhR public/page-media/ 2>/dev/null
echo ""

echo "=== Curl ile gorsel testi (localhost) ==="
FIRST_FILE=$(find public/page-media/ -type f | head -1)
if [ -n "$FIRST_FILE" ]; then
  URL_PATH=$(echo "$FIRST_FILE" | sed 's|public/|/|')
  echo "Test URL: $URL_PATH"
  curl -s -o /dev/null -w "HTTP %{http_code}, Size: %{size_download} bytes" "http://localhost:3010$URL_PATH"
  echo ""
else
  echo "Hic dosya yok"
fi
echo ""

echo "=== Nginx config ==="
cat /etc/nginx/sites-enabled/feelcreativestudio.com 2>/dev/null | head -30
echo ""

echo "=== TAMAMLANDI ==="
