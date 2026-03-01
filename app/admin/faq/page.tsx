"use client"

import { useState, useEffect } from "react"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import SectionHeader from "@/components/design-system/SectionHeader"
import Card from "@/components/design-system/Card"
import Button from "@/components/design-system/Button"

interface FaqItem {
  question: string
  answer: string
}

const PAGES = [
  { key: "genel", label: "Ana Sayfa / SSS", icon: "🏠" },
  { key: "ask", label: "Aşk Sayfası", icon: "❤️" },
  { key: "hatira", label: "Hatıra Sayfası", icon: "📷" },
  { key: "cocuk", label: "Çocuk Sayfası", icon: "👶" },
] as const

type PageKey = (typeof PAGES)[number]["key"]

function FaqPageSection({ pageKey, label, icon }: { pageKey: PageKey; label: string; icon: string }) {
  const [items, setItems] = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/admin/faq")
      .then((r) => r.json())
      .then((data) => {
        if (data[pageKey]) setItems(data[pageKey])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [pageKey])

  const updateItem = (index: number, field: "question" | "answer", value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const addItem = () => {
    setItems((prev) => [...prev, { question: "", answer: "" }])
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const moveItem = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= items.length) return
    const arr = [...items]
    const temp = arr[index]
    arr[index] = arr[newIndex]
    arr[newIndex] = temp
    setItems(arr)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/admin/faq", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pageKey, items }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Kaydetme başarısız")
      }
      setMessage("Kaydedildi!")
      setTimeout(() => setMessage(""), 3000)
    } catch (e: any) {
      setMessage("Hata: " + e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Card className="p-6"><p className="text-[var(--muted)]">Yükleniyor...</p></Card>
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xl font-serif text-[var(--fg)]">{label}</h3>
        <span className="ml-auto text-sm text-[var(--muted)]">{items.length} soru</span>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--card)]">
            <div className="flex items-start gap-2 mb-3">
              <span className="text-xs text-[var(--muted)] mt-2 shrink-0 w-4">{index + 1}.</span>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => updateItem(index, "question", e.target.value)}
                  placeholder="Soru"
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-white text-[var(--fg)] text-sm"
                />
                <textarea
                  value={item.answer}
                  onChange={(e) => updateItem(index, "answer", e.target.value)}
                  placeholder="Cevap"
                  rows={2}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-white text-[var(--fg)] text-sm"
                />
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="px-2 py-1 text-xs border border-[var(--border)] rounded hover:bg-[var(--border)]/50 disabled:opacity-30"
                  title="Yukarı taşı"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  className="px-2 py-1 text-xs border border-[var(--border)] rounded hover:bg-[var(--border)]/50 disabled:opacity-30"
                  title="Aşağı taşı"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="px-2 py-1 text-xs text-red-500 border border-red-200 rounded hover:bg-red-50"
                  title="Sil"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 text-sm border border-dashed border-[var(--border)] rounded-lg hover:bg-[var(--border)]/30 text-[var(--muted)]"
        >
          + Yeni soru ekle
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 text-sm bg-[var(--fg)] text-white rounded-lg hover:opacity-80 disabled:opacity-50"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        {message && (
          <span className={`text-sm ${message.startsWith("Hata") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </span>
        )}
      </div>
    </Card>
  )
}

export default function AdminFaqPage() {
  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16 max-w-4xl mx-auto">
          <SectionHeader
            title="SSS Yönetimi"
            description="Her sayfanın sıkça sorulan sorular bölümünü ayrı ayrı düzenleyin. Sıralama, ekleme, silme yapabilirsiniz."
          />

          <div className="space-y-8">
            {PAGES.map((p) => (
              <FaqPageSection key={p.key} pageKey={p.key} label={p.label} icon={p.icon} />
            ))}
          </div>

          <div className="mt-8">
            <Button variant="outline" href="/admin">
              Admin Panele Dön
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
