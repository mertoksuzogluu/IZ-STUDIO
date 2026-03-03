import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

/**
 * Tüm siparişleri siler (ilişkili tablolar cascade ile silinir).
 * Sadece admin. Test siparişlerini temizlemek için kullanın.
 */
export async function POST() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
    }

    // Önce ilişkili tabloları sil (Prisma cascade DB'de tanımlı olmayabilir)
    await prisma.qrLink.deleteMany({})
    await prisma.shipment.deleteMany({})
    await prisma.deliveryAsset.deleteMany({})
    await prisma.revisionRequest.deleteMany({})
    await prisma.mediaAsset.deleteMany({})
    await prisma.orderShippingAddress.deleteMany({})
    await prisma.orderBrief.deleteMany({})
    await prisma.order.deleteMany({})

    return NextResponse.json({ ok: true, message: "Tüm siparişler silindi." })
  } catch (e) {
    console.error("[admin/orders/clear-all]", e)
    return NextResponse.json(
      { error: "Siparişler silinirken hata oluştu." },
      { status: 500 }
    )
  }
}
