#!/bin/bash
# Sunucuda .env kontrolu, build ve pm2 restart.
# Kullanim: cd /var/www/feelstudio && bash deploy/server-build-restart.sh

set -e
cd /var/www/feelstudio

echo "=== .env (NEXTAUTH_URL, NEXT_PUBLIC_SITE_URL) ==="
grep -E "NEXTAUTH_URL|NEXT_PUBLIC_SITE_URL" .env 2>/dev/null || true
if ! grep -q 'https://' .env 2>/dev/null; then
  echo "Uyari: .env icinde https:// olmali. Duzenle: nano .env"
  read -p "Devam etmek icin Enter..."
fi

echo ""
echo "=== Build ==="
npm run build

echo ""
echo "=== PM2 restart ==="
pm2 restart feelstudio

echo ""
echo "Bitti. https://feelcreativestudio.com acmayi dene."
echo "Hala 'guvenli degil' ise: tarayicida F12 -> Console, kirmizi uyariya bak."
