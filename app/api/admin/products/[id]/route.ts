import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { tiers: { orderBy: { priceTRY: "asc" } } },
    })
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error("Admin product get error:", error)
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
    const { name, slug, description, isPhysical, active } = body
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name != null && { name }),
        ...(slug != null && { slug: slug.toLowerCase().replace(/\s+/g, "-") }),
        ...(description !== undefined && { description }),
        ...(isPhysical !== undefined && { isPhysical: Boolean(isPhysical) }),
        ...(active !== undefined && { active: Boolean(active) }),
      },
      include: { tiers: true },
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error("Admin product update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    await prisma.product.update({
      where: { id: params.id },
      data: { active: false },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin product delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
