import { NextRequest, NextResponse } from "next/server"

/**
 * Özel çıkış route'u: Oturum cookie'sini siler ve yönlendirmeyi
 * isteğin geldiği host'a göre yapar (NEXTAUTH_URL'e hiç bakmaz).
 * Böylece canlıda çıkış sonrası localhost'a düşme sorunu olmaz.
 */

function getRedirectUrl(request: NextRequest): string {
  // Sadece isteğin geldiği host kullanılır — NEXTAUTH_URL / env hiç kullanılmaz
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || ""
  const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https")
  const base = `${proto}://${host}`
  return base.endsWith("/") ? base : `${base}/`
}

function clearSessionCookieHeaders(): string[] {
  const past = new Date(0).toUTCString()
  return [
    `authjs.session-token=; Path=/; Expires=${past}; HttpOnly; SameSite=Lax`,
    `__Secure-authjs.session-token=; Path=/; Expires=${past}; HttpOnly; SameSite=Lax; Secure`,
  ]
}

export async function GET(request: NextRequest) {
  const redirectUrl = getRedirectUrl(request)
  const response = NextResponse.redirect(redirectUrl, { status: 302 })
  for (const cookie of clearSessionCookieHeaders()) {
    response.headers.append("Set-Cookie", cookie)
  }
  return response
}

export async function POST(request: NextRequest) {
  return GET(request)
}
