import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rm } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const AUTO_DELETE_DAYS = 14

export async function GET(req: NextRequest) {
  try {
    const secret = req.nextUrl.searchParams.get("secret")
    const expectedSecret = process.env.CLEANUP_SECRET
    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - AUTO_DELETE_DAYS)

    const expiredOrders = await prisma.order.findMany({
      where: {
        status: { in: ["DELIVERED", "CANCELLED"] },
        updatedAt: { lt: cutoffDate },
      },
      select: { id: true, orderCode: true },
    })

    if (expiredOrders.length === 0) {
      return NextResponse.json({ deleted: 0, message: "Silinecek sipariş yok" })
    }

    const orderIds = expiredOrders.map((o) => o.id)

    await prisma.mediaAsset.deleteMany({ where: { orderId: { in: orderIds } } })
    await prisma.orderBrief.deleteMany({ where: { orderId: { in: orderIds } } })
    await prisma.orderShippingAddress.deleteMany({ where: { orderId: { in: orderIds } } })
    await prisma.deliveryAsset.deleteMany({ where: { orderId: { in: orderIds } } })
    await prisma.revisionRequest.deleteMany({ where: { orderId: { in: orderIds } } })
    await prisma.shipment.deleteMany({ where: { orderId: { in: orderIds } } })
    await prisma.qrLink.deleteMany({ where: { orderId: { in: orderIds } } })
    await prisma.order.deleteMany({ where: { id: { in: orderIds } } })

    for (const order of expiredOrders) {
      const uploadDir = join(process.cwd(), "public", "uploads", order.orderCode)
      if (existsSync(uploadDir)) {
        await rm(uploadDir, { recursive: true, force: true }).catch(() => {})
      }
    }

    console.log(`[Cleanup] ${expiredOrders.length} sipariş silindi:`, expiredOrders.map((o) => o.orderCode).join(", "))

    return NextResponse.json({
      deleted: expiredOrders.length,
      orderCodes: expiredOrders.map((o) => o.orderCode),
    })
  } catch (error: any) {
    console.error("[Cleanup] Hata:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
