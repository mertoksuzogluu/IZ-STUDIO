"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Card from "@/components/design-system/Card"
import Button from "@/components/design-system/Button"

interface Tier {
  id: string
  name: string
  priceTRY: number
  durationSec: number | null
  physicalVariant: string | null
  active: boolean
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  isPhysical: boolean
  active: boolean
  tiers: Tier[]
}

export default function AdminProductForm({ product }: { product: Product }) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: product.name,
    slug: product.slug,
    description: product.description || "",
    isPhysical: product.isPhysical,
    active: product.active,
  })
  const [saving, setSaving] = useState(false)
  const [tiers, setTiers] = useState<Tier[]>(product.tiers)
  const [newTier, setNewTier] = useState({
    name: "",
    priceTRY: "",
    durationSec: "",
  })

  const saveProduct = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Kaydedilemedi")
      router.refresh()
    } catch (e) {
      alert("Kaydetme hatası")
    } finally {
      setSaving(false)
    }
  }

  const addTier = async () => {
    if (!newTier.name.trim() || !newTier.priceTRY) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/products/${product.id}/tiers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTier.name,
          priceTRY: Number(newTier.priceTRY),
          durationSec: newTier.durationSec ? Number(newTier.durationSec) : null,
        }),
      })
      if (!res.ok) throw new Error("Eklenemedi")
      const tier = await res.json()
      setTiers((t) => [...t, tier])
      setNewTier({ name: "", priceTRY: "", durationSec: "" })
      router.refresh()
    } catch (e) {
      alert("Tier eklenemedi")
    } finally {
      setSaving(false)
    }
  }

  const updateTier = async (tierId: string, data: Partial<Tier>) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/tiers/${tierId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Güncellenemedi")
      const updated = await res.json()
      setTiers((t) => t.map((x) => (x.id === tierId ? updated : x)))
      router.refresh()
    } catch (e) {
      alert("Güncelleme hatası")
    } finally {
      setSaving(false)
    }
  }

  const deactivateTier = async (tierId: string) => {
    if (!confirm("Bu paketi pasif yapmak istediğinize emin misiniz?")) return
    setSaving(true)
    try {
      await fetch(`/api/admin/tiers/${tierId}`, { method: "DELETE" })
      setTiers((t) => t.filter((x) => x.id !== tierId))
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-lg font-serif text-[var(--fg)] mb-4">Ürün bilgisi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[var(--muted)] mb-1">Ad</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--muted)] mb-1">Slug</label>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
            />
          </div>
          <div className="md:col-span-2">
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
              onChange={(e) => setForm({ ...form, isPhysical: e.target.checked })}
            />
            <span className="text-sm text-[var(--fg)]">Fiziksel paket var</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            <span className="text-sm text-[var(--fg)]">Aktif</span>
          </label>
        </div>
        <Button onClick={saveProduct} disabled={saving} variant="primary" className="mt-4">
          {saving ? "Kaydediliyor..." : "Ürünü Kaydet"}
        </Button>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-serif text-[var(--fg)] mb-2">Paketler (tier)</h2>
        <p className="text-sm text-[var(--muted)] mb-4">Fiyat ve süre değişiklikleri sitede anında yansır.</p>
        <div className="space-y-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="flex flex-wrap items-center gap-4 p-4 border border-[var(--border)] rounded-lg"
            >
              <input
                value={tier.name}
                onChange={(e) =>
                  setTiers((t) =>
                    t.map((x) =>
                      x.id === tier.id ? { ...x, name: e.target.value } : x
                    )
                  )
                }
                onBlur={(e) => {
                  const v = e.target.value.trim()
                  if (v !== tier.name) updateTier(tier.id, { name: v })
                }}
                className="w-32 px-2 py-1 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
              />
              <input
                type="text"
                inputMode="numeric"
                value={tier.priceTRY === 0 ? "" : tier.priceTRY}
                onChange={(e) => {
                  const raw = e.target.value.replace(",", ".")
                  if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
                    const num = raw === "" ? 0 : Number(raw)
                    setTiers((t) =>
                      t.map((x) =>
                        x.id === tier.id ? { ...x, priceTRY: num } : x
                      )
                    )
                  }
                }}
                onBlur={(e) => {
                  const raw = e.target.value.replace(",", ".")
                  const v = raw === "" ? 0 : Number(raw)
                  if (!isNaN(v)) updateTier(tier.id, { priceTRY: Math.round(v) })
                }}
                placeholder="0"
                className="w-28 px-2 py-1 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
              />
              <span className="text-[var(--muted)]">₺</span>
              <input
                type="number"
                placeholder="sn"
                value={tier.durationSec ?? ""}
                onChange={(e) => {
                  const v = e.target.value
                  setTiers((t) =>
                    t.map((x) =>
                      x.id === tier.id
                        ? {
                            ...x,
                            durationSec: v === "" ? null : Number(v),
                          }
                        : x
                    )
                  )
                }}
                onBlur={(e) => {
                  const v = e.target.value
                  const num = v === "" ? null : Number(v)
                  if (num !== tier.durationSec)
                    updateTier(tier.id, { durationSec: num })
                }}
                className="w-20 px-2 py-1 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
              />
              <span className="text-[var(--muted)] text-sm">saniye</span>
              <Button
                variant="outline"
                className="!py-1 !text-xs"
                onClick={() => deactivateTier(tier.id)}
              >
                Pasif yap
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-end gap-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg">
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Paket adı</label>
            <input
              value={newTier.name}
              onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
              placeholder="Örn. 30 Saniye"
              className="w-40 px-3 py-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--fg)]"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Fiyat (₺)</label>
            <input
              type="number"
              value={newTier.priceTRY}
              onChange={(e) => setNewTier({ ...newTier, priceTRY: e.target.value })}
              placeholder="6900"
              className="w-28 px-3 py-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--fg)]"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--muted)] mb-1">Süre (sn)</label>
            <input
              type="number"
              value={newTier.durationSec}
              onChange={(e) =>
                setNewTier({ ...newTier, durationSec: e.target.value })
              }
              placeholder="30"
              className="w-24 px-3 py-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--fg)]"
            />
          </div>
          <Button
            onClick={addTier}
            disabled={saving || !newTier.name.trim() || !newTier.priceTRY}
            variant="primary"
          >
            Paket ekle
          </Button>
        </div>
      </Card>
    </div>
  )
}
