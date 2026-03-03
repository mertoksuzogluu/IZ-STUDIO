/**
 * Tüm siparişleri ve ilişkili kayıtları siler.
 * Sunucuda çalıştırın: cd /var/www/feelstudio && node scripts/clear-all-orders.cjs
 * .env.local içindeki DATABASE_URL kullanılır.
 */
const path = require("path")
const fs = require("fs")

// Önce .env.local yükle (Prisma'dan önce)
const envPath = path.resolve(process.cwd(), ".env.local")
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8")
  content.split("\n").forEach((line) => {
    const m = line.match(/^\s*([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "")
  })
}

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  console.log("Siparişler ve ilişkili veriler siliniyor...")
  await prisma.qrLink.deleteMany({})
  await prisma.shipment.deleteMany({})
  await prisma.deliveryAsset.deleteMany({})
  await prisma.revisionRequest.deleteMany({})
  await prisma.mediaAsset.deleteMany({})
  await prisma.orderShippingAddress.deleteMany({})
  await prisma.orderBrief.deleteMany({})
  const r = await prisma.order.deleteMany({})
  console.log("Tamamlandı. Silinen sipariş sayısı:", r.count)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
