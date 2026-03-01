# Otomatik e-posta – Ne zaman gider, ne yapman lazım?

## Senin yapman gerekenler (tek sefer)

1. **SMTP ayarlı mı?**  
   `.env.local` içinde `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` dolu olmalı (Turkticaret için script ile ekledik).

2. **Uygulamayı yeniden başlat**  
   Env değişince mutlaka restart:
   - Yerel: `npm run dev` çalışıyorsa durdur (Ctrl+C), tekrar `npm run dev`.
   - Canlı: `pm2 restart feelstudio` (veya kullandığın isim).

Bunlar tamamsa aşağıdaki mailler otomatik gider.

---

## Hangi e-postalar otomatik gidiyor?

| Ne zaman | E-posta |
|----------|--------|
| Biri **kayıt olunca** | Hoş geldin maili (“Feel Studio'ya Hoş Geldiniz!”) |
| Biri **şifremi unuttum** deyip link isterse | Şifre sıfırlama linki |
| Admin **sipariş durumunu güncelleyince** | Müşteriye “Sipariş durumunuz güncellendi” maili |

Kodda ekstra bir şey yapmana gerek yok; hepsi bağlı.

---

## Test etmek için

1. Uygulamayı yeniden başlattıktan sonra siteye git.
2. Yeni bir e-posta ile **Kayıt ol**.
3. O e-posta kutusuna (ve gerekiyorsa spam klasörüne) bak; “Feel Studio'ya Hoş Geldiniz!” maili gelmeli.

Gelmiyorsa sunucu logunda `[Email]` veya `Welcome email send error` ara; SMTP bilgileri yanlışsa orada hata görünür.
