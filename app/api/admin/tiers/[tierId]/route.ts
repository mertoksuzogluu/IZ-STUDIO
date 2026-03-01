import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { tierId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await req.json()
    const { name, priceTRY, durationSec, physicalVariant, active } = body
    const tier = await prisma.packageTier.update({
      where: { id: params.tierId },
      data: {
        ...(name != null && { name }),
        ...(priceTRY != null && { priceTRY: Number(priceTRY) }),
        ...(durationSec !== undefined && {
          durationSec: durationSec === "" || durationSec == null ? null : Number(durationSec),
        }),
        ...(physicalVariant !== undefined && { physicalVariant: physicalVariant || null }),
        ...(active !== undefined && { active: Boolean(active) }),
      },
    })
    return NextResponse.json(tier)
  } catch (error) {
    console.error("Admin tier update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { tierId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    await prisma.packageTier.update({
      where: { id: params.tierId },
      data: { active: false },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin tier delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
