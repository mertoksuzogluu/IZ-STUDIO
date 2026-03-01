#!/bin/bash
cd /var/www/feelstudio

echo "=== Build icerisinde alert var mi? ==="
grep -c "Kaydedildi" .next/server/chunks/*.js 2>/dev/null
grep -c "Kaydedildi" .next/static/chunks/*.js 2>/dev/null
find .next -name "*.js" -exec grep -l "Kaydedildi" {} \; 2>/dev/null | head -5

echo ""
echo "=== Kaynak dosyada alert var mi? ==="
grep -n "Kaydedildi" app/admin/example-videos/AdminExampleVideosForm.tsx 2>/dev/null
