#!/bin/bash
# Sunucuda .env ve .env.local içinde DATABASE_URL portunu 5433 -> 5432 yapar.
# Kullanım: cd /var/www/feelstudio && bash deploy/fix-database-url.sh

set -e
for ENV_FILE in .env .env.local; do
  if [ -f "$ENV_FILE" ]; then
    sed -i.bak 's|localhost:5433|localhost:5432|g' "$ENV_FILE"
    echo "Güncellendi: $ENV_FILE (port 5433 -> 5432)"
    grep DATABASE_URL "$ENV_FILE" || true
  fi
done
echo "Bitti. Build sırasında 5432 kullanılacak."
