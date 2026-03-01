import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderCode = params.orderCode
    const { message } = await req.json()

    const order = await prisma.order.findUnique({
      where: { orderCode },
    })

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.status !== "PREVIEW_READY") {
      return NextResponse.json(
        { error: "Revision can only be requested for preview ready orders" },
        { status: 400 }
      )
    }

    await prisma.revisionRequest.create({
      data: {
        orderId: order.id,
        message,
      },
    })

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "REVISION",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Revision request error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

