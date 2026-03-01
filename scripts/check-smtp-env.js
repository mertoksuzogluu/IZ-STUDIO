#!/usr/bin/env node
/**
 * Sunucuda SMTP env değişkenlerinin tanımlı olup olmadığını kontrol eder.
 * Şifre veya değer göstermez, sadece "var" / "yok" yazar.
 *
 * Sunucuda çalıştır: node scripts/check-smtp-env.js
 * (Proje kökünde; .env varsa Node otomatik okumaz, PM2/next ortamında yüklüdür.
 *  Yerelde .env.local yüklemek için: npx dotenv -e .env.local -- node scripts/check-smtp-env.js)
 */
const path = require("path")

// .env ve .env.local'ı yükle (Node doğrudan okumaz; PM2/Next ortamında zaten process.env'de olabilir)
const root = path.join(__dirname, "..")
try {
  require("dotenv").config({ path: path.join(root, ".env.local") })
  require("dotenv").config({ path: path.join(root, ".env") })
} catch (_) {}

const vars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "EMAIL_FROM"]
let allOk = true
console.log("Proje kökü:", root)
console.log("SMTP env kontrolü (değerler gösterilmez):\n")
for (const name of vars) {
  const value = process.env[name]
  const status = value && value.length > 0 ? "VAR" : "YOK"
  if (status === "YOK" && (name === "SMTP_HOST" || name === "SMTP_USER" || name === "SMTP_PASS")) allOk = false
  console.log(`  ${name}: ${status}`)
}
console.log("")
if (allOk) {
  console.log("Sonuç: SMTP ayarları tanımlı. Mail gönderimi çalışabilir.")
} else {
  console.log("Sonuç: SMTP_HOST, SMTP_USER, SMTP_PASS mutlaka dolu olmalı.")
  console.log("Sunucudaki .env dosyasına ekleyin (proje kökünde).")
}
