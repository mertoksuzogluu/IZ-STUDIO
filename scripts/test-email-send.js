#!/usr/bin/env node
/**
 * Test e-postası gönderir. SMTP'nin gerçekten çalıştığını doğrular.
 *
 * Kullanım:
 *   node scripts/test-email-send.js
 *   node scripts/test-email-send.js alici@example.com
 *
 * Alıcı vermezsen test maili hktntrkmngl13@gmail.com adresine gider (veya TEST_EMAIL_TO env).
 * Yerelde: .env.local otomatik yüklenir. Sunucuda: .env kullanılır.
 */
const path = require("path")
const fs = require("fs")

let nodemailer
try {
  nodemailer = require("nodemailer")
} catch (e) {
  console.error("HATA: nodemailer bulunamadi. Sunucuda:  cd " + path.join(__dirname, "..") + "  ve  npm install  calistirin.")
  process.exit(1)
}

const root = path.join(__dirname, "..")
function loadEnv(file) {
  const p = path.join(root, file)
  if (!fs.existsSync(p)) return
  const content = fs.readFileSync(p, "utf8")
  content.split("\n").forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*["']?([^"'\n]*)["']?\s*$/)
    if (m) process.env[m[1]] = m[2].trim()
  })
}
loadEnv(".env.local")
loadEnv(".env")

const to = process.argv[2] || process.env.TEST_EMAIL_TO || "hktntrkmngl13@gmail.com"
const host = process.env.SMTP_HOST
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS
const port = parseInt(process.env.SMTP_PORT || "587", 10)
const secure = process.env.SMTP_SECURE === "true" || port === 465
const from = process.env.EMAIL_FROM || "Feel Studio <no-reply@feelcreativestudio.com>"

if (!host || !user || !pass) {
  console.error("HATA: SMTP ayarlari eksik. .env veya .env.local icinde SMTP_HOST, SMTP_USER, SMTP_PASS olmali.")
  process.exit(1)
}

// Sifre uzunlugu (karakter sayisi) - kesilme var mi diye kontrol icin (deger gosterilmez)
if (process.argv.includes("--debug")) {
  console.log("  [debug] SMTP_PASS uzunluk:", pass.length, "karakter")
}

const options = {
  host,
  port,
  secure,
  auth: { user, pass },
}
if (port === 587 && !secure) {
  options.requireTLS = true
  options.tls = { rejectUnauthorized: false }
}

let transporter = nodemailer.createTransport(options)

async function main() {
  console.log("SMTP test maili gonderiliyor...")
  console.log("  Alici:", to)
  console.log("  Gonderen:", from)
  console.log("  Port:", port, secure ? "(SSL)" : "(STARTTLS)")
  console.log("")

  // Turkticaret: resmi dokumanda port 465 SSL oneriliyor
  const userVariants = [user]
  if (user.includes("@")) userVariants.push(user.split("@")[0])
  else userVariants.push(user + "@feelcreativestudio.com")

  // Turkticaret dokumani sadece 465 SSL diyor; 587 bazi aglarda ETIMEDOUT veriyor.
  const portsToTry = (host && host.includes("turkticaret")) ? [465] : [465, 587]
  let lastErr = null
  const authMethods = ["LOGIN", "PLAIN"]
  outer: for (const tryUser of userVariants) {
    for (const tryPort of portsToTry) {
      for (const authMethod of authMethods) {
        const opt = {
          host,
          port: tryPort,
          secure: tryPort === 465,
          auth: { user: tryUser, pass },
          authMethod,
        }
        if (tryPort === 587) {
          opt.requireTLS = true
          opt.tls = { rejectUnauthorized: false }
        }
        transporter = nodemailer.createTransport(opt)
        try {
          await transporter.verify()
          console.log("  [OK] SMTP baglanti basarili (kullanici: " + tryUser + ", port " + tryPort + ", auth: " + authMethod + ")")
          lastErr = null
          break outer
        } catch (err) {
          lastErr = err
        }
      }
    }
    if (tryUser !== userVariants[userVariants.length - 1]) {
      console.log("  Kullanici '" + tryUser + "' ile giris basarisiz, diger format deneniyor...")
    }
  }
  if (lastErr) {
    console.error("  [HATA] SMTP baglanti:", lastErr.message)
    if (lastErr.message && lastErr.message.includes("authentication failed")) {
      console.error("")
      console.error("  Turkticaret panelinde kontrol et:")
      console.error("  - no-reply@feelcreativestudio.com icin SMTP / disaridan posta gonderimi acik mi?")
      console.error("  - Ayri bir 'SMTP sifresi' veya 'uygulama sifresi' var mi? Varsa onu SMTP_PASS yap.")
      console.error("  - Webmail ile bu sifreyle giris yapabiliyor musun? (Ayni sifre SMTP icin kullanilir.)")
    }
    process.exit(1)
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: "Feel Studio – SMTP test maili",
      text: `Bu bir test mailidir.\n\nGonderim zamani: ${new Date().toISOString()}\n\nSMTP calisiyor.`,
    })
    console.log("  [OK] Mail gonderildi. MessageID:", info.messageId || "(yok)")
    console.log("")
    console.log("Sonuc: BASARILI. Gelen kutusunu (ve spam) kontrol et.")
  } catch (err) {
    console.error("  [HATA] Mail gonderilemedi:", err.message)
    if (err.response) console.error("  Sunucu yaniti:", err.response)
    process.exit(1)
  }
}

main()
