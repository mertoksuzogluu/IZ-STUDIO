#!/bin/bash
set -e
cd /var/www/feelstudio

echo "=== .env.local duzeltiliyor ==="

# Dogru DATABASE_URL (sunucudaki gercek sifre)
sed -i 's|DATABASE_URL=.*|DATABASE_URL="postgresql://izstudio:BenimGucluSifrem123@localhost:5432/izstudio?schema=public"|' .env.local

# SMTP bilgilerini sunucudaki gercek degerlerle degistir
sed -i 's|SMTP_PASS=.*|SMTP_PASS="4L3kCqt_+tr*"|' .env.local
sed -i 's|SMTP_PORT=.*|SMTP_PORT="465"|' .env.local
sed -i 's|SMTP_SECURE=.*|SMTP_SECURE="true"|' .env.local

echo "--- Guncellenmis .env.local ---"
cat .env.local

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
