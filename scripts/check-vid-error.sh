#!/bin/bash
cd /var/www/feelstudio
echo "=== Son 15 PM2 log ==="
pm2 logs feelstudio --lines 15 --nostream 2>&1
echo ""
echo "=== Curl test upload ==="
echo "test" > /tmp/test.jpg
curl -v -X POST http://localhost:3010/api/admin/example-videos/upload \
  -F "file=@/tmp/test.jpg;type=image/jpeg" 2>&1 | tail -20
rm -f /tmp/test.jpg
