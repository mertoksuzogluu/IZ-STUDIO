# Güvenlik

## Şifre ve API anahtarları

- **Asla** `.env`, `.env.local`, `.env.production` veya gerçek şifre içeren dosyaları repoya commit etmeyin.
- Bu dosyalar `.gitignore` ile hariç tutulmuştur; yine de `git status` ile kontrol edin.
- SMTP şifresi, veritabanı şifresi, `NEXTAUTH_SECRET`, iyzico API anahtarları yalnızca ortam değişkenleri veya sunucudaki yerel `.env` dosyasında olmalı.
- Script’leri çalıştırırken şifreleri parametre veya env ile verin; script içine yazmayın.

## Sızıntı durumunda

- E-posta (SMTP) veya veritabanı şifresi repoda göründüyse **hemen değiştirin** (mail paneli ve PostgreSQL’de yeni şifre belirleyin).
- GitHub’da “secret scanning” uyarısı aldıysanız ilgili secret’ı artık geçersiz kabul edin ve yenisini kullanın.
