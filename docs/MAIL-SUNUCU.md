# Mail otomasyonu – sunucu ayarı

Hoş geldin, şifre sıfırlama ve sipariş e-postaları **sunucudaki** `.env.local` (veya `.env`) içindeki SMTP bilgileriyle gider. Bu dosya repoda **yoktur**; sadece sunucuda durur. Repodan şifre kaldırmak mail otomasyonunu **kapatmaz**.

## Sunucuda SMTP var mı?

SSH ile sunucuya girip kontrol edin (şifre gösterilmez):

```bash
ssh root@feelcreativestudio.com
cd /var/www/feelstudio
node scripts/check-smtp-env.js
```

Çıktıda `SMTP_PASS: VAR` ve `Sonuç: SMTP ayarları tanımlı` görüyorsanız mail zaten çalışıyordur.

## Şifreyi güncellemek (repoya yazmadan)

Yeni SMTP şifresini **parametre** olarak verin; repoda hiçbir yere yazılmaz:

**Windows (PowerShell):**
```powershell
cd C:\Users\merto\iz-studio
.\deploy\set-email-env.ps1 'YENİ_SMTP_ŞİFRENİZ'
```

Ardından sunucuda uygulamayı yeniden başlatın:
```bash
pm2 restart feelstudio
```

**Sunucuda doğrudan:**
```bash
cd /var/www/feelstudio
bash deploy/set-email-env.sh 'YENİ_SMTP_ŞİFRENİZ'
pm2 restart feelstudio
```

Bu script sunucudaki `.env.local` (veya `.env`) dosyasına SMTP satırlarını yazar/günceller; şifre sadece komut satırında geçer, repoya commit edilmez.

## Özet

| Durum | Ne yapmalı |
|--------|-------------|
| Sunucuda daha önce SMTP ayarladıysanız | Bir şey yapmayın; mail çalışmaya devam eder. |
| Şifre rotasyonu yaptıysanız | Yukarıdaki `set-email-env` ile yeni şifreyi sunucuya yazın, `pm2 restart feelstudio`. |
| Hiç ayarlamadıysanız | `.\deploy\set-email-env.ps1 'mail_sifren'` çalıştırın. |
