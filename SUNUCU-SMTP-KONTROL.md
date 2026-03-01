# Sunucuda SMTP env kontrolü

## 1. Sunucuda SMTP env’ler var mı?

SSH ile sunucuya bağlan, proje klasörüne gir ve:

```bash
cd /path/to/iz-studio
node scripts/check-smtp-env.js
```

(Proje yolunu kendi sunucundaki ile değiştir; örn. `~/iz-studio` veya ` /var/www/iz-studio`.)

Çıktıda `SMTP_HOST: VAR`, `SMTP_USER: VAR`, `SMTP_PASS: VAR` görüyorsan sunucuda SMTP tanımlı demektir.

**Not:** Script sadece “VAR / YOK” yazar; şifre veya değer göstermez.

---

## 2. “YOK” çıkıyorsa: Sunucudaki .env’e ekle

Sunucuda proje **kök klasöründe** (PM2’nin çalıştırdığı yer) bir `.env` dosyası olmalı. Aynı yerde `package.json`, `ecosystem.config.cjs` vardır.

Bu dosyayı düzenle (örn. `nano .env` veya `vim .env`) ve **şu satırların** olduğundan emin ol (değerleri kendi bilgilerinle doldur):

```env
SMTP_HOST="smtp.turkticaret.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="no-reply@feelcreativestudio.com"
SMTP_PASS="BURAYA_MAIL_ŞİFRESİ"
EMAIL_FROM="Feel Studio <no-reply@feelcreativestudio.com>"
```

- `SMTP_PASS` → no-reply@feelcreativestudio.com hesabının gerçek şifresi.
- Zaten `DATABASE_URL`, `NEXTAUTH_URL` vb. varsa bu SMTP satırlarını **onların altına** ekle; dosyayı bir kez kaydedip kapat.

---

## 3. PM2’nin .env’i okuması

PM2, process’i **proje kökünden** başlattığında genelde o dizindeki `.env` dosyasını **okumaz**; env’ler sistemden veya PM2’den gelir. Bu yüzden iki yol var:

### A) Env’i PM2’e vermek (önerilen)

`ecosystem.config.cjs` içinde `env` ile verebilirsin (şifreyi dosyada tutmak istemiyorsan sadece `env_file` kullan, aşağıda):

```javascript
module.exports = {
  apps: [{
    name: "feelstudio",
    script: "...",
    args: "start",
    cwd: __dirname,
    env_file: ".env",   // bu satırı ekle: kökteki .env dosyasını yükle
    // ...
  }],
}
```

`env_file` PM2 5.x+ ile desteklenir. Yoksa aşağıdaki B yolunu kullan.

### B) .env’i elle yükletmek

`.env` kullanıyorsan ve PM2 env’i okumuyorsa, başlatmayı şöyle yapabilirsin:

```bash
export $(grep -v '^#' .env | xargs)
pm2 start ecosystem.config.cjs
```

Windows sunucu değilse (Linux/WSL) bu işe yarar. Windows’ta PM2 ile env için `ecosystem` içinde `env: { SMTP_HOST: "...", ... }` yazmak gerekir (şifreyi dosyada tutmak istemiyorsan sadece A’daki `env_file`’ı kullan).

---

## 4. Değişiklikten sonra

- .env veya ecosystem’i değiştirdiysen: `pm2 restart feelstudio`
- Tekrar kontrol: `node scripts/check-smtp-env.js` → hepsi VAR olmalı.

Bu adımlarla sunucudaki SMTP ayarlarının dolu olup olmadığından emin olabilirsin.
