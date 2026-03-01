# Contabo VPS’e feelcreativestudio.com Deploy

Ubuntu (22.04) üzerinde Node.js, PostgreSQL, Nginx ve PM2 ile canlıya alma.

---

## 1. VPS’e bağlanın

```bash
ssh root@SUNUCU_IP
# veya: ssh kullanici@SUNUCU_IP
```

---

## 2. Sunucuyu güncelleyin ve temel paketleri kurun

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential
```

---

## 3. Node.js 20 LTS kurun

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # v20.x görmelisiniz
```

---

## 4. PostgreSQL kurun ve veritabanı oluşturun

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# PostgreSQL'e girip kullanıcı ve DB oluşturun
sudo -u postgres psql
```

PostgreSQL içinde:

```sql
CREATE USER izstudio WITH PASSWORD 'GÜÇLÜ_ŞİFRE_BURAYA';
CREATE DATABASE izstudio OWNER izstudio;
\q
```

Bağlantı dizesi örneği (şifreyi kendi şifrenizle değiştirin):

```
postgresql://izstudio:GÜÇLÜ_ŞİFRE_BURAYA@localhost:5432/izstudio?schema=public
```

---

## 5. PM2 kurun (uygulama sürekli çalışsın diye)

```bash
sudo npm install -g pm2
```

---

## 6. Projeyi sunucuya alın

**Seçenek A – GitHub üzerinden (önerilen)**

```bash
cd /var/www   # veya istediğiniz dizin
sudo mkdir -p /var/www
sudo chown $USER:$USER /var/www
cd /var/www
git clone https://github.com/KULLANICI/iz-studio.git feelstudio
cd feelstudio
```

**Seçenek B – Bilgisayarınızdan SCP ile**

Bilgisayarınızda (Windows PowerShell veya WSL):

```powershell
scp -r C:\Users\merto\iz-studio root@SUNUCU_IP:/var/www/feelstudio
```

Sonra sunucuda:

```bash
cd /var/www/feelstudio
```

---

## 7. Ortam değişkenlerini ayarlayın

Sunucuda proje klasöründe:

```bash
cd /var/www/feelstudio
nano .env
```

Aşağıdakileri yapıştırıp kendi değerlerinizle düzenleyin:

```env
DATABASE_URL="postgresql://izstudio:GÜÇLÜ_ŞİFRE_BURAYA@localhost:5432/izstudio?schema=public"
NEXTAUTH_URL="https://feelcreativestudio.com"
NEXTAUTH_SECRET="BURAYA_OPENSSL_ILE_ÜRETTİĞİNİZ_32_KARAKTERLİK_SECRET"
NEXT_PUBLIC_SITE_URL="https://feelcreativestudio.com"
```

Secret üretmek için (bilgisayarınızda veya sunucuda):

```bash
openssl rand -base64 32
```

Çıkan değeri `NEXTAUTH_SECRET` olarak kullanın.

Kaydedip çıkın: `Ctrl+O`, Enter, `Ctrl+X`.

---

## 8. Bağımlılıkları kurun, Prisma ve build

```bash
cd /var/www/feelstudio
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run build
```

Hata almazsanız build tamamlanmış demektir.

---

## 9. PM2 ile uygulamayı başlatın

```bash
cd /var/www/feelstudio
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```
(Ecosystem dosyası yoksa: `pm2 start npm --name "feelstudio" -- start`)

`pm2 startup` çıktısında yazan komutu (sudo ile) çalıştırın ki sunucu yeniden açılsa da uygulama otomatik başlasın.

Kontrol:

```bash
pm2 status
pm2 logs feelstudio
```

Uygulama `http://localhost:3010` üzerinde çalışıyor olmalı.

---

## 10. Nginx kurun ve reverse proxy + SSL

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Nginx site config (projede `deploy/nginx-feelcreativestudio.conf` hazır; domain için kısa rehber: **DOMAIN-SETUP.md**):

```bash
cd /var/www/feelstudio && sudo cp deploy/nginx-feelcreativestudio.conf /etc/nginx/sites-available/feelcreativestudio.com
```

Veya elle: `sudo nano /etc/nginx/sites-available/feelcreativestudio.com`

İçeriği (sunucu IP’nizi yoksa `server_name` yeterli):

```nginx
server {
    listen 80;
    server_name feelcreativestudio.com www.feelcreativestudio.com;
    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Site’i etkinleştirip Nginx’i test edin:

```bash
sudo ln -sf /etc/nginx/sites-available/feelcreativestudio.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

SSL (HTTPS) için:

```bash
sudo certbot --nginx -d feelcreativestudio.com -d www.feelcreativestudio.com
```

E-posta verin, şartları kabul edin. Certbot Nginx’i otomatik güncelleyecek.

---

## 11. DNS ayarları (domain sağlayıcınızda)

feelcreativestudio.com’u satın aldığınız yerde (Contabo Domain, GoDaddy, Cloudflare vb.):

- **A kaydı:** `@` (veya `feelcreativestudio.com`) → Contabo VPS’inizin **IP adresi**
- İsterseniz **www** için de: CNAME `www` → `feelcreativestudio.com` veya yine A ile aynı IP

Birkaç dakika – birkaç saat içinde DNS yayılır.

---

## 12. Kontrol

- Tarayıcıda: **https://feelcreativestudio.com**
- Giriş: **https://feelcreativestudio.com/auth/signin**  
  - admin@izstudio.com / admin123 (seed çalıştırdıysanız)
- Admin panel: **https://feelcreativestudio.com/admin**

---

## Güncelleme (yeni kod atınca)

```bash
cd /var/www/feelstudio
git pull
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart feelstudio
```

---

## Özet

| Adım | Ne yaptık |
|------|-----------|
| 1–3 | SSH, güncelleme, Node.js 20 |
| 4 | PostgreSQL + izstudio kullanıcı/DB |
| 5 | PM2 |
| 6 | Projeyi /var/www/feelstudio’ya aldık |
| 7 | .env (DATABASE_URL, NEXTAUTH_*) |
| 8 | npm install, migrate, seed, build |
| 9 | PM2 start + startup |
| 10 | Nginx reverse proxy + Certbot SSL |
| 11 | Domain DNS → VPS IP |

Bu adımları uyguladığınızda site Contabo VPS’te feelcreativestudio.com olarak çalışır.
