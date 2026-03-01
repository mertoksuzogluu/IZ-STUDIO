import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateOrderCode, PHYSICAL_PACKAGE_FEE } from "@/lib/utils"
import { validateAndApplyDiscount } from "@/lib/discounts"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const {
      productSlug,
      tierId,
      guest,
      urgentDelivery,
      uhd4k,
      physicalPackage,
      discountCode,
    } = await req.json()

    // Allow guest orders (user will provide email later in brief)
    if (!session?.user && !guest) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!productSlug || !tierId) {
      return NextResponse.json(
        { error: "Product and tier required" },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { slug: productSlug, active: true },
    })

    const tier = await prisma.packageTier.findUnique({
      where: { id: tierId, active: true },
    })

    if (!product || !tier) {
      return NextResponse.json(
        { error: "Product or tier not found" },
        { status: 404 }
      )
    }

    // Handle guest orders
    const userId = session?.user?.id || null

    const urgent = Boolean(urgentDelivery)
    const fourK = Boolean(uhd4k)
    const physical = Boolean(physicalPackage)
    const subtotal =
      tier.priceTRY +
      (urgent ? 300 : 0) +
      (fourK ? 200 : 0) +
      (physical ? PHYSICAL_PACKAGE_FEE : 0)

    let discountAmount = 0
    let appliedDiscountCode: string | null = null

    if (discountCode?.trim()) {
      const result = await validateAndApplyDiscount(
        discountCode.trim(),
        subtotal,
        product.id
      )
      if (result.valid) {
        discountAmount = result.amountTRY
        appliedDiscountCode = result.code
      }
    }

    const totalPrice = Math.max(0, subtotal - discountAmount)

    const order = await prisma.order.create({
      data: {
        orderCode: generateOrderCode(),
        userId: userId,
        guestEmail: null, // Will be set in brief
        productId: product.id,
        tierId: tier.id,
        totalPriceTRY: totalPrice,
        discountCode: appliedDiscountCode,
        discountAmountTRY: discountAmount,
        physicalPackage: physical,
        urgentDelivery: urgent,
        uhd4k: fourK,
        status: "RECEIVED",
        paymentStatus: "PENDING",
      },
    })

    if (appliedDiscountCode && discountAmount > 0) {
      await prisma.discount.update({
        where: { code: appliedDiscountCode },
        data: { usedCount: { increment: 1 } },
      })
    }

    return NextResponse.json({ orderCode: order.orderCode })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

