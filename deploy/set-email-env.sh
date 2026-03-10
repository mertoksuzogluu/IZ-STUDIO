#!/bin/bash
# Sunucuda e-posta (SMTP) ayarlarını .env dosyasına ekler/günceller.
# Şifreyi script içine yazmayın; çalıştırırken parametre verin.
#
# Kullanım (sunucuda):
#   cd /var/www/feelstudio
#   bash deploy/set-email-env.sh 'SMTP_ŞİFRENİZ'
#
# Örnek: bash deploy/set-email-env.sh 'SMTP_SIFRENIZ'

set -e
SMTP_PASS="${1:-}"

if [ -z "$SMTP_PASS" ]; then
  echo "Kullanım: bash deploy/set-email-env.sh 'SMTP_ŞİFRENİZ'"
  echo "Örnek:   bash deploy/set-email-env.sh 'SMTP_SIFRENIZ'"
  exit 1
fi

cd /var/www/feelstudio 2>/dev/null || true
# Next.js önce .env.local okur; sunucuda hangisi varsa ona yaz
if [ -f ".env.local" ]; then ENV_FILE=".env.local"; else ENV_FILE=".env"; fi
[ -f "$ENV_FILE" ] || { echo "Hata: $ENV_FILE bulunamadı."; exit 1; }

# Mevcut SMTP/EMAIL satırlarını kaldır (varsa)
if grep -q '^EMAIL_FROM=' "$ENV_FILE" 2>/dev/null; then
  sed -i.bak '/^EMAIL_FROM=/d;/^SMTP_HOST=/d;/^SMTP_PORT=/d;/^SMTP_SECURE=/d;/^SMTP_USER=/d;/^SMTP_PASS=/d' "$ENV_FILE"
fi

# SMTP şifresinde özel karakterler var; tek tırnak ile ekleyelim
# (sed ile $SMTP_PASS kullanmak tehlikeli olabilir, bu yüzden append ile)
{
  echo ""
  echo "# E-posta (no-reply@feelcreativestudio.com) - deploy/set-email-env.sh"
  echo 'EMAIL_FROM="Feel Studio <no-reply@feelcreativestudio.com>"'
  echo 'SMTP_HOST="smtp.turkticaret.net"'
  echo 'SMTP_PORT="587"'
  echo 'SMTP_SECURE="false"'
  echo 'SMTP_USER="no-reply@feelcreativestudio.com"'
  echo "SMTP_PASS=\"$SMTP_PASS\""
} >> "$ENV_FILE"

echo "E-posta ayarları $ENV_FILE dosyasına eklendi."
grep -E '^(EMAIL_FROM|SMTP_)' "$ENV_FILE" | sed 's/SMTP_PASS=.*/SMTP_PASS=***/'
echo ""
echo "Uygulamayı yeniden başlatın: pm2 restart feelstudio"
