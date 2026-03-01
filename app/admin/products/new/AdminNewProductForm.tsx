"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Card from "@/components/design-system/Card"
import Button from "@/components/design-system/Button"

export default function AdminNewProductForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    isPhysical: false,
    tiers: [{ name: "30 Saniye", priceTRY: "6900", durationSec: "30" }],
  })

  const addTier = () => {
    setForm((f) => ({
      ...f,
      tiers: [...f.tiers, { name: "", priceTRY: "", durationSec: "" }],
    }))
  }

  const removeTier = (i: number) => {
    setForm((f) => ({
      ...f,
      tiers: f.tiers.filter((_, j) => j !== i),
    }))
  }

  const updateTier = (i: number, field: string, value: string) => {
    setForm((f) => ({
      ...f,
      tiers: f.tiers.map((t, j) =>
        j === i ? { ...t, [field]: value } : t
      ),
    }))
  }

  const submit = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      alert("Ad ve slug gerekli")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug.replace(/\s+/g, "-").toLowerCase(),
          description: form.description || null,
          isPhysical: form.isPhysical,
          tiers: form.tiers
            .filter((t) => t.name.trim() && t.priceTRY)
            .map((t) => ({
              name: t.name,
              priceTRY: Number(t.priceTRY),
              durationSec: t.durationSec ? Number(t.durationSec) : null,
            })),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Oluşturulamadı")
      }
      const product = await res.json()
      router.push(`/admin/products/${product.id}`)
      router.refresh()
    } catch (e: any) {
      alert(e.message || "Hata")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-6 max-w-2xl">
      <h2 className="text-lg font-serif text-[var(--fg)] mb-4">Yeni ürün</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--muted)] mb-1">Ürün adı</label>
          <input
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value })
              if (!form.slug)
                setForm((f) => ({
                  ...f,
                  slug: e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, ""),
                }))
            }}
            className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
            placeholder="Örn. Yılbaşı"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--muted)] mb-1">Slug</label>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
            placeholder="yilbasi"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--muted)] mb-1">Açıklama</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isPhysical}
            onChange={(e) =>
              setForm({ ...form, isPhysical: e.target.checked })
            }
          />
          <span className="text-sm text-[var(--fg)]">Fiziksel paket var</span>
        </label>

        <div className="pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[var(--fg)]">Paketler</span>
            <Button variant="outline" className="!py-1 !text-sm" onClick={addTier}>
              + Paket
            </Button>
          </div>
          <div className="space-y-2">
            {form.tiers.map((tier, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center gap-2 p-2 border border-[var(--border)] rounded"
              >
                <input
                  value={tier.name}
                  onChange={(e) => updateTier(i, "name", e.target.value)}
                  placeholder="Ad"
                  className="w-32 px-2 py-1 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
                />
                <input
                  type="number"
                  value={tier.priceTRY}
                  onChange={(e) => updateTier(i, "priceTRY", e.target.value)}
                  placeholder="Fiyat"
                  className="w-24 px-2 py-1 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
                />
                <input
                  type="number"
                  value={tier.durationSec}
                  onChange={(e) => updateTier(i, "durationSec", e.target.value)}
                  placeholder="sn"
                  className="w-16 px-2 py-1 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
                />
                <button
                  type="button"
                  onClick={() => removeTier(i)}
                  className="text-[var(--muted)] hover:text-[var(--fg)] text-sm"
                >
                  Kaldır
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button onClick={submit} disabled={saving} variant="primary" className="mt-6">
        {saving ? "Oluşturuluyor..." : "Ürünü Oluştur"}
      </Button>
    </Card>
  )
}
