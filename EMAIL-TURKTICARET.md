# E-posta: Turkticaret (smtp.turkticaret.net) – Adım Adım

Sunucu: **smtp.turkticaret.net**  
E-posta: **no-reply@feelcreativestudio.com**

---

## 1. Mail şifresini hazırla

- Turkticaret panelinden **no-reply@feelcreativestudio.com** hesabının şifresini biliyor olmalısın.
- Hesap yoksa panelden bu adresi oluştur ve şifreyi belirle.

---

## 2. Proje klasöründe .env veya .env.local aç

- **Yerel geliştirme:** `.env.local` kullan (git’e eklenmez).
- **Canlı sunucu:** Sunucudaki `.env` dosyasını düzenle.

Dosya yoksa oluştur; varsa içine aşağıdaki satırları ekle veya güncelle.

---

## 3. Bu satırları ekle / güncelle

Aynen yapıştırıp sadece **şifreyi** kendi şifrenle değiştir:

```env
# E-posta – Turkticaret
SMTP_HOST="smtp.turkticaret.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="no-reply@feelcreativestudio.com"
SMTP_PASS="buraya_gerçek_şifreyi_yaz"
EMAIL_FROM="Feel Studio <no-reply@feelcreativestudio.com>"
```

- `SMTP_PASS` → **no-reply@feelcreativestudio.com** hesabının gerçek şifresi.
- Port **465** kullanıyorsan: `SMTP_PORT="465"` ve `SMTP_SECURE="true"` yap.

---

## 4. Dosyayı kaydet

- `.env.local` veya `.env` dosyasını kaydettikten sonra uygulamanın bu dosyayı okuyacağından emin ol (Next.js varsayılan olarak `.env.local` ve `.env` okur).

---

## 5. Uygulamayı yeniden başlat

- **Yerel:** Geliştirme sunucusunu durdur (Ctrl+C), sonra tekrar `npm run dev`.
- **Canlı (PM2):**  
  `pm2 restart feelstudio`  
  (veya kullandığın uygulama adı neyse onu yaz.)

---

## 6. Test et

1. Sitede yeni bir e-posta ile **kayıt ol**.
2. O e-posta kutusunda **“Feel Studio'ya Hoş Geldiniz!”** konulu maili kontrol et.
3. Gelmemişse:
   - Gereksiz / spam klasörüne bak.
   - Sunucu loglarında `[Email]` veya `Welcome email send error` ara.
   - Turkticaret panelinde bu adresle gönderim / SMTP loglarına bak.

---

## Özet

| Adım | Yapılacak |
|------|------------|
| 1 | no-reply@feelcreativestudio.com şifresini hazırla |
| 2 | `.env.local` (yerel) veya `.env` (canlı) dosyasını aç |
| 3 | Yukarıdaki SMTP satırlarını ekle, `SMTP_PASS`’ı doldur |
| 4 | Kaydet |
| 5 | Uygulamayı yeniden başlat |
| 6 | Kayıt olup hoş geldin mailini test et |

Kod tarafında ekstra bir şey yapmana gerek yok; `lib/email.ts` zaten bu env değişkenlerini kullanıyor.
