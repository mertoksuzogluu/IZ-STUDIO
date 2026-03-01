import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { validateAndApplyDiscount } from "@/lib/discounts"

export const dynamic = "force-dynamic"

/**
 * Sipariş öncesi indirim kodunu doğrular; uygulanacak tutarı döner.
 * Query: code, subtotalTRY, productId (opsiyonel)
 */
export async function GET(req: NextRequest) {
  await headers()
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")
    const subtotal = searchParams.get("subtotalTRY")
    const productId = searchParams.get("productId") || null

    if (!code || subtotal == null || isNaN(Number(subtotal))) {
      return NextResponse.json(
        { error: "code ve subtotalTRY gerekli" },
        { status: 400 }
      )
    }

    const result = await validateAndApplyDiscount(
      code,
      Number(subtotal),
      productId
    )

    if (result.valid) {
      return NextResponse.json({
        valid: true,
        amountTRY: result.amountTRY,
        code: result.code,
      })
    }
    return NextResponse.json({
      valid: false,
      error: result.error,
    })
  } catch (error) {
    console.error("Discount validate error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
