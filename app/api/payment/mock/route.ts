import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production" || process.env.PAYMENT_PROVIDER === "iyzico") {
    return NextResponse.json({ error: "Bu endpoint production ortamında devre dışıdır." }, { status: 403 })
  }

  const searchParams = req.nextUrl.searchParams
  const orderCode = searchParams.get("orderCode")
  const returnUrl = searchParams.get("returnUrl")

  if (!orderCode) {
    return new NextResponse("Missing orderCode", { status: 400 })
  }

  const safeReturnUrl = returnUrl && returnUrl.startsWith("/") ? returnUrl : `/api/payment/callback?orderCode=${orderCode}`

  return new NextResponse(
    `<!DOCTYPE html>
    <html>
    <head>
      <title>Mock Payment - Feel Studio (DEV)</title>
      <style>
        body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
        .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 400px; width: 100%; }
        .warn { background: #fff3cd; border: 1px solid #ffc107; padding: 8px; border-radius: 4px; margin-bottom: 1rem; font-size: 13px; }
        button { width: 100%; padding: 12px; background: #111; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; margin-top: 1rem; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="warn">DEV ONLY - Bu sayfa canlıda erişilemez</div>
        <h1>Mock Payment</h1>
        <p>Order: <code>${orderCode}</code></p>
        <button onclick="window.location.href='${safeReturnUrl}'">Complete Payment</button>
      </div>
    </body>
    </html>`,
    { headers: { "Content-Type": "text/html" } }
  )
}
