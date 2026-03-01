#!/bin/bash
cd /var/www/feelstudio

echo "=== AdminExampleVideosForm guncel mi? ==="
grep -c "Kaydedildi" app/admin/example-videos/AdminExampleVideosForm.tsx 2>/dev/null && echo "KAYNAK GUNCEL" || echo "KAYNAK ESKI"

echo ""
echo "=== Build guncel mi? ==="
grep -c "Kaydedildi" .next/server/app/admin/example-videos/page.js 2>/dev/null && echo "BUILD GUNCEL" || echo "BUILD ESKI"

echo ""
echo "=== DB'deki example_videos degeri ==="
node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.siteSetting.findUnique({ where: { key: 'example_videos' } }).then(r => {
  if (!r) { console.log('DB: kayit YOK'); return; }
  const items = JSON.parse(r.value);
  items.forEach((it, i) => console.log('Video', i+1, ':', it.title, '| thumb:', (it.thumbnail||'').substring(0,60), '| mp4:', it.mp4Src || '(yok)', '| webm:', it.webmSrc || '(yok)'));
}).catch(e => console.error('DB HATA:', e.message)).finally(() => p.\$disconnect());
"

echo ""
echo "=== Son PM2 loglari (PATCH) ==="
pm2 logs feelstudio --lines 20 --nostream 2>&1 | grep -i -E "PATCH|example|kaydet|save" | tail -10
