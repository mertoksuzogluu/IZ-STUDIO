/**
 * E-posta kayıtlı mı kontrol eder.
 * Kullanım: npx tsx scripts/check-email.ts <email>
 */
import "dotenv/config"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]?.trim().toLowerCase()
  if (!email) {
    console.error("Kullanım: npx tsx scripts/check-email.ts <email>")
    process.exit(1)
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    include: {
      accounts: { select: { type: true, provider: true } },
    },
  })

  if (!user) {
    console.log("Bu e-posta kayıtlı değil.")
    return
  }

  console.log("Kayıtlı:")
  console.log("  E-posta:", user.email)
  console.log("  Ad:", user.name ?? "(yok)")
  console.log("  Rol:", user.role)
  console.log("  Hesaplar:", user.accounts.length ? user.accounts.map((a) => `${a.provider}/${a.type}`).join(", ") : "(yok)")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())