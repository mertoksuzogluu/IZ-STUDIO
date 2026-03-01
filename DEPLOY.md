# feelcreativestudio.com – Canlıya Alma

## Domain: feelcreativestudio.com

### 1. Ortam değişkenleri (canlı sunucu / Vercel)

Canlı ortamda mutlaka ayarlayın:

| Değişken | Yerel | Canlı |
|----------|--------|--------|
| `NEXT_PUBLIC_SITE_URL` | (opsiyonel) | **`https://feelcreativestudio.com`** (paylaşım linkleri) |
| `NEXTAUTH_URL` | `http://localhost:3000` | **`https://feelcreativestudio.com`** |
| `NEXTAUTH_SECRET` | (örn. openssl rand -base64 32) | **Aynı veya yeni güçlü secret** |
| `DATABASE_URL` | localhost DB | **Canlı PostgreSQL bağlantı dizesi** |

- Giriş ve admin paneli çalışması için `NEXTAUTH_URL` canlıda **https://feelcreativestudio.com** olmalı (sonunda `/` yok).
- `trustHost: true` zaten açık; domain üzerinden giriş çalışır.

### 2. Vercel ile yayına alma

1. Projeyi GitHub’a push edin, Vercel’e bağlayın.
2. **Settings → Environment Variables** bölümüne girin:
   - `NEXTAUTH_URL` = `https://feelcreativestudio.com`
   - `NEXTAUTH_SECRET` = (güçlü bir secret)
   - `DATABASE_URL` = canlı PostgreSQL URL (Vercel Postgres veya dış DB)
3. **Settings → Domains** → **Add** → `feelcreativestudio.com` ve isterseniz `www.feelcreativestudio.com`.
4. Domain sağlayıcınızda (GoDaddy, Cloudflare, vb.) DNS’te:
   - Vercel’in verdiği **A** veya **CNAME** kaydını ekleyin (Vercel ekranında yazan değerleri kullanın).

### 3. Build ve çalıştırma

```bash
npm run build
npm run start
```

Yerelde test için canlı ortam değişkenleriyle:

```bash
# .env.production.local veya canlı env
NEXTAUTH_URL=https://feelcreativestudio.com
npm run build && npm run start
```

### 4. Canlıda admin

- Seed ile oluşturulan admin: **admin@izstudio.com** / **admin123** (canlı DB’de seed çalıştırdıysanız).
- Kendi e-postanızı admin yapmak için (canlı DB’ye bağlıyken):  
  `npx tsx scripts/promote-admin.ts your@email.com`
- Giriş: https://feelcreativestudio.com/auth/signin → Giriş sonrası https://feelcreativestudio.com/admin

### 5. Admin değişikliklerinin görünmesi

Site metinleri, örnek videolar veya tema kaydedildiğinde `revalidatePath` ile önbellek temizlenir. Sayfayı yenilediğinizde güncel içerik görünür.
