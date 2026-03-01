import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const discounts = await prisma.discount.findMany({
      include: { product: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(discounts)
  } catch (error) {
    console.error("Discounts list error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      code,
      type,
      value,
      productId,
      minOrderAmountTRY,
      validFrom,
      validUntil,
      maxUses,
      active,
    } = body

    if (!code?.trim() || !type || value == null) {
      return NextResponse.json(
        { error: "code, type ve value zorunludur" },
        { status: 400 }
      )
    }

    const normalizedCode = code.trim().toUpperCase()
    const existing = await prisma.discount.findUnique({
      where: { code: normalizedCode },
    })
    if (existing) {
      return NextResponse.json(
        { error: "Bu kod zaten kayıtlı" },
        { status: 400 }
      )
    }

    const discount = await prisma.discount.create({
      data: {
        code: normalizedCode,
        type: type === "FIXED" ? "FIXED" : "PERCENTAGE",
        value: Number(value),
        productId: productId || null,
        minOrderAmountTRY:
          minOrderAmountTRY != null ? Number(minOrderAmountTRY) : null,
        validFrom: validFrom ? new Date(validFrom) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        maxUses: maxUses != null ? Number(maxUses) : null,
        active: active !== false,
      },
      include: { product: { select: { id: true, name: true, slug: true } } },
    })
    return NextResponse.json(discount)
  } catch (error) {
    console.error("Discount create error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
