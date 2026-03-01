#!/bin/bash
cd /var/www/feelstudio

echo "=== Nginx client_max_body_size ekle ==="
if grep -q "client_max_body_size" /etc/nginx/sites-available/feelcreativestudio.com 2>/dev/null; then
  echo "Zaten var"
else
  sed -i '/proxy_pass http:\/\/127.0.0.1:3010;/a\        client_max_body_size 200M;' /etc/nginx/sites-available/feelcreativestudio.com
  echo "Eklendi: client_max_body_size 200M"
fi

echo ""
echo "=== Nginx test + reload ==="
nginx -t 2>&1
systemctl reload nginx
echo "Nginx yeniden yuklendi"

echo ""
echo "=== Nginx config kontrol ==="
grep -A2 "proxy_pass\|client_max" /etc/nginx/sites-available/feelcreativestudio.com | head -10

echo ""
echo "TAMAMLANDI - Tarayicida cikis yap, tekrar giris yap, sonra video yukle"
