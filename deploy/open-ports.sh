#!/bin/bash
# Sunucuda 80 ve 443 açmak için (Certbot ve site erişimi)
# Çalıştır: sudo bash deploy/open-ports.sh

set -e
echo "Port 80, 443 ve 22 (SSH) açılıyor..."
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw --force enable
ufw status
echo "Bitti. DNS doğruysa (feelcreativestudio.com -> 38.242.143.93) certbot tekrar dene:"
echo "  sudo certbot --nginx -d feelcreativestudio.com -d www.feelcreativestudio.com"
