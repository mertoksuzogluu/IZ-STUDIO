// E-posta yardımcıları — no-reply@feelcreativestudio.com ile gönderim
import nodemailer from "nodemailer"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://feelcreativestudio.com"

/** Gönderen adresi: no-reply@feelcreativestudio.com */
export const EMAIL_FROM =
  process.env.EMAIL_FROM || "Feel Studio <no-reply@feelcreativestudio.com>"

/** Test mailinde kullanılan Turkticaret SMTP varsayılanları (sadece SMTP_PASS zorunlu) */
const SMTP_DEFAULTS = {
  host: "smtp.turkticaret.net",
  port: 465,
  secure: true,
  user: "no-reply@feelcreativestudio.com",
}

function getTransporter(): nodemailer.Transporter | null {
  // pm2 bazen .env yüklemiyor; ilk denemede proje kökünden yükle
  if (typeof process !== "undefined" && !process.env.SMTP_PASS) {
    try {
      const path = require("path")
      require("dotenv").config({ path: path.join(process.cwd(), ".env") })
    } catch {
      /* dotenv yoksa geç */
    }
  }
  const host = process.env.SMTP_HOST || SMTP_DEFAULTS.host
  const user = process.env.SMTP_USER || SMTP_DEFAULTS.user
  const pass = process.env.SMTP_PASS
  if (!pass) {
    console.warn("[Email] SMTP atlanıyor – process.env.SMTP_PASS YOK. Uygulama .env yüklememiş olabilir. Sunucuda: pm2 restart feelstudio")
    return null
  }

  const port = parseInt(process.env.SMTP_PORT || String(SMTP_DEFAULTS.port), 10)
  const secure = process.env.SMTP_SECURE === "true" || port === 465

  const options = {
    host,
    port,
    secure,
    auth: { user, pass },
    ...(port === 587 && !secure
      ? { requireTLS: true as const, tls: { rejectUnauthorized: false } }
      : {}),
  }
  return nodemailer.createTransport(options)
}

/** Çalışan uygulamanın (pm2) SMTP env yükleyip yüklemediğini kontrol etmek için */
export function isSmtpConfigured(): boolean {
  return getTransporter() !== null
}

export async function sendWelcomeEmail(email: string, name: string) {
  const subject = "Feel Studio'ya Hoş Geldiniz!"
  const text = `
Merhaba ${name || "Değerli Müşterimiz"},

Feel Studio'ya hoş geldiniz! 🎬

Sevdiklerinizin hayatında izler bırakın. Sinematik kısa filmlerimizle özel anlarınızı ölümsüzleştirin.

Hikâyenizi anlatmaya hazır mısınız?

Paketlerimizi incelemek için: ${SITE_URL}/products

Sorularınız için bize ulaşabilirsiniz.

Sevgiyle,
Feel Studio Ekibi
  `.trim()

  const transporter = getTransporter()
  if (!transporter) {
    console.warn("[Email] Hoş geldin maili GÖNDERİLMEDİ – SMTP env eksik (SMTP_HOST, SMTP_USER, SMTP_PASS). Alıcı:", email)
    if (process.env.NODE_ENV === "development") {
      console.log("[Email] GELİŞTİRME: Hoş geldin maili atlandı. Canlıda göndermek için .env içinde SMTP_PASS tanımlayın.")
    }
    return { success: false }
  }
  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject,
      text,
    })
    console.log("[Email] Hoş geldin maili gönderildi:", email)
    return { success: true }
  } catch (err) {
    console.error("[Email] Hoş geldin maili HATA:", err)
    return { success: false }
  }
}

/** Şifremi unuttum: sıfırlama linki e-postası */
export async function sendPasswordResetEmail(email: string, resetLink: string) {
  const subject = "Feel Studio — Şifre sıfırlama"
  const text = `
Merhaba,

Feel Studio hesabınız için şifre sıfırlama talebinde bulundunuz.

Aşağıdaki linke tıklayarak yeni şifrenizi belirleyebilirsiniz. Link 1 saat geçerlidir.

${resetLink}

Bu talebi siz yapmadıysanız bu e-postayı dikkate almayın.

Feel Studio
  `.trim()

  const transporter = getTransporter()
  if (!transporter) {
    console.warn("[Email] Şifre sıfırlama maili GÖNDERİLEMEDİ – SMTP yapılandırılmamış (SMTP_HOST, SMTP_USER, SMTP_PASS). Alıcı:", email)
    return { success: false }
  }
  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject,
      text,
    })
    console.log("[Email] Şifre sıfırlama maili GÖNDERİLDİ – alıcı:", email, "messageId:", (info as any).messageId || "(yok)")
    return { success: true }
  } catch (err: any) {
    console.error("[Email] Şifre sıfırlama maili HATA – alıcı:", email, "hata:", err?.message || err, "code:", err?.code, "response:", err?.response)
    return { success: false }
  }
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  RECEIVED: "Sipariş Alındı",
  IN_PRODUCTION: "Üretimde",
  PREVIEW_READY: "Önizleme Hazır",
  REVISION: "Revizyon",
  FINALIZING: "Sonlandırılıyor",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
}

export async function sendOrderStatusEmail(
  toEmail: string,
  orderCode: string,
  newStatus: string
) {
  const statusLabel = ORDER_STATUS_LABELS[newStatus] || newStatus
  const subject = `Sipariş ${orderCode} - Durum: ${statusLabel}`
  const text = `
Merhaba,

Siparişinizin (${orderCode}) durumu güncellendi.

Yeni durum: ${statusLabel}

Detayları görmek için hesabınızdan siparişlerim sayfasını ziyaret edebilirsiniz: ${SITE_URL}/dashboard

Feel Studio
  `.trim()

  const transporter = getTransporter()
  if (transporter) {
    try {
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: toEmail,
        subject,
        text,
      })
      return { success: true }
    } catch (err) {
      console.error("Order status email send error:", err)
      return { success: false }
    }
  }

  console.log("[Email] SMTP yapılandırılmamış; sipariş durumu e-postası loglandı:", toEmail, orderCode, statusLabel)
  return { success: true }
}
