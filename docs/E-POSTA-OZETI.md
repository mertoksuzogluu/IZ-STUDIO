# Ne Zaman Mail Gidiyor? İçerikler ve Nasıl Görürsün?

Tüm mailler **no-reply@feelcreativestudio.com** adresinden gider.

---

## 1. Hoş geldin maili

**Ne zaman:** Biri sitede **Kayıt ol** (signup) yaptığında.

**Konu:** `Feel Studio'ya Hoş Geldiniz!`

**İçerik (metin):**
```
Merhaba [İsim veya "Değerli Müşterimiz"],

Feel Studio'ya hoş geldiniz! 🎬

Sevdiklerinizin hayatında izler bırakın. Sinematik kısa filmlerimizle özel anlarınızı ölümsüzleştirin.

Hikâyenizi anlatmaya hazır mısınız?

Paketlerimizi incelemek için: https://feelcreativestudio.com/products

Sorularınız için bize ulaşabilirsiniz.

Sevgiyle,
Feel Studio Ekibi
```

**Kod:** `app/api/auth/signup/route.ts` → `lib/email.ts` → `sendWelcomeEmail`

---

## 2. Şifre sıfırlama maili

**Ne zaman:** Biri **Şifremi unuttum** deyip e-posta girdiğinde (forgot-password).

**Konu:** `Feel Studio — Şifre sıfırlama`

**İçerik (metin):**
```
Merhaba,

Feel Studio hesabınız için şifre sıfırlama talebinde bulundunuz.

Aşağıdaki linke tıklayarak yeni şifrenizi belirleyebilirsiniz. Link 1 saat geçerlidir.

[SIFIRLAMA_LINKI]

Bu talebi siz yapmadıysanız bu e-postayı dikkate almayın.

Feel Studio
```

**Kod:** `app/api/auth/forgot-password/route.ts` → `lib/email.ts` → `sendPasswordResetEmail`

---

## 3. Sipariş durumu maili

**Ne zaman:** Admin panelden bir siparişin **durumu güncellendiğinde** (RECEIVED, IN_PRODUCTION, PREVIEW_READY, REVISION, FINALIZING, DELIVERED, CANCELLED).

**Konu:** `Sipariş [ORDER_CODE] - Durum: [Durum adı]`  
Örnek: `Sipariş ABC123 - Durum: Üretimde`

**İçerik (metin):**
```
Merhaba,

Siparişinizin ([ORDER_CODE]) durumu güncellendi.

Yeni durum: [Durum adı]

Detayları görmek için hesabınızdan siparişlerim sayfasını ziyaret edebilirsiniz: https://feelcreativestudio.com/dashboard

Feel Studio
```

**Kod:** `app/api/admin/orders/[orderCode]/route.ts` (PATCH) → `lib/email.ts` → `sendOrderStatusEmail`

---

## Nasıl görürsün?

| Nerede görürsün | Açıklama |
|-----------------|----------|
| **Alıcının gelen kutusu** | Kayıt olan / şifre sıfırlayan / siparişi olan kullanıcının e-posta kutusu (ve spam klasörü). |
| **Sunucu logları** | `pm2 logs feelstudio` — Başarı: `[Email] Hoş geldin maili gönderildi: ...` — Hata: `[Email] Hoş geldin maili HATA: ...` |
| **İçerikleri değiştirmek** | `lib/email.ts` dosyasındaki ilgili `subject` ve `text` metinlerini düzenle, deploy edip `pm2 restart feelstudio` yap. |

---

## Özet tablo

| Tetikleyen | Konu | Alıcı |
|------------|------|--------|
| Kayıt ol | Feel Studio'ya Hoş Geldiniz! | Yeni kayıt olan |
| Şifremi unuttum | Feel Studio — Şifre sıfırlama | Talep eden |
| Admin sipariş durumu günceller | Sipariş [kod] - Durum: [durum] | Sipariş sahibi |
