#!/bin/bash
# Sunucuda .env.local içindeki NEXTAUTH_URL / DB / SMTP ayarlarını günceller.
# GERÇEK ŞİFRELER BURADA YOKTUR – ortam değişkeni veya sunucuda elle yazılmalı.
#
# Kullanım (sunucuda):
#   SMTP_PASS="mail_sifren" DATABASE_URL="postgresql://user:pass@localhost:5432/izstudio?schema=public" bash fix-env-now.sh
# veya önce .env.local'i sunucuda düzenleyip şifreleri yazın, sonra bu scripti şifresiz çalıştırın
# (sadece PORT/SECURE gibi değerleri günceller).
set -e
cd "${REMOTE_PATH:-/var/www/feelstudio}"

echo "=== .env.local duzeltiliyor ==="

# NEXTAUTH_URL ve NEXT_PUBLIC_SITE_URL (şifre içermez)
if [ -f .env.local ]; then
  sed -i 's|NEXTAUTH_URL=.*|NEXTAUTH_URL="https://feelcreativestudio.com"|' .env.local
  sed -i 's|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL="https://feelcreativestudio.com"|' .env.local
fi

# DATABASE_URL: sadece ortam değişkeni verildiyse güncelle (şifre scriptte YOK)
if [ -n "$DATABASE_URL" ]; then
  sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$DATABASE_URL\"|" .env.local
  echo "DATABASE_URL env ile guncellendi."
else
  echo "DATABASE_URL verilmedi; mevcut deger korunuyor. Degistirmek icin: DATABASE_URL='...' $0"
fi

# SMTP: sadece SMTP_PASS env verildiyse güncelle (şifre scriptte YOK)
if [ -n "$SMTP_PASS" ]; then
  sed -i "s|SMTP_PASS=.*|SMTP_PASS=\"$(echo "$SMTP_PASS" | sed 's/"/\\"/g')\"|" .env.local
  echo "SMTP_PASS env ile guncellendi."
else
  echo "SMTP_PASS verilmedi; mevcut deger korunuyor. Degistirmek icin: SMTP_PASS='...' $0"
fi

# Port ve secure (değerler şifre değil)
sed -i 's|SMTP_PORT=.*|SMTP_PORT="465"|' .env.local
sed -i 's|SMTP_SECURE=.*|SMTP_SECURE="true"|' .env.local

# .env.local içeriği GİZLİ – loglama yapma
echo "--- .env.local satir sayisi (icerik yok) ---"
wc -l .env.local

echo ""
echo "=== Build + restart ==="
npm run build 2>&1 | tail -5
pm2 restart feelstudio

echo ""
echo "=== DB baglanti testi ==="
node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.\$queryRaw\`SELECT 1 as ok\`.then(r => { console.log('DB OK'); return p.\$disconnect(); }).catch(e => { console.error('DB HATA:', e.message); process.exit(1); });
"

echo ""
echo "=== Admin sifre sifirlama ==="
node scripts/reset-admin-pw.js

echo ""
echo "=== TAMAMLANDI ==="
