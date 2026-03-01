#!/bin/bash
set -e
cd /var/www/feelstudio

echo "=== SUNUCU TANIMLAMA ==="
echo ""

# 1. Mevcut .env.local icerigini goster
echo "--- Mevcut .env.local ---"
cat .env.local 2>/dev/null || echo "(dosya yok)"
echo ""

# 2. DATABASE_URL kontrolu - sunucudaki gercek degerle eslesiyor mu?
echo "--- Veritabani baglanti testi ---"
if node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.\$queryRaw\`SELECT 1 as ok\`.then(r => { console.log('DB OK:', JSON.stringify(r)); p.\$disconnect(); }).catch(e => { console.error('DB HATA:', e.message); process.exit(1); });
" 2>&1; then
  echo "Veritabani baglantisi basarili."
else
  echo "VERITABANI BAGLANTI HATASI!"
  echo "Sunucudaki PostgreSQL bilgilerini kontrol edin."
fi
echo ""

# 3. Admin kullanici kontrolu
echo "--- Admin kullanici kontrolu ---"
node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const user = await p.user.findFirst({ where: { email: 'admin@izstudio.com' } });
  if (!user) { console.log('Admin kullanici YOK'); process.exit(0); }
  console.log('Admin user:', user.id, user.email, user.role);
  const acc = await p.account.findFirst({ where: { userId: user.id, type: 'credentials' } });
  if (!acc) { console.log('Credentials hesabi YOK'); }
  else { console.log('Credentials hesabi var, sifre hash uzunlugu:', (acc.password||'').length); }
  await p.\$disconnect();
})();
" 2>&1
echo ""

# 4. NEXTAUTH_URL ve SECRET kontrolu
echo "--- Env degerleri ---"
echo "NEXTAUTH_URL: $(grep NEXTAUTH_URL .env.local 2>/dev/null || echo 'YOK')"
echo "NEXTAUTH_SECRET: $(grep NEXTAUTH_SECRET .env.local 2>/dev/null | sed 's/=.*/=***gizli***/')"
echo "DATABASE_URL: $(grep DATABASE_URL .env.local 2>/dev/null | sed 's/:[^:@]*@/:***@/')"
echo "NEXT_PUBLIC_SITE_URL: $(grep NEXT_PUBLIC_SITE_URL .env.local 2>/dev/null || echo 'YOK')"
echo ""

# 5. Admin sifresini sifirla
echo "--- Admin sifre sifirlama ---"
node -e "
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const email = 'admin@izstudio.com';
  const user = await p.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
  if (!user) { console.log('Admin kullanici bulunamadi, olusturuluyor...'); 
    const newUser = await p.user.create({ data: { email, name: 'Admin', role: 'admin' } });
    const hash = await bcrypt.hash('admin123', 10);
    await p.account.create({ data: { userId: newUser.id, type: 'credentials', provider: 'credentials', providerAccountId: newUser.id, password: hash } });
    console.log('Admin olusturuldu:', email, '/ admin123');
    await p.\$disconnect();
    return;
  }
  const hash = await bcrypt.hash('admin123', 10);
  const result = await p.account.updateMany({ where: { userId: user.id, type: 'credentials' }, data: { password: hash } });
  if (result.count === 0) {
    await p.account.create({ data: { userId: user.id, type: 'credentials', provider: 'credentials', providerAccountId: user.id, password: hash } });
    console.log('Credentials hesabi olusturuldu');
  }
  await p.user.update({ where: { id: user.id }, data: { role: 'admin' } });
  console.log('Admin sifre sifirlandi:', email, '/ admin123');
  await p.\$disconnect();
})().catch(e => console.error('HATA:', e.message));
" 2>&1

echo ""
echo "=== ISLEM TAMAMLANDI ==="
echo "Giris dene: admin@izstudio.com / admin123"
