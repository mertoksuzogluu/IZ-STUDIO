#!/bin/bash
# Domain + Nginx + SSL kurulumu — feelcreativestudio.com
# Kullanım (sunucuda):
#   cd /var/www/feelstudio && bash deploy/setup-domain.sh
# E-posta vermek için (Certbot sormadan):
#   CERTBOT_EMAIL=sen@email.com bash deploy/setup-domain.sh

set -e
PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"
if [ ! -f "$PROJECT_DIR/deploy/nginx-feelcreativestudio.conf" ]; then
  echo "Hata: Proje klasöründe çalıştır. Örnek: cd /var/www/feelstudio && bash deploy/setup-domain.sh"
  exit 1
fi

echo "=== 1. Nginx + Certbot kuruluyor ==="
sudo apt-get update -qq
sudo apt-get install -y nginx certbot python3-certbot-nginx

echo "=== 2. Nginx site config kopyalanıyor ve etkinleştiriliyor ==="
sudo cp "$PROJECT_DIR/deploy/nginx-feelcreativestudio.conf" /etc/nginx/sites-available/feelcreativestudio.com
sudo ln -sf /etc/nginx/sites-available/feelcreativestudio.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
echo "Nginx hazır. http://feelcreativestudio.com açılmalı."

echo "=== 3. SSL (Certbot) — e-posta istenecek veya CERTBOT_EMAIL kullanılacak ==="
if [ -n "$CERTBOT_EMAIL" ]; then
  sudo certbot --nginx -d feelcreativestudio.com -d www.feelcreativestudio.com \
    --non-interactive --agree-tos -m "$CERTBOT_EMAIL"
  sudo certbot update_account --email "$CERTBOT_EMAIL" 2>/dev/null || true
else
  sudo certbot --nginx -d feelcreativestudio.com -d www.feelcreativestudio.com
fi

echo "=== 4. .env içinde NEXTAUTH_URL ve NEXT_PUBLIC_SITE_URL kontrolü ==="
ENV_FILE="$PROJECT_DIR/.env"
if [ -f "$ENV_FILE" ]; then
  if ! grep -q 'NEXTAUTH_URL="https://feelcreativestudio.com"' "$ENV_FILE" 2>/dev/null; then
    echo "Dikkat: .env dosyasında NEXTAUTH_URL=https://feelcreativestudio.com olmalı. Şimdi düzenle: nano $ENV_FILE"
  fi
  if ! grep -q 'NEXT_PUBLIC_SITE_URL="https://feelcreativestudio.com"' "$ENV_FILE" 2>/dev/null; then
    echo "Dikkat: .env dosyasında NEXT_PUBLIC_SITE_URL=https://feelcreativestudio.com olmalı. Şimdi düzenle: nano $ENV_FILE"
  fi
  if command -v pm2 >/dev/null 2>&1; then
    echo "PM2 ile uygulama yeniden başlatılıyor..."
    (cd "$PROJECT_DIR" && pm2 restart feelstudio 2>/dev/null) || true
  fi
else
  echo "Dikkat: .env bulunamadı ($ENV_FILE). Oluşturup NEXTAUTH_URL ve NEXT_PUBLIC_SITE_URL ekleyin."
fi

echo ""
echo "=== Bitti. Site: https://feelcreativestudio.com ==="
