# Paketler veritabanında var ama sitede "Listelenemiyor" çıkıyorsa

Seed başarılı ama `/products` sayfası hâlâ boşsa, çalışan Next.js uygulaması farklı bir veritabanına bağlanıyor olabilir. Next.js önce `.env`, sonra `.env.local` yükler; **`.env.local` içindeki `DATABASE_URL` öne geçer.**

## 1. Sunucuda .env.local kontrolü

SSH ile bağlanıp:

```bash
cd /var/www/feelstudio
grep DATABASE_URL .env .env.local 2>/dev/null || true
```

İkisi de çıkacak. **İkisindeki bağlantı dizesi birebir aynı olmalı** (özellikle şifre). Farklıysa veya `.env.local` eski/yanlış şifre içeriyorsa düzeltin:

```bash
nano .env.local
```

- Ya `DATABASE_URL` satırını silin (o zaman `.env` geçerli olur),
- Ya da `.env` ile aynı değeri yazın:  
  `DATABASE_URL="postgresql://izstudio:SIFRENIZ@localhost:5432/izstudio?schema=public"`

Kaydedip çıkın: `Ctrl+O`, Enter, `Ctrl+X`.

## 2. PM2 yeniden başlatma

Env değişince uygulamanın yeniden okuması için:

```bash
cd /var/www/feelstudio
pm2 restart feelstudio
```

## 3. Loglara bakma

Hâlâ boşsa, uygulama tarafındaki hatayı görmek için:

```bash
pm2 logs feelstudio --lines 80
```

"Products page DB error" veya "P1000" / "P1001" gibi satırlar bağlantı/veritabanı hatasını gösterir.

## 4. Özet

- **Sebep:** `.env.local` içinde farklı/yanlış `DATABASE_URL` → uygulama boş veya hatalı DB’ye gidiyor.
- **Çözüm:** `.env` ile aynı `DATABASE_URL` kullanın (veya `.env.local`’dan kaldırın), sonra `pm2 restart feelstudio`.
