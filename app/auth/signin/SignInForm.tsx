"use client"

import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Button from "@/components/design-system/Button"

export default function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [mode, setMode] = useState<"login" | "email">("login")
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"
  const registered = searchParams?.get("registered") === "true"
  const errorParam = searchParams?.get("error")
  const isAdminCallback = callbackUrl.startsWith("/admin")

  useEffect(() => {
    if (errorParam) {
      setError(
        errorParam === "CredentialsSignin"
          ? "Email veya şifre hatalı"
          : errorParam === "Configuration"
          ? "Sunucu yapılandırma hatası"
          : "Bir hata oluştu. Lütfen tekrar deneyin."
      )
    }
  }, [errorParam])

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error === "CredentialsSignin" ? "Email veya şifre hatalı" : result.error)
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setError("Bir hata oluştu. Lütfen tekrar deneyin.")
      } else {
        router.push("/auth/verify")
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-[var(--fg)] mb-2">Feel Studio</h1>
          <p className="text-[var(--muted)]">Giriş yapın veya hesap oluşturun</p>
        </div>

        {registered && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Hesabınız başarıyla oluşturuldu! Lütfen giriş yapın.
          </div>
        )}

        {isAdminCallback && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
            Admin panele giriş için <strong>admin</strong> yetkili hesap gerekir. Seed çalıştırdıysanız: <code className="bg-amber-100 px-1 rounded">admin@izstudio.com</code> / <code className="bg-amber-100 px-1 rounded">admin123</code>
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--fg)] mb-2">
                E-posta Adresi
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && email && password) {
                    e.preventDefault()
                    handleCredentialsSubmit(e as any)
                  }
                }}
                required
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                placeholder="ornek@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--fg)] mb-2">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && email && password && !isLoading) {
                    e.preventDefault()
                    handleCredentialsSubmit(e as any)
                  }
                }}
                required
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>

            <div className="text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[var(--accent)] hover:underline"
              >
                Şifremi unuttum
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email-link" className="block text-sm font-medium text-[var(--fg)] mb-2">
                E-posta Adresi
              </label>
              <input
                id="email-link"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && email && !isLoading) {
                    e.preventDefault()
                    handleEmailSubmit(e as any)
                  }
                }}
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
              {isLoading ? "Gönderiliyor..." : "Giriş Linki Gönder"}
            </Button>
          </form>
        )}

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <p className="text-sm text-[var(--muted)]">
              Hesabınız yok mu?{" "}
              <Link href="/auth/signup" className="text-[var(--accent)] hover:underline font-medium">
                Kayıt Ol
              </Link>
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--bg)] px-2 text-[var(--muted)]">veya</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => router.push("/products")}
            className="w-full"
          >
            Kayıt Olmadan Devam Et
          </Button>
        </div>
      </div>
    </div>
  )
}
