import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email ve şifre gereklidir" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Şifre en az 8 karakter olmalıdır" },
        { status: 400 }
      )
    }
    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { error: "Şifre en az bir küçük harf içermelidir" },
        { status: 400 }
      )
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: "Şifre en az bir büyük harf içermelidir" },
        { status: 400 }
      )
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Şifre en az bir rakam içermelidir" },
        { status: 400 }
      )
    }

    const normalizedEmail = (email as string).trim().toLowerCase()

    // Check if user already exists (case-insensitive)
    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email adresi zaten kullanılıyor" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user (email her zaman küçük harf — arama/giriş tutarlı olsun)
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: (name as string)?.trim() || null,
        role: "user",
      },
    })

    // Create account with credentials
    await prisma.account.create({
      data: {
        userId: user.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: user.id,
        password: hashedPassword,
      },
    })

    // Hoş geldin maili gönder; sonucu logla
    const emailResult = await sendWelcomeEmail(user.email, user.name || "").catch((err) => {
      console.error("[Signup] Welcome email failed:", err)
      return { success: false }
    })
    if (!emailResult.success) {
      console.warn("[Signup] Kullanıcı oluştu ama hoş geldin maili gidemedi:", user.email)
    }

    return NextResponse.json({
      success: true,
      message: "Hesap başarıyla oluşturuldu",
      userId: user.id,
    })
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: error.message || "Bir hata oluştu" },
      { status: 500 }
    )
  }
}

