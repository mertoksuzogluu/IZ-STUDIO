import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { generateQRCodeDataURL } from "@/lib/qr"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  await headers()
  try {
    const searchParams = req.nextUrl.searchParams
    const text = searchParams.get("text")

    if (!text) {
      return NextResponse.json(
        { error: "Text parameter required" },
        { status: 400 }
      )
    }

    const qrDataURL = await generateQRCodeDataURL(text)

    // Return as base64 image
    const base64Data = qrDataURL.split(",")[1]
    const buffer = Buffer.from(base64Data, "base64")
    const body = new Uint8Array(buffer)

    return new NextResponse(body, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("QR code generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    )
  }
}

