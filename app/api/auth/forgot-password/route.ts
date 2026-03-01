import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://feelcreativestudio.com"
const RESET_EXPIRY_HOURS = 1

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "E-posta adresi gerekli" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: "insensitive" } },
    })

    // Güvenlik: Kullanıcı yoksa da aynı yanıt (e-posta sızdırmayalım)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Bu e-posta kayıtlıysa sıfırlama linki gönderildi.",
      })
    }

    // Credentials hesabı var mı? (şifre ile kayıt olanlar)
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        type: "credentials",
      },
    })
    if (!account || !account.password) {
      return NextResponse.json({
        success: true,
        message: "Bu e-posta kayıtlıysa sıfırlama linki gönderildi.",
      })
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + RESET_EXPIRY_HOURS * 60 * 60 * 1000)

    await prisma.verificationToken.deleteMany({
      where: { identifier: normalizedEmail },
    })
    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token,
        expires,
      },
    })

    const resetLink = `${SITE_URL}/auth/reset-password?token=${token}`
    console.log("[ForgotPassword] Mail gönderiliyor:", normalizedEmail)
    const sent = await sendPasswordResetEmail(normalizedEmail, resetLink)
    if (sent?.success) {
      console.log("[ForgotPassword] Mail başarıyla gönderildi:", normalizedEmail)
    } else {
      console.error("[ForgotPassword] Mail GÖNDERİLEMEDİ (SMTP hatası veya env). Alıcı:", normalizedEmail)
      if (process.env.NODE_ENV === "development") {
        console.log("[ForgotPassword] GELİŞTİRME: Sıfırlama linki (kopyalayıp tarayıcıda açın):", resetLink)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Bu e-posta kayıtlıysa sıfırlama linki gönderildi.",
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Bir hata oluştu."
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
