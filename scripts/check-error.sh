#!/bin/bash
cd /var/www/feelstudio
echo "=== Son PM2 hata loglari ==="
pm2 logs feelstudio --lines 40 --nostream 2>&1 | tail -40
echo ""
echo "=== Build hata kontrol ==="
grep -r "Error" .next/server/app/api/media/ 2>/dev/null | head -5
echo ""
echo "=== media route var mi ==="
ls -la .next/server/app/api/media/ 2>/dev/null || echo "media route BUILD EDILMEMIS"
echo ""
echo "=== kaynak media route var mi ==="
ls -la app/api/media/ 2>/dev/null
cat app/api/media/\[...path\]/route.ts 2>/dev/null | head -5 || echo "kaynak dosya YOK"
