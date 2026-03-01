import { NextResponse } from "next/server"
import { isSmtpConfigured } from "@/lib/email"

/**
 * Çalışan uygulamanın SMTP env kullanıp kullanmadığını kontrol eder.
 * Şifremi unuttum maili gitmiyorsa: false dönüyorsa sunucuda pm2 restart gerekir.
 * GET /api/check-smtp
 */
export async function GET() {
  return NextResponse.json({ smtpConfigured: isSmtpConfigured() })
}
