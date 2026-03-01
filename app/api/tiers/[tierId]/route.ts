import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { tierId: string } }
) {
  try {
    const tier = await prisma.packageTier.findUnique({
      where: { id: params.tierId, active: true },
      include: {
        product: { select: { name: true, slug: true } },
      },
    })
    if (!tier) {
      return NextResponse.json({ error: "Tier not found" }, { status: 404 })
    }
    return NextResponse.json({
      id: tier.id,
      name: tier.name,
      priceTRY: tier.priceTRY,
      durationSec: tier.durationSec,
      productName: tier.product.name,
      productSlug: tier.product.slug,
    })
  } catch (error) {
    console.error("Tier fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
