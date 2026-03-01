import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const error = searchParams.get("error")

  // Build signin URL with error parameter
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://feelcreativestudio.com"
  const signInUrl = new URL("/auth/signin", baseUrl)
  if (error) {
    signInUrl.searchParams.set("error", error)
  }

  return NextResponse.redirect(signInUrl.toString())
}

