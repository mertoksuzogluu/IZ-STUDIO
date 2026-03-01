# Şifre sıfırlama: "Bir hata oluştu" çözümü

Bu hata genelde sunucuda **verification_tokens** tablosunun olmamasından kaynaklanır.

## Sunucuda çalıştır

```bash
cd /var/www/feelstudio
npx prisma db push
```

Bu komut Prisma şemasındaki tüm tabloları (verification_tokens dahil) veritabanında oluşturur veya günceller.

Ardından uygulamayı yeniden başlat:

```bash
pm2 restart feelstudio
```

Sonra tekrar "Şifremi unuttum" sayfasından dene. Artık sayfada API’den gelen **gerçek hata mesajı** da görünecek; farklı bir hata varsa ona göre ilerleyebilirsin.
