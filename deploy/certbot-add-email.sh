#!/bin/bash
# Certbot hesabına e-posta ekle (süre bitmeden hatırlatma alırsın).
# Kullanım: sudo bash deploy/certbot-add-email.sh  (varsayılan: mertoksuzogluu@gmail.com)
# Veya:    CERTBOT_EMAIL=baska@email.com sudo bash deploy/certbot-add-email.sh

CERTBOT_EMAIL="${CERTBOT_EMAIL:-mertoksuzogluu@gmail.com}"
certbot update_account --email "$CERTBOT_EMAIL"
echo "E-posta eklendi ($CERTBOT_EMAIL). Sertifika yenileme hatırlatmaları bu adrese gidecek."
