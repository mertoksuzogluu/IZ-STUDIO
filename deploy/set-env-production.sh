#!/bin/bash
# Sunucuda .env içinde NEXTAUTH_URL ve NEXT_PUBLIC_SITE_URL'i https://feelcreativestudio.com yapar, PM2 restart eder.
# Kullanım: cd /var/www/feelstudio && bash deploy/set-env-production.sh

set -e
PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"
ENV_FILE="$PROJECT_DIR/.env"
URL="https://feelcreativestudio.com"

if [ ! -f "$ENV_FILE" ]; then
  echo "NEXTAUTH_URL=\"$URL\"" > "$ENV_FILE"
  echo "NEXT_PUBLIC_SITE_URL=\"$URL\"" >> "$ENV_FILE"
  echo ".env oluşturuldu. DATABASE_URL ve NEXTAUTH_SECRET ekleyin: nano $ENV_FILE"
else
  if grep -q "^NEXTAUTH_URL=" "$ENV_FILE" 2>/dev/null; then
    sed -i "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=\"$URL\"|" "$ENV_FILE"
  else
    echo "NEXTAUTH_URL=\"$URL\"" >> "$ENV_FILE"
  fi
  if grep -q "^NEXT_PUBLIC_SITE_URL=" "$ENV_FILE" 2>/dev/null; then
    sed -i "s|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=\"$URL\"|" "$ENV_FILE"
  else
    echo "NEXT_PUBLIC_SITE_URL=\"$URL\"" >> "$ENV_FILE"
  fi
  echo ".env güncellendi: NEXTAUTH_URL ve NEXT_PUBLIC_SITE_URL = $URL"
fi

if command -v pm2 >/dev/null 2>&1; then
  (cd "$PROJECT_DIR" && pm2 restart feelstudio 2>/dev/null) && echo "PM2: feelstudio yeniden başlatıldı." || true
fi
