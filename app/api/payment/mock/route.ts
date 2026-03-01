import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Mock payment page for development
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const orderCode = searchParams.get("orderCode")
  const returnUrl = searchParams.get("returnUrl")

  if (!orderCode) {
    return new NextResponse("Missing orderCode", { status: 400 })
  }

  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Mock Payment - Feel Studio</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: #f5f5f5;
        }
        .container {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          max-width: 400px;
          width: 100%;
        }
        h1 { margin-top: 0; }
        button {
          width: 100%;
          padding: 12px;
          background: #111;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 1rem;
        }
        button:hover { background: #333; }
        .code { font-family: monospace; background: #f0f0f0; padding: 4px 8px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Mock Payment</h1>
        <p>Order Code: <span class="code">${orderCode}</span></p>
        <p>This is a mock payment page for development.</p>
        <button onclick="completePayment()">Complete Payment</button>
        <script>
          function completePayment() {
            const returnUrl = "${returnUrl || `/api/payment/callback?orderCode=${orderCode}`}";
            window.location.href = returnUrl;
          }
        </script>
      </div>
    </body>
    </html>
    `,
    {
      headers: { "Content-Type": "text/html" },
    }
  )
}

