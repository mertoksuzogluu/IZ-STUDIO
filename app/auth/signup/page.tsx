"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import Button from "@/components/design-system/Button"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState({ length: false, lower: false, upper: false, number: false })
  const router = useRouter()

  const checkPasswordStrength = (pw: string) => {
    setPasswordStrength({
      length: pw.length >= 8,
      lower: /[a-z]/.test(pw),
      upper: /[A-Z]/.test(pw),
      number: /[0-9]/.test(pw),
    })
  }

  const isPasswordValid = passwordStrength.length && passwordStrength.lower && passwordStrength.upper && passwordStrength.number

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor")
      setIsLoading(false)
      return
    }

    if (!isPasswordValid) {
      setError("Şifre gereksinimleri karşılanmıyor")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Kayıt başarısız")
      }

      // Auto sign in after registration
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.error) {
        // If auto sign in fails, redirect to sign in page
        router.push("/auth/signin?registered=true")
      } else {
        // Successfully signed in, redirect to dashboard
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-[var(--fg)] mb-2">Feel Studio</h1>
          <p className="text-[var(--muted)]">Yeni hesap oluşturun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[var(--fg)] mb-2">
              Ad Soyad
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
              placeholder="Adınız Soyadınız"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--fg)] mb-2">
              E-posta Adresi
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--fg)] mb-2">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value })
                checkPasswordStrength(e.target.value)
              }}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
              placeholder="En az 8 karakter"
            />
            {formData.password.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className={`text-xs flex items-center gap-1.5 ${passwordStrength.length ? "text-green-600" : "text-[var(--muted)]"}`}>
                  <span>{passwordStrength.length ? "✓" : "○"}</span> En az 8 karakter
                </p>
                <p className={`text-xs flex items-center gap-1.5 ${passwordStrength.lower ? "text-green-600" : "text-[var(--muted)]"}`}>
                  <span>{passwordStrength.lower ? "✓" : "○"}</span> En az bir küçük harf (a-z)
                </p>
                <p className={`text-xs flex items-center gap-1.5 ${passwordStrength.upper ? "text-green-600" : "text-[var(--muted)]"}`}>
                  <span>{passwordStrength.upper ? "✓" : "○"}</span> En az bir büyük harf (A-Z)
                </p>
                <p className={`text-xs flex items-center gap-1.5 ${passwordStrength.number ? "text-green-600" : "text-[var(--muted)]"}`}>
                  <span>{passwordStrength.number ? "✓" : "○"}</span> En az bir rakam (0-9)
                </p>
              </div>
            )}
            {formData.password.length === 0 && (
              <p className="mt-1 text-xs text-[var(--muted)]">
                En az 8 karakter, büyük harf, küçük harf ve rakam içermeli
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--fg)] mb-2">
              Şifre Tekrar
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              minLength={8}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)] ${
                formData.confirmPassword && formData.confirmPassword !== formData.password
                  ? "border-red-400"
                  : "border-[var(--border)]"
              }`}
              placeholder="Şifrenizi tekrar girin"
            />
            {formData.confirmPassword && formData.confirmPassword !== formData.password && (
              <p className="mt-1 text-xs text-red-500">Şifreler eşleşmiyor</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--muted)]">
            Zaten hesabınız var mı?{" "}
            <Link href="/auth/signin" className="text-[var(--accent)] hover:underline font-medium">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

