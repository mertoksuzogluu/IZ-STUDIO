#!/bin/bash
# Aynı sunucuda tourlyio açılıyorsa: default_server'ı tourlyio'dan kaldırıp
# feelcreativestudio'yu varsayılan yapar. Sunucuda: sudo bash deploy/fix-nginx-default-site.sh

set -e
SITES_ENABLED="/etc/nginx/sites-enabled"
SITES_AVAILABLE="/etc/nginx/sites-available"
FEEL_CONFIG="$SITES_AVAILABLE/feelcreativestudio.com"

echo "=== Nginx default site düzeltmesi ==="

# 1. Tourlyio (ve feelcreativestudio olmayan) config'lerden default_server kaldır
for f in "$SITES_ENABLED"/*; do
  [ -f "$f" ] || continue
  real=$(readlink -f "$f" 2>/dev/null || echo "$f")
  if [[ "$real" == *"feelcreativestudio"* ]]; then
    continue
  fi
  if grep -q "default_server" "$real" 2>/dev/null; then
    echo "default_server kaldırılıyor: $real"
    sed -i.bak 's/ default_server//g' "$real"
  fi
done

# 2. feelcreativestudio config'inde listen 443 varsa ve default_server yoksa ekle
if [ -f "$FEEL_CONFIG" ]; then
  if grep -q "listen 443" "$FEEL_CONFIG" && ! grep -q "default_server" "$FEEL_CONFIG"; then
    echo "feelcreativestudio'ya default_server ekleniyor"
    sed -i.bak 's/listen 443 ssl;/listen 443 ssl default_server;/' "$FEEL_CONFIG"
  fi
else
  echo "Uyarı: $FEEL_CONFIG bulunamadı."
fi

# 3. Test ve reload
echo "=== Nginx test ve reload ==="
sudo nginx -t
sudo systemctl reload nginx
echo "Bitti. https://feelcreativestudio.com açmayı dene."
echo "Hâlâ tourlyio açılıyorsa: tarayıcı önbelleğini temizle veya gizli pencerede dene."
