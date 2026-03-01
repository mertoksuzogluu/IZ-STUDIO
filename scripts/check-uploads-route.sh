#!/bin/bash
cd /var/www/feelstudio

echo "=== uploads route kaynak ==="
ls -la "app/api/uploads/[...path]/route.ts" 2>/dev/null || echo "KAYNAK YOK"
cat "app/api/uploads/[...path]/route.ts" 2>/dev/null | head -5

echo ""
echo "=== uploads route build ==="
find .next/server/app/api/uploads -type f 2>/dev/null || echo "BUILD YOK"

echo ""
echo "=== Dosya var mi? ==="
ls -la public/uploads/example-videos/7ab2f5be4cfad438.jpg 2>/dev/null || echo "DOSYA YOK"
ls public/uploads/example-videos/ 2>/dev/null | head -10

echo ""
echo "=== curl test ==="
curl -s -o /dev/null -w "HTTP %{http_code}" http://localhost:3010/api/uploads/example-videos/7ab2f5be4cfad438.jpg
echo ""
