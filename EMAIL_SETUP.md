# Email Kurulum Rehberi

## Seçenek 1: Gmail SMTP (Ücretsiz - Test İçin)

### Adımlar:

1. **Gmail'de "App Password" oluşturun:**
   - Google hesabınıza giriş yapın
   - https://myaccount.google.com/apppasswords adresine gidin
   - "App passwords" bölümünde yeni bir şifre oluşturun
   - Bu şifreyi kopyalayın (16 karakterlik)

2. **`.env.local` dosyasını güncelleyin:**

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-16-char-app-password"
SMTP_FROM="your-email@gmail.com"
```

**Not:** Gmail günlük 500 email limiti vardır.

---

## Seçenek 2: Resend (Ücretsiz - Önerilen)

Resend modern bir email servisi, ücretsiz planı var ve çok kolay kurulum.

### Adımlar:

1. **Resend hesabı oluşturun:**
   - https://resend.com adresine gidin
   - Ücretsiz hesap oluşturun (ayda 3,000 email)

2. **API Key alın:**
   - Dashboard'dan API Key oluşturun

3. **NextAuth'u Resend ile yapılandırın:**

`lib/auth.ts` dosyasını güncelleyin:

```typescript
import Resend from "next-auth/providers/email"
import { Resend } from "resend"

// Resend provider ekleyin
EmailProvider({
  server: {
    host: process.env.SMTP_HOST,
    // ... veya Resend SDK kullanın
  },
})
```

Veya daha basit: Resend'in SMTP ayarlarını kullanın:

```env
SMTP_HOST="smtp.resend.com"
SMTP_PORT="587"
SMTP_USER="resend"
SMTP_PASSWORD="your-resend-api-key"
SMTP_FROM="onboarding@resend.dev"  # İlk test için
```

---

## Seçenek 3: SendGrid (Ücretsiz Plan)

1. **SendGrid hesabı oluşturun:**
   - https://sendgrid.com
   - Ücretsiz plan: günde 100 email

2. **SMTP Credentials oluşturun:**
   - Settings > API Keys
   - SMTP Relay ayarlarını alın

3. **`.env.local` güncelleyin:**

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
SMTP_FROM="your-verified-email@example.com"
```

---

## Seçenek 4: Domain ile Profesyonel Email (Production)

Domain satın aldıktan sonra:

1. **Email servisi seçin:**
   - Google Workspace
   - Microsoft 365
   - Zoho Mail (ücretsiz plan var)
   - Resend (domain verify edip kullanabilirsiniz)

2. **DNS kayıtlarını ayarlayın:**
   - MX records
   - SPF records
   - DKIM records

---

## Hızlı Test İçin (Development)

Development için email göndermeden test edebilirsiniz:

1. **Console'da email linkini göster:**
   - NextAuth development modunda email linki console'a yazdırılır

2. **Mock email provider kullanın:**
   - Test için email göndermeden çalışabilir

---

## Öneri

**Development için:** Gmail SMTP (en kolay)
**Production için:** Resend (ücretsiz, modern, kolay)

Resend kullanmak isterseniz, NextAuth yapılandırmasını güncelleyebilirim.

