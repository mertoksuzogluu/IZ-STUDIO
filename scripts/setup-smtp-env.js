#!/usr/bin/env node
/**
 * .env dosyasina Turkticaret SMTP satirlarini yazar veya gunceller.
 * Sifre script icinde YOK: calistirirken sorulur veya SMTP_PASS env ile verilir.
 *
 * Yerelde:  node scripts/setup-smtp-env.js
 * Sunucuda: SMTP_PASS="sifren" node scripts/setup-smtp-env.js
 *           veya  node scripts/setup-smtp-env.js  (sifre sorar)
 */
const path = require("path")
const fs = require("fs")
const readline = require("readline")

const root = path.join(__dirname, "..")
const envPath = path.join(root, ".env")

const SMTP_BLOCK = `
# SMTP - Turkticaret (no-reply@feelcreativestudio.com)
SMTP_HOST="smtp.turkticaret.net"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="no-reply@feelcreativestudio.com"
SMTP_PASS="__SMTP_PASS__"
EMAIL_FROM="Feel Studio <no-reply@feelcreativestudio.com>"
`

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
        if (line.startsWith("EMAIL_FROM=")) { skip = false }
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
  let pass = process.env.SMTP_PASS || loadExistingEnv().SMTP_PASS
  if (!pass) {
    pass = await ask("SMTP sifresi (no-reply@feelcreativestudio.com): ")
    if (!pass) {
      console.error("SMTP_PASS bos birakildi. .env guncellenmedi.")
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
  console.log(".env guncellendi. SMTP (Turkticaret) satirlari eklendi.")
  console.log("Dosya:", envPath)
}

main().catch((e) => { console.error(e); process.exit(1) })
