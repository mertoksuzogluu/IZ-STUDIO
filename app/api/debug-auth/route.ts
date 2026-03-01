import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email") || "admin@izstudio.com"
  const password = req.nextUrl.searchParams.get("password") || "admin123"

  const steps: Record<string, any> = {}

  try {
    steps["1_db_connection"] = "testing..."
    await prisma.$queryRaw`SELECT 1 as ok`
    steps["1_db_connection"] = "OK"

    steps["2_find_user"] = "searching..."
    const user = await prisma.user.findFirst({
      where: { email: { equals: email.trim().toLowerCase(), mode: "insensitive" } },
    })
    steps["2_find_user"] = user
      ? { id: user.id, email: user.email, role: user.role }
      : "NOT FOUND"

    if (!user) {
      return NextResponse.json({ steps, result: "FAIL: user not found" })
    }

    steps["3_find_account"] = "searching..."
    const account = await prisma.account.findFirst({
      where: { userId: user.id, type: "credentials" },
    })
    steps["3_find_account"] = account
      ? {
          id: account.id,
          type: account.type,
          provider: account.provider,
          hasPassword: !!account.password,
          passwordLength: account.password?.length || 0,
          passwordPrefix: account.password?.substring(0, 7) || "",
        }
      : "NOT FOUND"

    if (!account || !account.password) {
      return NextResponse.json({ steps, result: "FAIL: no credentials account or no password" })
    }

    steps["4_bcrypt_compare"] = "comparing..."
    const isValid = await bcrypt.compare(password, account.password)
    steps["4_bcrypt_compare"] = isValid ? "MATCH" : "NO MATCH"

    steps["5_env"] = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "(not set)",
      NEXTAUTH_SECRET_length: (process.env.NEXTAUTH_SECRET || "").length,
      NODE_ENV: process.env.NODE_ENV || "(not set)",
    }

    return NextResponse.json({
      steps,
      result: isValid ? "OK - password matches, auth should work" : "FAIL - password does not match",
    })
  } catch (error: any) {
    steps["error"] = error.message
    return NextResponse.json({ steps, result: "ERROR" }, { status: 500 })
  }
}
