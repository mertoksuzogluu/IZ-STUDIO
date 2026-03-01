// Admin şifresini sıfırlar. Sunucuda: node scripts/reset-admin-pw.js
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, "..", ".env") })
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") })

const bcrypt = require("bcryptjs")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || "admin@izstudio.com"
  const newPassword = process.argv[3] || "admin123"

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  })

  if (!user) {
    console.error("Kullanici bulunamadi:", email)
    process.exit(1)
  }

  const hash = await bcrypt.hash(newPassword, 10)
  await prisma.account.updateMany({
    where: { userId: user.id, type: "credentials" },
    data: { password: hash },
  })
  await prisma.user.update({
    where: { id: user.id },
    data: { role: "admin" },
  })

  console.log("Sifre sifirlandi:", email, "/", newPassword)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error("Hata:", e.message)
  process.exit(1)
})
