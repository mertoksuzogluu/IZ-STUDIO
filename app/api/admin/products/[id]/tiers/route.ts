import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await req.json()
    const { name, priceTRY, durationSec, physicalVariant } = body
    const tier = await prisma.packageTier.create({
      data: {
        productId: params.id,
        name: name || "Yeni Paket",
        priceTRY: Number(priceTRY) ?? 0,
        durationSec: durationSec != null ? Number(durationSec) : null,
        physicalVariant: physicalVariant || null,
        active: true,
      },
    })
    return NextResponse.json(tier)
  } catch (error) {
    console.error("Admin tier create error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
