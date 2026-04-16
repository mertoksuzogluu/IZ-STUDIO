import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

function getBaseUrl(request: NextRequest): string {
  const proto = request.headers.get("x-forwarded-proto")
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host")
  if (proto === "https" && host) return `https://${host}`
  return (
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://feelcreativestudio.com"
  )
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const host = request.headers.get("host") || ""

  // www → non-www yönlendirmesi (cookie/session tutarlılığı için)
  if (host.startsWith("www.")) {
    const nonWwwHost = host.replace(/^www\./, "")
    const url = request.nextUrl.clone()
    url.host = nonWwwHost
    url.protocol = "https"
    return NextResponse.redirect(url, 301)
  }

  // Çıkış: NextAuth yerine bizim route kullansın, localhost'a düşmesin
  if (pathname === "/api/auth/signout") {
    return NextResponse.rewrite(new URL("/api/signout", request.url))
  }

  const session = await auth()
  const baseUrl = getBaseUrl(request)

  // API route'ları kendi içinde auth kontrol eder; middleware müdahale etmesin
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Public routes - allow access
  const publicRoutes = [
    "/auth",
    "/products",
    "/order/start",
    "/checkout",
    "/v",
    "/",
    "/cocuk",
    "/ask",
    "/hatira",
  ]

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Admin routes
  if (pathname.startsWith("/admin")) {
    if (!session?.user || session.user.role !== "admin") {
      const signInUrl = new URL("/auth/signin", baseUrl)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // User dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!session?.user || (session.user.role !== "user" && session.user.role !== "admin")) {
      return NextResponse.redirect(new URL("/auth/signin", baseUrl))
    }
  }

  // Order routes (except /order/start which is public)
  if (pathname.startsWith("/order/") && !pathname.startsWith("/order/start")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/signin", baseUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|uploads/).*)",
  ],
}
