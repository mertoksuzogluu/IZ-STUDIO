"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Card from "@/components/design-system/Card"
import Button from "@/components/design-system/Button"
import {
  formatPrice,
  formatDate,
  formatOrderStatus,
  formatPaymentStatus,
  getWeekLabel,
  getWeekKey,
  ACTIVE_STATUSES,
  COMPLETED_STATUSES,
} from "@/lib/utils"

interface OrderItem {
  id: string
  orderCode: string
  status: string
  paymentStatus: string
  totalPriceTRY: number
  createdAt: string
  updatedAt: string
  userEmail: string
  userName: string
  productName: string
  tierName: string
}

interface WeekGroup {
  key: number
  label: string
  orders: OrderItem[]
  totalRevenue: number
}

function groupByWeek(orders: OrderItem[]): WeekGroup[] {
  const groups: Record<number, WeekGroup> = {}
  for (const order of orders) {
    const k = getWeekKey(new Date(order.createdAt))
    if (!groups[k]) {
      groups[k] = {
        key: k,
        label: getWeekLabel(new Date(order.createdAt)),
        orders: [],
        totalRevenue: 0,
      }
    }
    groups[k].orders.push(order)
    if (order.paymentStatus === "PAID") {
      groups[k].totalRevenue += order.totalPriceTRY
    }
  }
  return Object.values(groups).sort((a, b) => a.key - b.key)
}

function WeekAccordion({ group, defaultOpen }: { group: WeekGroup; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-4 bg-[var(--card)] hover:bg-[var(--border)]/30 transition-colors touch-manipulation"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <svg
            className={`w-4 h-4 text-[var(--muted)] transition-transform ${open ? "rotate-90" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="font-medium text-[var(--fg)]">{group.label}</span>
          <span className="text-sm text-[var(--muted)]">{group.orders.length} sipariş</span>
        </div>
        <span className="font-serif text-[var(--fg)]">{formatPrice(group.totalRevenue)}</span>
      </button>

      {open && (
        <div className="divide-y divide-[var(--border)]">
          {group.orders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.orderCode}`}>
              <div className="flex items-center justify-between px-5 py-4 hover:bg-[var(--border)]/20 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs text-[var(--muted)]">{order.orderCode}</span>
                    <StatusBadge status={order.status} />
                    <PaymentBadge status={order.paymentStatus} />
                  </div>
                  <p className="text-sm font-medium text-[var(--fg)]">
                    {order.productName} — {order.tierName}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {order.userEmail} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-lg font-serif text-[var(--fg)]">{formatPrice(order.totalPriceTRY)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    RECEIVED: "bg-yellow-50 text-yellow-700 border-yellow-200",
    IN_PRODUCTION: "bg-blue-50 text-blue-700 border-blue-200",
    PREVIEW_READY: "bg-purple-50 text-purple-700 border-purple-200",
    REVISION: "bg-orange-50 text-orange-700 border-orange-200",
    FINALIZING: "bg-cyan-50 text-cyan-700 border-cyan-200",
    DELIVERED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
  }
  return (
    <span className={`px-2 py-0.5 text-xs rounded border ${colors[status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
      {formatOrderStatus(status)}
    </span>
  )
}

function PaymentBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    PAID: "bg-green-50 text-green-700 border-green-200",
    FAILED: "bg-red-50 text-red-700 border-red-200",
    REFUNDED: "bg-gray-50 text-gray-700 border-gray-200",
  }
  return (
    <span className={`px-2 py-0.5 text-xs rounded border ${colors[status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
      {formatPaymentStatus(status)}
    </span>
  )
}

export default function AdminOrdersList({
  orders,
  initialTab,
  initialSearch,
}: {
  orders: OrderItem[]
  initialTab: string
  initialSearch: string
}) {
  const [tab, setTab] = useState<"all" | "active" | "completed">(
    initialTab === "completed" ? "completed" : initialTab === "active" ? "active" : "all"
  )
  const [search, setSearch] = useState(initialSearch)

  const filtered = useMemo(() => {
    let result = orders
    if (tab === "active") {
      result = result.filter((o) => (ACTIVE_STATUSES as readonly string[]).includes(o.status))
    } else if (tab === "completed") {
      result = result.filter((o) => (COMPLETED_STATUSES as readonly string[]).includes(o.status))
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.orderCode.toLowerCase().includes(q) ||
          o.userEmail.toLowerCase().includes(q) ||
          o.productName.toLowerCase().includes(q)
      )
    }
    return result
  }, [orders, tab, search])

  const weekGroups = useMemo(() => groupByWeek(filtered), [filtered])

  const activeCount = orders.filter((o) => (ACTIVE_STATUSES as readonly string[]).includes(o.status)).length
  const completedCount = orders.filter((o) => (COMPLETED_STATUSES as readonly string[]).includes(o.status)).length
  const totalCount = orders.length

  const [clearing, setClearing] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const router = useRouter()

  const handleClearAllOrders = async () => {
    setClearing(true)
    try {
      const res = await fetch("/api/admin/orders/clear-all", { method: "POST" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "İşlem başarısız")
      setShowClearConfirm(false)
      router.refresh()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Siparişler silinemedi.")
    } finally {
      setClearing(false)
    }
  }

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-[var(--fg)] mb-2">Sipariş Yönetimi</h1>
          <p className="text-[var(--muted)]">Siparişleri haftalık olarak görüntüleyin ve yönetin.</p>
        </div>
        {orders.length > 0 && (
          <div>
            <Button
              type="button"
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => setShowClearConfirm(true)}
            >
              Tüm siparişleri temizle (test)
            </Button>
          </div>
        )}
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-lg font-serif text-[var(--fg)] mb-2">Tüm siparişleri sil</h3>
            <p className="text-sm text-[var(--muted)] mb-6">
              Tüm siparişler ve ilişkili veriler (brief, medya, kargo vb.) kalıcı olarak silinecek. Bu işlem geri alınamaz. Devam edilsin mi?
            </p>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowClearConfirm(false)} disabled={clearing}>
                İptal
              </Button>
              <Button
                type="button"
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleClearAllOrders}
                disabled={clearing}
              >
                {clearing ? "Siliniyor…" : "Evet, tümünü sil"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Sekmeler */}
      <div className="flex gap-1 p-1 bg-[var(--border)]/50 rounded-xl mb-6 w-fit">
        <button
          type="button"
          onClick={() => setTab("all")}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            tab === "all"
              ? "bg-white text-[var(--fg)] shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--fg)]"
          }`}
        >
          Tümü ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => setTab("active")}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            tab === "active"
              ? "bg-white text-[var(--fg)] shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--fg)]"
          }`}
        >
          Aktif ({activeCount})
        </button>
        <button
          type="button"
          onClick={() => setTab("completed")}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            tab === "completed"
              ? "bg-white text-[var(--fg)] shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--fg)]"
          }`}
        >
          Tamamlanan ({completedCount})
        </button>
      </div>

      {/* Arama */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Sipariş kodu, e-posta veya ürün ara..."
          className="w-full max-w-md px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--card)] text-[var(--fg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      {/* Haftalık gruplar */}
      <div className="space-y-4">
        {weekGroups.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-[var(--muted)]">
              {tab === "active"
                ? "Aktif sipariş bulunmuyor."
                : tab === "completed"
                ? "Tamamlanan sipariş bulunmuyor."
                : "Sipariş bulunmuyor."}
            </p>
          </Card>
        ) : (
          weekGroups.map((group) => (
            <WeekAccordion key={group.key} group={group} defaultOpen={group.key === 0} />
          ))
        )}
      </div>
    </>
  )
}
