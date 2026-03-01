"use client"

import { useState } from "react"
import Link from "next/link"
import Button from "@/components/design-system/Button"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = (await response.json().catch(() => ({}))) as { error?: string }

      if (!response.ok) {
        throw new Error(data?.error || `Sunucu hatası (${response.status})`)
      }

      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-[var(--fg)] mb-2">Feel Studio</h1>
          <p className="text-[var(--muted)]">Şifre sıfırlama</p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              Bu e-posta kayıtlıysa sıfırlama linki gönderildi. Gelen kutunuzu ve spam klasörünüzü kontrol edin.
            </div>
            <Link href="/auth/signin">
              <Button variant="primary" className="w-full">
                Giriş sayfasına dön
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <p className="text-sm text-[var(--muted)]">
              Kayıtlı e-posta adresinizi girin. Size şifre sıfırlama linki göndereceğiz.
            </p>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--fg)] mb-2">
                E-posta Adresi
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                placeholder="ornek@email.com"
                autoComplete="email"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Gönderiliyor..." : "Sıfırlama linki gönder"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--muted)]">
            <Link href="/auth/signin" className="text-[var(--accent)] hover:underline font-medium">
              Giriş sayfasına dön
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
