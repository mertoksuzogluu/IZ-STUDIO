import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { paymentProvider } from "@/lib/payment"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://feelcreativestudio.com"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderCode } = await req.json()

    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: {
        user: true,
        product: true,
        tier: true,
        brief: true,
      },
    })

    if (!order || order.userId !== session.user.id || !order.user) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ error: "Order already paid" }, { status: 400 })
    }

    const callbackUrl = `${SITE_URL}/api/payment/callback?orderCode=${orderCode}`

    const customerIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1"

    const { paymentUrl, paymentId, token } = await paymentProvider.initiatePayment({
      orderCode: order.orderCode,
      amount: order.totalPriceTRY,
      currency: "TRY",
      customerEmail: order.user.email,
      customerName: order.user.name || undefined,
      customerPhone: order.phoneNumber || undefined,
      customerIp,
      returnUrl: callbackUrl,
      basketItems: [
        {
          id: order.tierId,
          name: `${order.product?.name || "Feel Studio"} — ${order.tier?.name || "Paket"}`,
          category: "Video Prodüksiyon",
          price: order.totalPriceTRY,
          type: order.physicalPackage ? "PHYSICAL" : "VIRTUAL",
        },
      ],
    })

    if (token) {
      await prisma.order.update({
        where: { id: order.id },
        data: { adminNotes: `iyzico_token:${token}` },
      })
    }

    return NextResponse.json({ paymentUrl, paymentId })
  } catch (error: any) {
    console.error("Payment initiation error:", error)
    return NextResponse.json(
      { error: error.message || "Ödeme başlatılamadı" },
      { status: 500 }
    )
  }
}
