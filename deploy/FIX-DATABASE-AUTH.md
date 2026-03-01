# P1000: Authentication failed — Veritabanı giriş hatası

Bu hata sunucuda `.env` içindeki `DATABASE_URL` şifresinin, PostgreSQL’deki `izstudio` kullanıcısının şifresiyle aynı olmadığı (veya kullanıcının hiç olmadığı) anlamına gelir.

## Adım adım çözüm

### 1. Sunucuya bağlan

```powershell
ssh root@38.242.143.93
```

### 2. Proje klasörüne gir ve script’i çalıştır

Kullanacağın şifreyi kendin belirle (örnek: `YourSecureDbPassword123`). **Şifrede tek tırnak (`'`) kullanma.**

```bash
cd /var/www/feelstudio
bash deploy/fix-db-credentials.sh 'YourSecureDbPassword123'
```

(Belirtmezsen varsayılan şifre `izstudio123` kullanılır.)

### 3. .env içinde aynı şifreyi kullan

Sunucuda:

```bash
nano .env
```

`DATABASE_URL` satırını, az önce kullandığın şifreyle aynı olacak şekilde düzenle:

```env
DATABASE_URL="postgresql://izstudio:YourSecureDbPassword123@localhost:5432/izstudio?schema=public"
```

Kaydet: `Ctrl+O`, Enter, `Ctrl+X`.

### 4. Migrate + seed + restart

Sunucuda (aynı SSH oturumunda):

```bash
cd /var/www/feelstudio
npx prisma migrate deploy
npx prisma db seed
pm2 restart feelstudio
```

### 5. Siteyi kontrol et

Tarayıcıda https://feelcreativestudio.com/products sayfasını yenile; paketler listelenmeli.

---

**İpucu:** Bir daha aynı hatayı alırsan, sunucuda `.env` içindeki şifre ile PostgreSQL’deki şifrenin birebir aynı olduğundan emin ol. Şifreyi değiştirdiysen hem `fix-db-credentials.sh` ile PostgreSQL’i hem de `.env` dosyasını güncelle.
