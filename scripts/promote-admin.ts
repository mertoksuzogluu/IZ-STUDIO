/**
 * Bir kullanıcıyı admin yapar.
 * Kullanım: npx tsx scripts/promote-admin.ts <email>
 * Örnek: npx tsx scripts/promote-admin.ts admin@izstudio.com
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error("Kullanım: npx tsx scripts/promote-admin.ts <email>")
    process.exit(1)
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  })
  console.log(`✅ ${user.email} artık admin.`)
}

main()
  .catch((e) => {
    if (e.code === "P2025") {
      console.error(`Hata: "${process.argv[2]}" e-postasına sahip kullanıcı bulunamadı.`)
    } else {
      console.error(e)
    }
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
