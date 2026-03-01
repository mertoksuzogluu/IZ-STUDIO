#!/bin/bash
# Sunucuda PostgreSQL kullanici ve DB olusturur / sifreyi gunceller.
# P1000 "Authentication failed" hatasini cozer.
#
# Kullanim (sunucuda):
#   cd /var/www/feelstudio
#   bash deploy/fix-db-credentials.sh 'SizinSifreniz'
#
# Sonra .env icinde DATABASE_URL sifresini ayni yapin:
#   DATABASE_URL="postgresql://izstudio:SizinSifreniz@localhost:5432/izstudio?schema=public"
#
# Not: Sifrede tek tirnak (') kullanmayin.

set -e
PASS="${1:-izstudio123}"

echo "=== PostgreSQL: izstudio kullanici ve veritabani ==="
echo "Sifre: (gosterilmiyor; .env ile ayni olmali)"
echo ""

sudo -u postgres psql -v ON_ERROR_STOP=1 << EOF
-- Kullanici yoksa olustur, varsa sifreyi guncelle
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'izstudio') THEN
    CREATE USER izstudio WITH PASSWORD '$PASS';
    RAISE NOTICE 'Kullanici izstudio olusturuldu.';
  ELSE
    ALTER USER izstudio WITH PASSWORD '$PASS';
    RAISE NOTICE 'Kullanici izstudio sifresi guncellendi.';
  END IF;
END
\$\$;

-- Veritabani yoksa olustur
SELECT 'CREATE DATABASE izstudio OWNER izstudio'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'izstudio')\gexec
EOF

echo ""
echo "Bitti. Simdi .env dosyasinda DATABASE_URL sifresini bu sifre ile ayni yapin:"
echo "  nano .env"
echo "  DATABASE_URL=\"postgresql://izstudio:BURAYA_AYNI_SIFRE@localhost:5432/izstudio?schema=public\""
echo ""
echo "Ardindan migrate + seed + restart:"
echo "  npx prisma migrate deploy && npx prisma db seed && pm2 restart feelstudio"
echo ""
