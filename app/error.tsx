"use client"

import { useEffect } from "react"
import Link from "next/link"
import Button from "@/components/design-system/Button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("App error:", error.message, error.digest)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-xl font-semibold text-[var(--fg)] mb-2">Bir hata oluştu</h1>
      <p className="text-[var(--muted)] text-center max-w-md mb-6">
        Sayfa yüklenirken sunucu hatası oluştu. Lütfen tekrar deneyin veya ana sayfaya dönün.
      </p>
      <div className="flex gap-3">
        <Button variant="primary" onClick={() => reset()}>
          Tekrar dene
        </Button>
        <Link href="/">
          <Button variant="outline">Ana sayfa</Button>
        </Link>
      </div>
    </div>
  )
}
