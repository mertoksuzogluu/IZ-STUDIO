"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Card from "@/components/design-system/Card"
import Button from "@/components/design-system/Button"
import type { SpecialThemeValue } from "@/lib/settings"

const THEME_OPTIONS: { value: SpecialThemeValue; label: string }[] = [
  { value: "default", label: "Normal (mevcut görünüm)" },
  { value: "anneler_gunu", label: "Anneler Günü" },
  { value: "babalar_gunu", label: "Babalar Günü" },
  { value: "sevgililer_gunu", label: "Sevgililer Günü" },
]

export default function AdminThemeForm({
  initialTheme,
}: {
  initialTheme: SpecialThemeValue
}) {
  const router = useRouter()
  const [theme, setTheme] = useState<SpecialThemeValue>(initialTheme)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/settings/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      })
      if (!res.ok) throw new Error("Kaydedilemedi")
      router.refresh()
      alert("Tema kaydedildi. Sayfa yenileniyor.")
      window.location.reload()
    } catch (e) {
      console.error(e)
      alert("Kaydetme hatası.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="p-6 mt-8 max-w-xl">
      <h2 className="text-lg font-serif text-[var(--fg)] mb-4">
        Aktif özel gün teması
      </h2>
      <div className="space-y-2 mb-6">
        {THEME_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] cursor-pointer hover:bg-[var(--card)]"
          >
            <input
              type="radio"
              name="theme"
              value={opt.value}
              checked={theme === opt.value}
              onChange={() => setTheme(opt.value)}
              className="border-[var(--border)]"
            />
            <span className="text-[var(--fg)]">{opt.label}</span>
          </label>
        ))}
      </div>
      <Button onClick={handleSave} disabled={isSaving} variant="primary">
        {isSaving ? "Kaydediliyor..." : "Kaydet"}
      </Button>
    </Card>
  )
}
