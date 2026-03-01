#!/bin/bash
echo "=== PostgreSQL durumu ==="
systemctl status postgresql 2>/dev/null | head -5

echo ""
echo "=== PostgreSQL port ==="
ss -tlnp 2>/dev/null | grep -E "5432|5433"

echo ""
echo "=== .env (Prisma) ==="
cat /var/www/feelstudio/.env 2>/dev/null || echo "(.env yok)"

echo ""
echo "=== Mevcut .env.local DATABASE_URL ==="
grep DATABASE_URL /var/www/feelstudio/.env.local

echo ""
echo "=== PostgreSQL kullanicilari ==="
sudo -u postgres psql -c "\du" 2>/dev/null || echo "(psql erisim yok)"

echo ""
echo "=== PostgreSQL veritabanlari ==="
sudo -u postgres psql -c "\l" 2>/dev/null | grep -i iz

echo ""
echo "=== Docker postgres ==="
docker ps 2>/dev/null | grep -i postgres || echo "(docker postgres yok)"
