"use client"

import { useState, useEffect } from "react"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import SectionHeader from "@/components/design-system/SectionHeader"
import Card from "@/components/design-system/Card"
import Button from "@/components/design-system/Button"

interface LegalSection {
  title: string
  content: string
  list?: string[]
}

interface LegalPage {
  title: string
  sections: LegalSection[]
}

const PAGES = [
  { key: "hakkimizda", label: "Hakkımızda", icon: "🏢", path: "/hakkimizda" },
  { key: "teslimat-iade", label: "Teslimat ve İade", icon: "📦", path: "/teslimat-iade" },
  { key: "mesafeli-satis", label: "Mesafeli Satış Sözleşmesi", icon: "📄", path: "/mesafeli-satis-sozlesmesi" },
  { key: "gizlilik", label: "Gizlilik Politikası", icon: "🔒", path: "/gizlilik" },
] as const

type PageKey = (typeof PAGES)[number]["key"]

function LegalPageEditor({ pageKey, label, icon, path }: { pageKey: PageKey; label: string; icon: string; path: string }) {
  const [page, setPage] = useState<LegalPage>({ title: "", sections: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetch("/api/admin/legal-pages")
      .then((r) => r.json())
      .then((data) => {
        if (data[pageKey]) setPage(data[pageKey])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [pageKey])

  const updateSection = (index: number, field: keyof LegalSection, value: string | string[]) => {
    setPage((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }))
  }

  const addSection = () => {
    setPage((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: "", content: "" }],
    }))
  }

  const removeSection = (index: number) => {
    setPage((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }))
  }

  const moveSection = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= page.sections.length) return
    setPage((prev) => {
      const arr = [...prev.sections]
      const temp = arr[index]
      arr[index] = arr[newIndex]
      arr[newIndex] = temp
      return { ...prev, sections: arr }
    })
  }

  const toggleList = (index: number) => {
    setPage((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) => {
        if (i !== index) return s
        if (s.list) {
          const { list, ...rest } = s
          return rest
        }
        return { ...s, list: [""] }
      }),
    }))
  }

  const addListItem = (sectionIndex: number) => {
    setPage((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === sectionIndex ? { ...s, list: [...(s.list || []), ""] } : s
      ),
    }))
  }

  const updateListItem = (sectionIndex: number, itemIndex: number, value: string) => {
    setPage((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === sectionIndex
          ? { ...s, list: s.list?.map((l, li) => (li === itemIndex ? value : l)) }
          : s
      ),
    }))
  }

  const removeListItem = (sectionIndex: number, itemIndex: number) => {
    setPage((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === sectionIndex ? { ...s, list: s.list?.filter((_, li) => li !== itemIndex) } : s
      ),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/admin/legal-pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pageKey, data: page }),
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
    return (
      <Card className="p-6">
        <p className="text-[var(--muted)]">Yükleniyor...</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xl font-serif text-[var(--fg)]">{label}</h3>
        <span className="ml-auto flex items-center gap-3">
          <a
            href={path}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Sayfayı Gör →
          </a>
          <span className="text-sm text-[var(--muted)]">{page.sections.length} bölüm</span>
          <span className="text-[var(--muted)]">{expanded ? "▲" : "▼"}</span>
        </span>
      </div>

      {expanded && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1 uppercase tracking-wider">
              Sayfa Başlığı
            </label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => setPage((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-white text-[var(--fg)] text-sm"
            />
          </div>

          <div className="space-y-4">
            {page.sections.map((section, index) => (
              <div key={index} className="p-4 border border-[var(--border)] rounded-xl bg-[var(--card)]">
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-xs text-[var(--muted)] mt-2 shrink-0 w-4">{index + 1}.</span>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(index, "title", e.target.value)}
                      placeholder="Bölüm başlığı"
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-white text-[var(--fg)] text-sm font-medium"
                    />
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(index, "content", e.target.value)}
                      placeholder="İçerik"
                      rows={3}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-white text-[var(--fg)] text-sm"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleList(index)}
                        className="text-xs text-blue-500 hover:underline"
                      >
                        {section.list ? "Liste kaldır" : "+ Liste ekle"}
                      </button>
                    </div>

                    {section.list && (
                      <div className="ml-4 space-y-2">
                        {section.list.map((item, li) => (
                          <div key={li} className="flex items-center gap-2">
                            <span className="text-xs text-[var(--muted)]">•</span>
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => updateListItem(index, li, e.target.value)}
                              placeholder="Liste maddesi"
                              className="flex-1 px-3 py-1.5 border border-[var(--border)] rounded-lg bg-white text-[var(--fg)] text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeListItem(index, li)}
                              className="px-2 py-1 text-xs text-red-500 border border-red-200 rounded hover:bg-red-50"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addListItem(index)}
                          className="text-xs text-[var(--muted)] hover:text-[var(--fg)]"
                        >
                          + Madde ekle
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveSection(index, -1)}
                      disabled={index === 0}
                      className="px-2 py-1 text-xs border border-[var(--border)] rounded hover:bg-[var(--border)]/50 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(index, 1)}
                      disabled={index === page.sections.length - 1}
                      className="px-2 py-1 text-xs border border-[var(--border)] rounded hover:bg-[var(--border)]/50 disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="px-2 py-1 text-xs text-red-500 border border-red-200 rounded hover:bg-red-50"
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
              onClick={addSection}
              className="px-4 py-2 text-sm border border-dashed border-[var(--border)] rounded-lg hover:bg-[var(--border)]/30 text-[var(--muted)]"
            >
              + Yeni bölüm ekle
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
        </div>
      )}
    </Card>
  )
}

export default function AdminLegalPagesPage() {
  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16 max-w-4xl mx-auto">
          <SectionHeader
            title="Sayfa İçerikleri"
            description="Hakkımızda, Teslimat ve İade, Mesafeli Satış Sözleşmesi sayfalarının içeriklerini düzenleyin. Değişiklikler kaydettikten sonra anında yansır."
          />

          <div className="space-y-4">
            {PAGES.map((p) => (
              <LegalPageEditor key={p.key} pageKey={p.key} label={p.label} icon={p.icon} path={p.path} />
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
