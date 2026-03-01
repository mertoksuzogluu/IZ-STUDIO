import path from "path"
import { config } from "dotenv"

// Seed çalıştırılırken DATABASE_URL için .env / .env.local yükle
config({ path: path.resolve(process.cwd(), ".env") })
config({ path: path.resolve(process.cwd(), ".env.local") })

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create demo user (skip if DB not ready or table missing)
  try {
    const demoPassword = await bcrypt.hash("demo123", 10)
    const demoUser = await prisma.user.upsert({
      where: { email: "demo@izstudio.com" },
      update: {},
      create: {
        email: "demo@izstudio.com",
        name: "Demo Kullanıcı",
        role: "user",
      },
    })

    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: "credentials",
          providerAccountId: demoUser.id,
        },
      },
      update: { password: demoPassword },
      create: {
        userId: demoUser.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: demoUser.id,
        password: demoPassword,
      },
    })

    console.log("✅ Demo user created: demo@izstudio.com / demo123")
  } catch (userErr) {
    console.warn("⚠️ Demo user skip:", (userErr as Error).message)
  }

  // Admin kullanıcı (panel girişi) — ayrı try ile demo hata verse bile oluşturulur
  try {
    const adminPassword = await bcrypt.hash("admin123", 10)
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@izstudio.com" },
      update: {},
      create: {
        email: "admin@izstudio.com",
        name: "Admin",
        role: "admin",
      },
    })

    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: "credentials",
          providerAccountId: adminUser.id,
        },
      },
      update: { password: adminPassword },
      create: {
        userId: adminUser.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: adminUser.id,
        password: adminPassword,
      },
    })

    console.log("✅ Admin: admin@izstudio.com / admin123")
  } catch (adminErr) {
    console.warn("⚠️ Admin user skip:", (adminErr as Error).message)
  }

  // Varsayılan paketler (30, 60, 100 sn). Fiyatları admin panelden değiştirebilirsiniz; sitede anında güncellenir.
  const askProduct = await prisma.product.upsert({
    where: { slug: "ask" },
    update: {},
    create: {
      slug: "ask",
      name: "Aşk",
      description: "Aşk hikâyenizi sinematik bir dille anlatıyoruz.",
      isPhysical: false,
      active: true,
      tiers: {
        create: [
          { name: "30 Saniye", priceTRY: 6900, durationSec: 30, active: true },
          { name: "60 Saniye", priceTRY: 9900, durationSec: 60, active: true },
          { name: "100 Saniye", priceTRY: 14900, durationSec: 100, active: true },
        ],
      },
    },
  })

  const hatiraProduct = await prisma.product.upsert({
    where: { slug: "hatira" },
    update: {},
    create: {
      slug: "hatira",
      name: "Hatıra",
      description: "Eski fotoğraflarınızdan canlanan anılar.",
      isPhysical: false,
      active: true,
      tiers: {
        create: [
          { name: "30 Saniye", priceTRY: 6900, durationSec: 30, active: true },
          { name: "60 Saniye", priceTRY: 9900, durationSec: 60, active: true },
          { name: "100 Saniye", priceTRY: 14900, durationSec: 100, active: true },
        ],
      },
    },
  })

  const cocukProduct = await prisma.product.upsert({
    where: { slug: "cocuk" },
    update: {},
    create: {
      slug: "cocuk",
      name: "Çocuk",
      description: "Çocuğunuzun büyüme hikayesini ölümsüzleştirin.",
      isPhysical: true,
      active: true,
      tiers: {
        create: [
          { name: "30 Saniye", priceTRY: 6900, durationSec: 30, active: true },
          { name: "60 Saniye", priceTRY: 9900, durationSec: 60, active: true },
          { name: "100 Saniye", priceTRY: 14900, durationSec: 100, active: true },
          {
            name: "100 Saniye Fiziksel",
            priceTRY: 14900,
            durationSec: 100,
            physicalVariant: "premium_box",
            active: true,
          },
        ],
      },
    },
  })

  // Her ürün için 30, 60, 100 saniyelik dijital tier'ların hep olmasını sağla
  const standardTiers = [
    { name: "30 Saniye", priceTRY: 6900, durationSec: 30 },
    { name: "60 Saniye", priceTRY: 9900, durationSec: 60 },
    { name: "100 Saniye", priceTRY: 14900, durationSec: 100 },
  ]
  for (const productSlug of ["ask", "hatira", "cocuk"]) {
    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
      include: { tiers: true },
    })
    if (!product) continue

    for (const std of standardTiers) {
      const existing = product.tiers.find(
        (t) => t.durationSec === std.durationSec && !t.physicalVariant
      )
      if (existing) {
        await prisma.packageTier.update({
          where: { id: existing.id },
          data: {
            name: std.name,
            priceTRY: std.priceTRY,
            durationSec: std.durationSec,
            active: true,
          },
        })
      } else {
        await prisma.packageTier.create({
          data: {
            productId: product.id,
            name: std.name,
            priceTRY: std.priceTRY,
            durationSec: std.durationSec,
            physicalVariant: null,
            active: true,
          },
        })
      }
    }
  }

  console.log("✅ Products created:", {
    ask: askProduct.id,
    hatira: hatiraProduct.id,
    cocuk: cocukProduct.id,
  })

  console.log("🎉 Seeding completed!")
}

main()
  .catch((e: unknown) => {
    console.error("❌ Seeding failed:", e)
    if (e && typeof e === "object" && "message" in e) console.error("Message:", (e as Error).message)
    if (e && typeof e === "object" && "meta" in e) console.error("Meta:", (e as { meta?: unknown }).meta)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

