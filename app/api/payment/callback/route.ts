import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { paymentProvider } from "@/lib/payment"
import { sendOrderStatusEmail } from "@/lib/email"

export const dynamic = "force-dynamic"

function getBaseUrl(req: NextRequest): string {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || ""
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https")
  return `${proto}://${host}`
}

async function handleCallback(req: NextRequest) {
  const baseUrl = getBaseUrl(req)

  try {
    const searchParams = req.nextUrl.searchParams
    const orderCode = searchParams.get("orderCode")
    let token = searchParams.get("token")

    // iyzico POST callback gönderebilir
    if (!token && req.method === "POST") {
      try {
        const body = await req.formData().catch(() => null)
        token = body?.get("token") as string | null
      } catch {
        // ignore
      }
    }

    if (!orderCode) {
      return NextResponse.redirect(new URL("/dashboard?error=payment_failed", baseUrl))
    }

    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: { user: true },
    })

    if (!order) {
      return NextResponse.redirect(new URL("/dashboard?error=order_not_found", baseUrl))
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.redirect(
        new URL(`/dashboard/orders/${orderCode}?payment=already_paid`, baseUrl)
      )
    }

    // iyzico token'ı varsa doğrula
    const izyicoToken = token || order.adminNotes?.replace("iyzico_token:", "")

    if (process.env.PAYMENT_PROVIDER === "iyzico" && izyicoToken) {
      const verification = await paymentProvider.verifyPayment(izyicoToken)

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
          new URL(`/dashboard/orders/${orderCode}?payment=success`, baseUrl)
        )
      }

      if (verification.status === "PENDING") {
        return NextResponse.redirect(
          new URL(`/dashboard/orders/${orderCode}?payment=pending`, baseUrl)
        )
      }

      return NextResponse.redirect(
        new URL(`/checkout/${orderCode}?error=payment_failed`, baseUrl)
      )
    }

    // Mock provider — otomatik onayla
    if (process.env.PAYMENT_PROVIDER !== "iyzico") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "IN_PRODUCTION",
        },
      })

      return NextResponse.redirect(
        new URL(`/dashboard/orders/${orderCode}?payment=success`, baseUrl)
      )
    }

    return NextResponse.redirect(
      new URL(`/dashboard/orders/${orderCode}?payment=pending`, baseUrl)
    )
  } catch (error) {
    console.error("Payment callback error:", error)
    return NextResponse.redirect(new URL("/dashboard?error=payment_error", baseUrl))
  }
}

export async function GET(req: NextRequest) {
  return handleCallback(req)
}

export async function POST(req: NextRequest) {
  return handleCallback(req)
}
