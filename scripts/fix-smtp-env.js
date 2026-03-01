#!/usr/bin/env node
/**
 * SMTP env kontrolü + eksikse .env'e Turkticaret ayarlarını yazar.
 * Sunucuda çalıştır:  node scripts/fix-smtp-env.js
 * Şifre ile:          SMTP_PASS="sifren" node scripts/fix-smtp-env.js
 *
 * 1) .env'de SMTP_HOST, SMTP_USER, SMTP_PASS var mı bakar
 * 2) Eksikse Turkticaret bloğunu yazar/günceller (test mailiyle aynı ayarlar)
 * 3) Test maili göndermeyi dener; pm2 restart önerir
 */
const path = require("path")
const fs = require("fs")
const readline = require("readline")

const root = path.join(__dirname, "..")
const envPath = path.join(root, ".env")

// Test mailinde kullanılan ayarlar (setup-smtp-env.js ile aynı)
const SMTP_BLOCK = `# SMTP - Turkticaret (no-reply@feelcreativestudio.com)
SMTP_HOST="smtp.turkticaret.net"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="no-reply@feelcreativestudio.com"
SMTP_PASS="__SMTP_PASS__"
EMAIL_FROM="Feel Studio <no-reply@feelcreativestudio.com>"
`

function loadEnv(file) {
  const p = path.join(root, file)
  if (!fs.existsSync(p)) return
  const content = fs.readFileSync(p, "utf8")
  content.split("\n").forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*["']?([^"'\n]*)["']?\s*$/)
    if (m) process.env[m[1]] = m[2].trim()
  })
}

function loadExistingEnv() {
  const out = {}
  if (!fs.existsSync(envPath)) return out
  const content = fs.readFileSync(envPath, "utf8")
  content.split("\n").forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*["']?([^"'\n]*)["']?\s*$/)
    if (m) out[m[1]] = m[2].trim()
  })
  return out
}

function stripSmtpBlock(content) {
  const lines = content.split("\n")
  const out = []
  let skip = false
  for (const line of lines) {
    if (/^#\s*SMTP\s*-/.test(line) || line.startsWith("SMTP_") || line.startsWith("EMAIL_FROM=")) {
      if (/^#\s*SMTP\s*-/.test(line)) skip = true
      if (skip) {
        if (line.startsWith("EMAIL_FROM=")) skip = false
        continue
      }
    } else {
      skip = false
    }
    out.push(line)
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim()
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans ? ans.trim() : "") }))
}

async function main() {
  loadEnv(".env.local")
  loadEnv(".env")

  const required = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"]
  const optional = ["SMTP_PORT", "SMTP_SECURE", "EMAIL_FROM"]
  const allVars = [...required, ...optional]
  const missing = allVars.filter((n) => !process.env[n] || String(process.env[n]).trim() === "")
  const requiredMissing = required.filter((n) => !process.env[n] || String(process.env[n]).trim() === "")

  console.log("Proje kökü:", root)
  console.log(".env dosyası:", envPath)
  console.log("")
  console.log("SMTP env kontrolü:")
  for (const name of allVars) {
    const value = process.env[name]
    const status = value && value.length > 0 ? "VAR" : "YOK"
    console.log("  " + name + ": " + status)
  }
  console.log("")

  if (requiredMissing.length === 0) {
    console.log("Sonuç: Tüm gerekli SMTP ayarları tanımlı.")
    console.log("Test maili göndermek için: node scripts/test-email-send.js [alici@mail.com]")
    console.log("Uygulama env alıyorsa: pm2 restart feelstudio  (veya sunucudaki uygulama adı)")
    return
  }

  console.log("Eksik: " + requiredMissing.join(", ") + " – .env güncelleniyor (Turkticaret ayarları)...")
  const existing = loadExistingEnv()
  let pass = process.env.SMTP_PASS || existing.SMTP_PASS
  if (!pass) {
    pass = await ask("SMTP şifresi (no-reply@feelcreativestudio.com): ")
    if (!pass) {
      console.error("SMTP_PASS boş. .env güncellenmedi. Sunucuda şu komutla tekrar dene:")
      console.error('  SMTP_PASS="mail_sifren" node scripts/fix-smtp-env.js')
      process.exit(1)
    }
  }

  const block = SMTP_BLOCK.replace("__SMTP_PASS__", pass.replace(/"/g, '\\"'))
  let content = ""
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, "utf8")
    content = stripSmtpBlock(content)
  }
  const insert = (content ? "\n\n" : "") + block.trim() + "\n"
  fs.writeFileSync(envPath, content + insert, "utf8")
  console.log(".env güncellendi. SMTP (Turkticaret) satırları eklendi.")
  console.log("")
  console.log("Sonraki adımlar:")
  console.log("  1. Test maili: node scripts/test-email-send.js")
  console.log("  2. Uygulamayı yeniden başlat: pm2 restart feelstudio")
  console.log("  3. Siteden 'Şifremi unuttum' dene.")
}

main().catch((e) => { console.error(e); process.exit(1) })