#!/bin/bash
cd /var/www/feelstudio
echo "=== Son PM2 hatalari (example-videos) ==="
pm2 logs feelstudio --lines 30 --nostream 2>&1 | grep -i -E "example.video|upload|Error|error" | tail -15
echo ""
echo "=== Build kontrol ==="
grep -o "instanceof File" .next/server/app/api/admin/example-videos/upload/route.js 2>/dev/null && echo "ESKI BUILD - instanceof File hala var!" || echo "OK - instanceof File yok"
echo ""
echo "=== Kaynak kontrol ==="
grep "instanceof File" app/api/admin/example-videos/upload/route.ts 2>/dev/null && echo "KAYNAK ESKI!" || echo "Kaynak OK"
echo ""
echo "=== uploads dizin ==="
ls -la public/uploads/ 2>/dev/null || echo "public/uploads/ YOK"
ls -la public/uploads/example-videos/ 2>/dev/null || echo "public/uploads/example-videos/ YOK"
