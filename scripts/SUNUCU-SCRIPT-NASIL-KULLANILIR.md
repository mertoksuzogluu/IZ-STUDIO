# Sunucu SMTP kontrol script'i

## 1. Script: `sunucu-smtp-kontrol.ps1`

Bu script **senin bilgisayarından** sunucuya SSH ile bağlanıp sunucudaki projede `node scripts/check-smtp-env.js` çalıştırır. Yani sunucudaki SMTP env’leri sunucuda kontrol etmiş olursun.

## 2. Tek sefer ayar

Script’i aç (`scripts/sunucu-smtp-kontrol.ps1`) ve **en üstteki** şu üç satırı kendi sunucuna göre düzenle:

```powershell
$REMOTE_HOST = "sunucu-ip-veya-domain"    # örn: 123.45.67.89 veya feelcreativestudio.com
$REMOTE_USER = "root"                      # örn: root, ubuntu
$REMOTE_PATH = "/root/iz-studio"           # sunucudaki iz-studio klasörü
```

- **REMOTE_HOST:** Sunucu IP’si veya domain (örn. `feelcreativestudio.com`).
- **REMOTE_USER:** SSH kullanıcı adın (root, ubuntu, vs.).
- **REMOTE_PATH:** Sunucuda projenin tam yolu (örn. `/var/www/iz-studio` veya `~/iz-studio`).

Kaydedip kapat.

## 3. Çalıştırma

PowerShell’i aç ve:

```powershell
cd C:\Users\merto\iz-studio
.\scripts\sunucu-smtp-kontrol.ps1
```

İlk seferde “script çalıştırılamıyor” derse:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

sonra tekrar `.\scripts\sunucu-smtp-kontrol.ps1` dene.

## 4. SSH şifre / anahtar

- Sunucuda **şifreyle** giriş yapıyorsan: Komut çalışınca SSH şifreyi sorar, yazıp Enter’a bas.
- **Anahtar (key)** kullanıyorsan: Önce anahtarın ayarlı olduğundan emin ol (örn. `~/.ssh/id_rsa`); script aynı şekilde `ssh $REMOTE_USER@$REMOTE_HOST ...` kullanır.

## 5. Çıktı

Script sunucudaki kontrolün çıktısını aynen gösterir:

- Hepsi **VAR** → Sunucuda SMTP env’ler tamam.
- Bir şey **YOK** → Sunucuda proje kökündeki `.env` dosyasına SMTP satırlarını ekle, sonra `pm2 restart feelstudio` yap.

Sunucuya elle bağlanıp komut yazmak istemezsen bu script’i kullanman yeterli; bağlanma dahil hepsi bu script’te.
