import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateQrSlug } from "@/lib/utils"

export async function POST(
  req: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderCode = params.orderCode
    const { pinCode } = await req.json()

    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: { tier: { include: { product: true } } },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if physical package (add-on veya ürün fiziksel)
    if (!order.physicalPackage && !order.tier.product.isPhysical) {
      return NextResponse.json(
        { error: "Order is not a physical package" },
        { status: 400 }
      )
    }

    // Create or update QR link
    const qrLink = await prisma.qrLink.upsert({
      where: { orderId: order.id },
      update: {
        isActive: true,
        ...(pinCode && { pinCode }),
      },
      create: {
        orderId: order.id,
        slug: generateQrSlug(),
        isActive: true,
        ...(pinCode && { pinCode }),
      },
    })

    return NextResponse.json({
      slug: qrLink.slug,
      url: `${process.env.NEXTAUTH_URL}/v/${qrLink.slug}`,
    })
  } catch (error) {
    console.error("QR link creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

