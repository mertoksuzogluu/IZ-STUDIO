#!/usr/bin/env node
/**
 * SMTP bağlantısını ve tek mail gönderimini dener.
 * Kullanım: node scripts/test-smtp.js [test@example.com]
 * .env.local yüklü olmalı (npm run dev ile aynı ortam). Önce: npx dotenv -e .env.local -- node scripts/test-smtp.js alici@mail.com
 * Veya: Windows PowerShell'de .env.local'ı manuel yükleyemiyorsanız, önce "set NODE_ENV=development" ve proje kökünde çalıştırın; Next.js de .env.local okur ama Node doğrudan okumaz.
 * Bu script için dotenv kullanıyoruz.
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env.local") })
const nodemailer = require("nodemailer")

const to = process.argv[2] || process.env.SMTP_USER || "no-reply@feelcreativestudio.com"

const host = process.env.SMTP_HOST
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS
const port = parseInt(process.env.SMTP_PORT || "587", 10)
const secure = process.env.SMTP_SECURE === "true" || port === 465

console.log("SMTP ayarları:", { host, user, port, secure, to })

if (!host || !user || !pass) {
  console.error("Hata: SMTP_HOST, SMTP_USER, SMTP_PASS .env.local içinde olmalı.")
  process.exit(1)
}

const transportOptions = {
  host,
  port,
  secure,
  auth: { user, pass },
}
if (port === 587 && !secure) {
  transportOptions.requireTLS = true
  transportOptions.tls = { rejectUnauthorized: false }
}

const transporter = nodemailer.createTransport(transportOptions)

async function main() {
  try {
    await transporter.verify()
    console.log("SMTP sunucu bağlantısı OK.")
  } catch (e) {
    console.error("SMTP verify hatası:", e.message)
    process.exit(1)
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "Feel Studio <no-reply@feelcreativestudio.com>",
      to,
      subject: "Feel Studio SMTP Test",
      text: "Bu bir test mailidir. SMTP çalışıyor.",
    })
    console.log("Mail gönderildi:", info.messageId)
  } catch (e) {
    console.error("Mail gönderme hatası:", e.message)
    if (e.response) console.error("Sunucu yanıtı:", e.response)
    process.exit(1)
  }
}

main()
