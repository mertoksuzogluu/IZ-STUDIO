# Sunucuda build hatası – yapılacaklar

Build’in geçmesi için sunucuda **güncel kod** ve **doğru .env** olmalı.

---

## 1. .env port (5433 → 5432)

Sunucuda build hem `.env` hem `.env.local` kullanıyor. İkisinde de port 5432 olmalı:

```bash
cd /var/www/feelstudio
sed -i.bak 's|localhost:5433|localhost:5432|g' .env .env.local 2>/dev/null || true
grep DATABASE .env .env.local 2>/dev/null
```

Veya script ile: `bash deploy/fix-database-url.sh`

---

## 2. Güncel dosyaları sunucuya at

Bilgisayarında (PowerShell) proje klasöründeyken **tüm projeyi** (node_modules ve .next hariç) at:

```powershell
cd C:\Users\merto\iz-studio
scp -r app components lib public prisma scripts deploy types package.json package-lock.json next.config.js postcss.config.js tailwind.config.ts tsconfig.json ecosystem.config.cjs root@38.242.143.93:/var/www/feelstudio/
```

Eğer `package-lock.json` yoksa komuttan çıkar.

**Sadece değişen dosyaları atamak istersen:**

```powershell
scp app/layout.tsx root@38.242.143.93:/var/www/feelstudio/app/
scp app/auth/signin/page.tsx root@38.242.143.93:/var/www/feelstudio/app/auth/signin/
scp app/auth/signin/SignInForm.tsx root@38.242.143.93:/var/www/feelstudio/app/auth/signin/
scp app/products/page.tsx root@38.242.143.93:/var/www/feelstudio/app/products/
scp app/api/discounts/validate/route.ts root@38.242.143.93:/var/www/feelstudio/app/api/discounts/validate/
scp app/api/payment/callback/route.ts root@38.242.143.93:/var/www/feelstudio/app/api/payment/callback/
scp app/api/qr/generate/route.ts root@38.242.143.93:/var/www/feelstudio/app/api/qr/generate/
scp deploy/fix-database-url.sh root@38.242.143.93:/var/www/feelstudio/deploy/
```

---

## 3. Sunucuda build

```bash
cd /var/www/feelstudio
rm -rf .next
npm run build
pm2 restart feelstudio
```

---

## Ne değişti?

| Sorun | Çözüm |
|-------|--------|
| API route’lar statik sayılıyor | Route dosyalarında `headers()` çağrısı var; bu dosyalar sunucuda güncel olmalı. |
| /auth/signin useSearchParams | SignInForm ayrı dosyada, page Server Component + Suspense; root layout’ta `dynamic = 'force-dynamic'`. |
| /products build’te DB (5433) | Root layout `force-dynamic` + .env/.env.local’da port 5432. |
| 5433 hatası | Build hem .env hem .env.local okuyor; ikisinde de 5432 olmalı. |
