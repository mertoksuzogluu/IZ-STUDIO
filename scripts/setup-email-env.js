#!/usr/bin/env node
/**
 * SMTP (Turkticaret) ayarlarını .env.local dosyasına ekler veya günceller.
 * Şifre script içinde YOK; çalıştırırken verilir.
 *
 * Kullanım:
 *   node scripts/setup-email-env.js "MAIL_ŞİFREN"
 *   SMTP_PASS="MAIL_ŞİFREN" node scripts/setup-email-env.js
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const ENV_LOCAL = path.join(ROOT, '.env.local')
const ENV_EXAMPLE = path.join(ROOT, '.env.local.example')

const SMTP_BLOCK = `# Email (SMTP) – Turkticaret: smtp.turkticaret.net | no-reply@feelcreativestudio.com
SMTP_HOST="smtp.turkticaret.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="no-reply@feelcreativestudio.com"
SMTP_PASS="__SMTP_PASS__"
EMAIL_FROM="Feel Studio <no-reply@feelcreativestudio.com>"
`

function getPassword() {
  const fromEnv = process.env.SMTP_PASS
  if (fromEnv) return fromEnv
  const fromArg = process.argv[2]
  if (fromArg) return fromArg
  console.error('Hata: Şifre verilmedi.')
  console.error('Kullanım: node scripts/setup-email-env.js "MAIL_ŞİFRESİ"')
  console.error('   veya: SMTP_PASS="MAIL_ŞİFRESİ" node scripts/setup-email-env.js')
  process.exit(1)
}

function stripSmtpBlock(content) {
  const lines = content.split('\n')
  const out = []
  let skip = false
  for (const line of lines) {
    if (line.startsWith('# Email (SMTP)') || line.startsWith('SMTP_') || line.startsWith('EMAIL_FROM=')) {
      if (line.startsWith('# Email (SMTP)')) skip = true
      if (skip) {
        if (line.startsWith('EMAIL_FROM=')) { skip = false; continue }
        continue
      }
    } else {
      skip = false
    }
    out.push(line)
  }
  return out.filter(l => l !== '' || out[out.length - 1] !== '').join('\n').replace(/\n{3,}/g, '\n\n')
}

function main() {
  const password = getPassword()
  const block = SMTP_BLOCK.replace('__SMTP_PASS__', password.replace(/"/g, '\\"'))

  let content = ''
  if (fs.existsSync(ENV_LOCAL)) {
    content = fs.readFileSync(ENV_LOCAL, 'utf8')
    content = stripSmtpBlock(content)
  } else if (fs.existsSync(ENV_EXAMPLE)) {
    content = fs.readFileSync(ENV_EXAMPLE, 'utf8')
    content = stripSmtpBlock(content)
  }

  const trimmed = content.trimEnd()
  const insert = (trimmed ? '\n\n' : '') + block
  fs.writeFileSync(ENV_LOCAL, trimmed + insert + '\n', 'utf8')
  console.log('.env.local güncellendi. SMTP ayarları (Turkticaret) eklendi.')
  console.log('Şifre dosyada saklandı; .env.local git\'e eklenmez (.gitignore).')
}

main()
