"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Button from "@/components/design-system/Button"

export default function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const [token, setToken] = useState("")
  const [mounted, setMounted] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const t = searchParams?.get("token") ?? ""
    setToken(t)
    if (!t) setError("Geçersiz veya eksik link. Lütfen şifre sıfırlama talebini tekrar gönderin.")
  }, [mounted, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor")
      return
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
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

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
        <div className="text-[var(--muted)]">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-[var(--fg)] mb-2">Feel Studio</h1>
          <p className="text-[var(--muted)]">Yeni şifre belirleyin</p>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              Şifreniz güncellendi. Giriş yapabilirsiniz.
            </div>
            <Link href="/auth/signin">
              <Button variant="primary" className="w-full">
                Giriş yap
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--fg)] mb-2">
                Yeni şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                placeholder="En az 6 karakter"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--fg)] mb-2">
                Şifre tekrar
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                placeholder="Şifrenizi tekrar girin"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !token}
              className="w-full"
            >
              {isLoading ? "Güncelleniyor..." : "Şifreyi güncelle"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/auth/signin" className="text-sm text-[var(--accent)] hover:underline font-medium">
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    </div>
  )
}
