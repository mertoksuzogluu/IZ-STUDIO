import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const products = await prisma.product.findMany({
      include: {
        tiers: { orderBy: { priceTRY: "asc" } },
      },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error("Admin products list error:", error)
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
    const { name, slug, description, isPhysical, tiers } = body
    if (!name || !slug) {
      return NextResponse.json(
        { error: "name and slug required" },
        { status: 400 }
      )
    }
    const product = await prisma.product.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        description: description || null,
        isPhysical: Boolean(isPhysical),
        active: true,
        tiers:
          Array.isArray(tiers) && tiers.length > 0
            ? {
                create: tiers.map((t: any) => ({
                  name: t.name || "Paket",
                  priceTRY: Number(t.priceTRY) || 0,
                  durationSec: t.durationSec != null ? Number(t.durationSec) : null,
                  physicalVariant: t.physicalVariant || null,
                  active: true,
                })),
              }
            : undefined,
      },
      include: { tiers: true },
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error("Admin product create error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
