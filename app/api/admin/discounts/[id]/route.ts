import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const discount = await prisma.discount.findUnique({
      where: { id: params.id },
      include: { product: { select: { id: true, name: true, slug: true } } },
    })
    if (!discount) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(discount)
  } catch (error) {
    console.error("Discount get error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const updateData: Record<string, unknown> = {}
    if (code !== undefined) updateData.code = code.trim().toUpperCase()
    if (type !== undefined) updateData.type = type
    if (value !== undefined) updateData.value = Number(value)
    if (productId !== undefined) updateData.productId = productId || null
    if (minOrderAmountTRY !== undefined)
      updateData.minOrderAmountTRY =
        minOrderAmountTRY === "" || minOrderAmountTRY == null
          ? null
          : Number(minOrderAmountTRY)
    if (validFrom !== undefined)
      updateData.validFrom = validFrom ? new Date(validFrom) : null
    if (validUntil !== undefined)
      updateData.validUntil = validUntil ? new Date(validUntil) : null
    if (maxUses !== undefined)
      updateData.maxUses = maxUses === "" || maxUses == null ? null : Number(maxUses)
    if (active !== undefined) updateData.active = Boolean(active)

    const discount = await prisma.discount.update({
      where: { id: params.id },
      data: updateData,
      include: { product: { select: { id: true, name: true, slug: true } } },
    })
    return NextResponse.json(discount)
  } catch (error) {
    console.error("Discount update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.discount.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Discount delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
