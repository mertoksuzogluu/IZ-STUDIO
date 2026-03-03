import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

/**
 * Admin-only: Ödeme modunu kontrol et (neden mock çıkıyor görmek için).
 * Gerçek API key/secret değerleri dönmez.
 */
export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 })
  }

  const providerRaw = process.env.PAYMENT_PROVIDER ?? ""
  const provider = providerRaw.trim().toLowerCase()
  const hasApiKey = !!(
    (process.env.IYZIPAY_API_KEY ?? process.env.IYZICO_API_KEY ?? "").trim()
  )
  const hasSecretKey = !!(
    (process.env.IYZIPAY_SECRET_KEY ?? process.env.IYZICO_SECRET_KEY ?? "").trim()
  )
  const sandboxRaw = process.env.IYZICO_SANDBOX ?? ""
  const isSandbox = sandboxRaw.trim().toLowerCase() === "true"
  const uriRaw = (process.env.IYZIPAY_URI ?? "").trim()

  let activeMode: "iyzico" | "mock" = "mock"
  const reasons: string[] = []

  if (provider !== "iyzico") {
    reasons.push(`PAYMENT_PROVIDER="${providerRaw || "(boş)"}" — "iyzico" olmalı`)
  }
  if (!hasApiKey) reasons.push("IYZICO_API_KEY tanımlı değil veya boş")
  if (!hasSecretKey) reasons.push("IYZICO_SECRET_KEY tanımlı değil veya boş")

  if (provider === "iyzico" && hasApiKey && hasSecretKey) {
    activeMode = "iyzico"
    reasons.push(isSandbox ? "Sandbox (test) modunda" : "Canlı modda")
  }

  return NextResponse.json({
    activeMode,
    env: {
      PAYMENT_PROVIDER: providerRaw || "(boş)",
      IYZIPAY_URI: uriRaw || "(boş, sandbox/canlı otomatik)",
      IYZICO_SANDBOX: sandboxRaw || "(boş)",
      hasApiKey,
      hasSecretKey,
      isSandbox,
    },
    reasons,
    message:
      activeMode === "iyzico"
        ? "Ödeme iyzico kullanıyor. Mock sayfası çıkmamalı."
        : "Ödeme mock kullanıyor. Yukarıdaki nedenleri düzeltin, sunucuda .env.local güncelleyip pm2 restart edin.",
  })
}
