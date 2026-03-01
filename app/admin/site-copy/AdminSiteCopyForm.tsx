"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Card from "@/components/design-system/Card"
import Button from "@/components/design-system/Button"
import type { SiteCopy } from "@/lib/siteCopy"

type PageId = "ana" | "ask" | "hatira" | "cocuk" | "sss" | "ortak"

const PAGES: { id: PageId; label: string }[] = [
  { id: "ana", label: "Ana sayfa" },
  { id: "ask", label: "Aşk sayfası" },
  { id: "hatira", label: "Hatıra sayfası" },
  { id: "cocuk", label: "Çocuk sayfası" },
  { id: "sss", label: "SSS (Sık Sorulan Sorular)" },
  { id: "ortak", label: "Ortak (footer, paketler, süreç)" },
]

const FIELDS: {
  page: PageId
  key: keyof SiteCopy
  label: string
  hint?: string
  rows?: number
}[] = [
  { page: "ana", key: "heroTitle", label: "Hero başlık" },
  { page: "ana", key: "heroSubtitle", label: "Hero alt metin", rows: 2 },
  { page: "ana", key: "landingAskDesc", label: "Aşk kartı kısa açıklama" },
  { page: "ana", key: "landingHatiraDesc", label: "Hatıra kartı kısa açıklama" },
  { page: "ana", key: "landingCocukDesc", label: "Çocuk kartı kısa açıklama" },
  { page: "ask", key: "askHeroTitle", label: "Hero başlık" },
  { page: "ask", key: "askHeroSubtitle", label: "Hero alt metin", rows: 2 },
  { page: "ask", key: "askSectionTitleNeed", label: "“Sizden ne alıyoruz?” başlık" },
  { page: "ask", key: "askSectionNeedItems", label: "Sizden ne alıyoruz maddeleri", hint: "Her satır bir madde", rows: 5 },
  { page: "ask", key: "askSectionTitleDeliver", label: "“Ne teslim ediyoruz?” başlık" },
  { page: "ask", key: "askSectionDeliverItems", label: "Ne teslim ediyoruz maddeleri", hint: "Her satır bir madde", rows: 4 },
  { page: "ask", key: "askDeliveryText", label: "Teslim süresi metni (süreç bölümü)", rows: 2 },
  { page: "hatira", key: "hatiraHeroTitle", label: "Hero başlık" },
  { page: "hatira", key: "hatiraHeroSubtitle", label: "Hero alt metin", rows: 2 },
  { page: "hatira", key: "hatiraSectionTitleNeed", label: "“Sizden ne alıyoruz?” başlık" },
  { page: "hatira", key: "hatiraSectionNeedItems", label: "Sizden ne alıyoruz maddeleri", hint: "Her satır bir madde", rows: 5 },
  { page: "hatira", key: "hatiraSectionTitleDeliver", label: "“Ne teslim ediyoruz?” başlık" },
  { page: "hatira", key: "hatiraSectionDeliverItems", label: "Ne teslim ediyoruz maddeleri", hint: "Her satır bir madde", rows: 4 },
  { page: "cocuk", key: "cocukHeroTitle", label: "Hero başlık" },
  { page: "cocuk", key: "cocukHeroSubtitle", label: "Hero alt metin", rows: 2 },
  { page: "cocuk", key: "cocukBodyText", label: "Hikâye paragrafı (Büyüme Hikayesi kartı)", rows: 3 },
  { page: "cocuk", key: "cocukSectionTitleNeed", label: "“Sizden ne alıyoruz?” başlık" },
  { page: "cocuk", key: "cocukSectionNeedItems", label: "Sizden ne alıyoruz maddeleri", hint: "Her satır bir madde", rows: 5 },
  { page: "cocuk", key: "cocukSectionTitleDeliver", label: "“Ne teslim ediyoruz?” başlık" },
  { page: "cocuk", key: "cocukSectionDeliverItems", label: "Ne teslim ediyoruz maddeleri", hint: "Her satır bir madde", rows: 4 },
  { page: "sss", key: "sssPageTitle", label: "Sayfa başlığı" },
  { page: "sss", key: "sssPageDescription", label: "Sayfa açıklaması (başlık altı)", rows: 2 },
  { page: "sss", key: "sssCtaText", label: "Alt kısım metni (WhatsApp butonu üstü)" },
  { page: "sss", key: "sss1Question", label: "Soru 1" },
  { page: "sss", key: "sss1Answer", label: "Cevap 1", rows: 3 },
  { page: "sss", key: "sss2Question", label: "Soru 2" },
  { page: "sss", key: "sss2Answer", label: "Cevap 2", rows: 3 },
  { page: "sss", key: "sss3Question", label: "Soru 3" },
  { page: "sss", key: "sss3Answer", label: "Cevap 3", rows: 3 },
  { page: "sss", key: "sss4Question", label: "Soru 4" },
  { page: "sss", key: "sss4Answer", label: "Cevap 4", rows: 3 },
  { page: "sss", key: "sss5Question", label: "Soru 5" },
  { page: "sss", key: "sss5Answer", label: "Cevap 5", rows: 3 },
  { page: "sss", key: "sss6Question", label: "Soru 6" },
  { page: "sss", key: "sss6Answer", label: "Cevap 6", rows: 3 },
  { page: "sss", key: "sss7Question", label: "Soru 7" },
  { page: "sss", key: "sss7Answer", label: "Cevap 7", rows: 3 },
  { page: "sss", key: "sss8Question", label: "Soru 8" },
  { page: "sss", key: "sss8Answer", label: "Cevap 8", rows: 3 },
  { page: "sss", key: "sss9Question", label: "Soru 9" },
  { page: "sss", key: "sss9Answer", label: "Cevap 9", rows: 3 },
  { page: "sss", key: "sss10Question", label: "Soru 10" },
  { page: "sss", key: "sss10Answer", label: "Cevap 10", rows: 3 },
  { page: "ortak", key: "footerTagline", label: "Footer açıklama", rows: 2 },
  { page: "ortak", key: "packageCardLabel", label: "Paket kartı etiketi (örn. Sinematik kısa film)" },
  { page: "ortak", key: "productDetailSubtitle", label: "Paket detay sayfası alt başlık (örn. Sinematik prodüksiyon)" },
  { page: "ortak", key: "processStep1Title", label: "Süreç adım 1 başlık" },
  { page: "ortak", key: "processStep1Desc", label: "Süreç adım 1 açıklama", rows: 2 },
  { page: "ortak", key: "processStep2Title", label: "Süreç adım 2 başlık" },
  { page: "ortak", key: "processStep2Desc", label: "Süreç adım 2 açıklama", rows: 2 },
  { page: "ortak", key: "processStep3Title", label: "Süreç adım 3 başlık" },
  { page: "ortak", key: "processStep3Desc", label: "Süreç adım 3 açıklama", rows: 2 },
]

export default function AdminSiteCopyForm() {
  const router = useRouter()
  const [copy, setCopy] = useState<SiteCopy | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activePage, setActivePage] = useState<PageId>("ana")

  useEffect(() => {
    let cancelled = false
    fetch("/api/admin/site-copy")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setCopy(data)
      })
      .catch(() => {
        if (!cancelled) setCopy(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleChange = (key: keyof SiteCopy, value: string) => {
    setCopy((prev) => (prev ? { ...prev, [key]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!copy) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/site-copy", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(copy),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Kaydedilemedi")
      }
      router.refresh()
      alert("Kaydedildi. Değişiklikler sitede hemen yansır.")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Kaydetme hatası.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <p className="text-[var(--muted)]">Metinler yükleniyor...</p>
    )
  }

  if (!copy) {
    return (
      <p className="text-[var(--muted)]">Metinler yüklenemedi. Sayfayı yenileyin.</p>
    )
  }

  const fieldsForPage = FIELDS.filter((f) => f.page === activePage)
  const currentPageLabel = PAGES.find((p) => p.id === activePage)?.label ?? activePage

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6 mt-8 max-w-2xl">
        <p className="text-sm text-[var(--muted)] mb-4">
          Düzenlemek istediğiniz sayfayı seçin, alanları güncelleyip kaydedin. Boş bırakılan alanlar varsayılan metinle doldurulur.
        </p>

        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-[var(--border)]">
          {PAGES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActivePage(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePage === id
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--card)] border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--border)]/30"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-serif text-[var(--fg)]">{currentPageLabel}</h2>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Aşağıdaki metinler sadece bu sayfada / bölümde kullanılır.
          </p>
        </div>

        <div className="space-y-5">
          {fieldsForPage.map(({ key, label, hint, rows = 1 }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[var(--fg)] mb-1">
                {label}
              </label>
              {hint && (
                <p className="text-xs text-[var(--muted)] mb-1">{hint}</p>
              )}
              {rows > 1 ? (
                <textarea
                  value={copy[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  rows={rows}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
                />
              ) : (
                <input
                  type="text"
                  value={copy[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
                />
              )}
            </div>
          ))}
        </div>

        <Button type="submit" variant="primary" disabled={saving} className="mt-6">
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </Card>
    </form>
  )
}
