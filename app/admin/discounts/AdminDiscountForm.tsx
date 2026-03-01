"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Card from "@/components/design-system/Card"
import Button from "@/components/design-system/Button"

type Product = { id: string; name: string; slug: string }

type DiscountFormData = {
  code: string
  type: "PERCENTAGE" | "FIXED"
  value: string
  productId: string
  minOrderAmountTRY: string
  validFrom: string
  validUntil: string
  maxUses: string
  active: boolean
}

const defaultForm: DiscountFormData = {
  code: "",
  type: "PERCENTAGE",
  value: "",
  productId: "",
  minOrderAmountTRY: "",
  validFrom: "",
  validUntil: "",
  maxUses: "",
  active: true,
}

function formatDateForInput(d: Date | null): string {
  if (!d) return ""
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export default function AdminDiscountForm({
  discountId,
  initial,
  products: productsProp = [],
}: {
  discountId?: string
  products?: Product[]
  initial?: {
    code: string
    type: string
    value: number
    productId: string | null
    minOrderAmountTRY: number | null
    validFrom: Date | null
    validUntil: Date | null
    maxUses: number | null
    active: boolean
  }
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [products, setProducts] = useState<Product[]>(productsProp)
  const [form, setForm] = useState<DiscountFormData>(
    initial
      ? {
          code: initial.code,
          type: initial.type as "PERCENTAGE" | "FIXED",
          value: String(initial.value),
          productId: initial.productId || "",
          minOrderAmountTRY: initial.minOrderAmountTRY != null ? String(initial.minOrderAmountTRY) : "",
          validFrom: formatDateForInput(initial.validFrom),
          validUntil: formatDateForInput(initial.validUntil),
          maxUses: initial.maxUses != null ? String(initial.maxUses) : "",
          active: initial.active,
        }
      : defaultForm
  )

  useEffect(() => {
    if (productsProp.length > 0) {
      setProducts(productsProp)
      return
    }
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [productsProp.length])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code.trim()) {
      alert("Kod zorunludur")
      return
    }
    if (form.value === "" || isNaN(Number(form.value)) || Number(form.value) <= 0) {
      alert("Geçerli bir indirim değeri girin (yüzde veya tutar)")
      return
    }
    setSaving(true)
    try {
      const payload = {
        code: form.code.trim(),
        type: form.type,
        value: Number(form.value),
        productId: form.productId || null,
        minOrderAmountTRY: form.minOrderAmountTRY ? Number(form.minOrderAmountTRY) : null,
        validFrom: form.validFrom || null,
        validUntil: form.validUntil || null,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        active: form.active,
      }
      const url = discountId
        ? `/api/admin/discounts/${discountId}`
        : "/api/admin/discounts"
      const method = discountId ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Kaydedilemedi")
      }
      router.push("/admin/discounts")
      router.refresh()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Hata")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-6 max-w-xl">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--fg)] mb-1">
            İndirim kodu *
          </label>
          <input
            type="text"
            value={form.code}
            onChange={(e) =>
              setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
            }
            className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
            placeholder="Örn: YILBASI25"
            disabled={!!discountId}
          />
          {discountId && (
            <p className="text-xs text-[var(--muted)] mt-1">
              Mevcut kodu değiştiremezsiniz.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--fg)] mb-1">
              Tip
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  type: e.target.value as "PERCENTAGE" | "FIXED",
                }))
              }
              className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
            >
              <option value="PERCENTAGE">Yüzde (%)</option>
              <option value="FIXED">Sabit tutar (₺)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--fg)] mb-1">
              Değer *
            </label>
            <input
              type="number"
              min="0"
              step={form.type === "PERCENTAGE" ? "1" : "0.01"}
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
              placeholder={form.type === "PERCENTAGE" ? "25" : "500"}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--fg)] mb-1">
            Ürün (boş = tüm ürünler)
          </label>
          <select
            value={form.productId}
            onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
            className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
          >
            <option value="">Tüm ürünler</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.slug})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--fg)] mb-1">
            Min. sipariş tutarı (₺, opsiyonel)
          </label>
          <input
            type="number"
            min="0"
            value={form.minOrderAmountTRY}
            onChange={(e) =>
              setForm((f) => ({ ...f, minOrderAmountTRY: e.target.value }))
            }
            className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
            placeholder="Boş bırakılabilir"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--fg)] mb-1">
              Geçerlilik başlangıç
            </label>
            <input
              type="date"
              value={form.validFrom}
              onChange={(e) => setForm((f) => ({ ...f, validFrom: e.target.value }))}
              className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--fg)] mb-1">
              Geçerlilik bitiş
            </label>
            <input
              type="date"
              value={form.validUntil}
              onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))}
              className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--fg)] mb-1">
            Maks. kullanım (boş = sınırsız)
          </label>
          <input
            type="number"
            min="0"
            value={form.maxUses}
            onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
            className="w-full px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm((f) => ({ ...f, active: e.target.checked }))
            }
            className="rounded border-[var(--border)]"
          />
          <span className="text-sm text-[var(--fg)]">Aktif</span>
        </label>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Kaydediliyor..." : discountId ? "Güncelle" : "Oluştur"}
          </Button>
          <Link href="/admin/discounts">
            <Button type="button" variant="outline">
              İptal
            </Button>
          </Link>
        </div>
      </form>
    </Card>
  )
}
