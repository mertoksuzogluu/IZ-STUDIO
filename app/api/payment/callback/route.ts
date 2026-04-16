import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { paymentProvider } from "@/lib/payment"
import { sendOrderStatusEmail } from "@/lib/email"

export const dynamic = "force-dynamic"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://feelcreativestudio.com"

async function handleCallback(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const orderCode = searchParams.get("orderCode")
    let token = searchParams.get("token")

    if (!token && req.method === "POST") {
      try {
        const body = await req.formData().catch(() => null)
        token = body?.get("token") as string | null
      } catch {
        // ignore
      }
    }

    if (!orderCode) {
      return NextResponse.redirect(new URL("/dashboard?error=payment_failed", SITE_URL))
    }

    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: { user: true },
    })

    if (!order) {
      return NextResponse.redirect(new URL("/dashboard?error=order_not_found", SITE_URL))
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.redirect(
        new URL(`/dashboard/orders/${orderCode}?payment=already_paid`, SITE_URL)
      )
    }

    const izyicoToken = token || order.adminNotes?.replace("iyzico_token:", "")

    if (!izyicoToken) {
      console.error("[Payment Callback] Token bulunamadi, orderCode:", orderCode)
      return NextResponse.redirect(
        new URL(`/checkout/${orderCode}?error=payment_failed`, SITE_URL)
      )
    }

    const verification = await paymentProvider.verifyPayment(izyicoToken, orderCode, order.totalPriceTRY)

    if (verification.success && verification.status === "PAID") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "IN_PRODUCTION",
          adminNotes: order.adminNotes
            ? `${order.adminNotes}\npaymentId:${verification.paymentId || izyicoToken}`
            : `paymentId:${verification.paymentId || izyicoToken}`,
        },
      })

      const email = order.user?.email || order.guestEmail
      if (email) {
        sendOrderStatusEmail(email, orderCode, "IN_PRODUCTION").catch(() => {})
      }

      return NextResponse.redirect(
        new URL(`/dashboard/orders/${orderCode}?payment=success`, SITE_URL)
      )
    }

    if (verification.status === "PENDING") {
      return NextResponse.redirect(
        new URL(`/dashboard/orders/${orderCode}?payment=pending`, SITE_URL)
      )
    }

    return NextResponse.redirect(
      new URL(`/checkout/${orderCode}?error=payment_failed`, SITE_URL)
    )
  } catch (error) {
    console.error("Payment callback error:", error)
    return NextResponse.redirect(new URL("/dashboard?error=payment_error", SITE_URL))
  }
}

export async function GET(req: NextRequest) {
  return handleCallback(req)
}

export async function POST(req: NextRequest) {
  return handleCallback(req)
}
