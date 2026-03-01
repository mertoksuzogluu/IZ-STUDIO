import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()
    if (!token || !password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Token ve yeni şifre gerekli" },
        { status: 400 }
      )
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır" },
        { status: 400 }
      )
    }

    const record = await prisma.verificationToken.findUnique({
      where: { token },
    })
    if (!record || record.expires < new Date()) {
      return NextResponse.json(
        { error: "Link geçersiz veya süresi dolmuş. Yeni sıfırlama talebi gönderin." },
        { status: 400 }
      )
    }

    const email = record.identifier
    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    })
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 400 })
    }

    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        type: "credentials",
      },
    })
    if (!account) {
      return NextResponse.json({ error: "Hesap bulunamadı." }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.account.update({
      where: { id: account.id },
      data: { password: hashedPassword },
    })
    await prisma.verificationToken.delete({
      where: { token },
    })

    return NextResponse.json({
      success: true,
      message: "Şifreniz güncellendi. Giriş yapabilirsiniz.",
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bir hata oluştu."
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
