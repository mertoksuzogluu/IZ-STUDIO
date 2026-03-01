import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendOrderStatusEmail } from "@/lib/email"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderCode = params.orderCode
    const { status, previewLink, adminNotes } = await req.json()

    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: { user: { select: { email: true } } },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const previousStatus = order.status

    await prisma.order.update({
      where: { id: order.id },
      data: {
        ...(status && { status }),
        ...(previewLink !== undefined && { previewLink }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
    })

    if (status && status !== previousStatus) {
      const toEmail = order.user?.email || order.guestEmail
      if (toEmail) {
        await sendOrderStatusEmail(toEmail, orderCode, status)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin order update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

