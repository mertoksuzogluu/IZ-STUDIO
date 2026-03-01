# E-posta ayarları (Kayıt / Hoş geldin — no-reply@feelcreativestudio.com)

Kayıt sonrası hoş geldin ve sipariş durumu e-postaları **no-reply@feelcreativestudio.com** adresinden gönderilir. Gönderim için sunucuda SMTP yapılandırmanız gerekir.

## 1. Varsayılan gönderen

Kod tarafında varsayılan:

- **Adres:** `no-reply@feelcreativestudio.com`
- **Görünen ad:** Feel Studio  

İsterseniz `.env` ile değiştirebilirsiniz:

```env
EMAIL_FROM="Feel Studio <no-reply@feelcreativestudio.com>"
```

## 2. SMTP yapılandırması (sunucuda)

E-postaların gerçekten gitmesi için sunucudaki `.env` (veya `.env.local`) içinde SMTP bilgilerini doldurun. Örnek (kendi sunucu bilgilerinizle değiştirin):

```env
EMAIL_FROM="Feel Studio <no-reply@feelcreativestudio.com>"
SMTP_HOST="smtp.feelcreativestudio.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="no-reply@feelcreativestudio.com"
SMTP_PASS="bu_hesabin_şifresi"
```

- **SMTP_HOST:** E-posta sağlayıcınızın SMTP sunucusu (örn. Contabo Mail, SendGrid, Mailgun, Gmail SMTP).
- **SMTP_PORT:** Genelde `587` (TLS) veya `465` (SSL). 465 kullanıyorsanız `SMTP_SECURE="true"` yapın.
- **SMTP_USER / SMTP_PASS:** no-reply hesabının giriş bilgileri.

Bu değişkenler **yoksa** uygulama e-postayı göndermez, sadece loglar (geliştirme için uygun).

## 3. Contabo / kendi sunucunuzda posta

feelcreativestudio.com alan adı aynı sunucuda (Contabo vb.) barındırılıyorsa, genelde:

- Panelden **Mail** / **Postfix** ile `no-reply@feelcreativestudio.com` hesabı oluşturulur.
- SMTP: `mail.feelcreativestudio.com` veya `localhost`, port 587; kullanıcı `no-reply@feelcreativestudio.com`, şifre panelde belirlediğiniz.

Farklı bir e-posta sağlayıcısı (SendGrid, Mailgun, Gmail vb.) kullanıyorsanız, onların SMTP bilgilerini yazın.

## 4. Değişiklik sonrası

`.env` değiştirdikten sonra:

```bash
pm2 restart feelstudio
```

## 5. Hangi e-postalar gönderilir?

- **Kayıt sonrası:** Hoş geldin e-postası (link: `NEXT_PUBLIC_SITE_URL/products`, varsayılan feelcreativestudio.com).
- **Sipariş durumu güncellenince:** Müşteriye sipariş kodu ve yeni durum (RECEIVED, IN_PRODUCTION, DELIVERED vb.).

Her iki e-postada da gönderen: **Feel Studio &lt;no-reply@feelcreativestudio.com&gt;**.
