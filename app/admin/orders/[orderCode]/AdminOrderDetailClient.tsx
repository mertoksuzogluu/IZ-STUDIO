"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import Card from "@/components/design-system/Card"
import Button from "@/components/design-system/Button"
import { formatPrice, formatDate, formatPaymentStatus } from "@/lib/utils"

interface AdminOrderDetailClientProps {
  order: any
}

export default function AdminOrderDetailClient({
  order,
}: AdminOrderDetailClientProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    status: order.status,
    previewLink: order.previewLink || "",
    adminNotes: order.adminNotes || "",
  })

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.orderCode}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Güncelleme başarısız")

      router.refresh()
      alert("Sipariş güncellendi.")
    } catch (error) {
      console.error("Update error:", error)
      alert("Bir hata oluştu.")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16 max-w-4xl mx-auto">
          <h1 className="text-4xl font-serif text-[var(--fg)] mb-2">
            Sipariş Yönetimi
          </h1>
          <p className="font-mono text-sm text-[var(--muted)] mb-8">
            {order.orderCode}
          </p>

          <div className="space-y-6">
            {/* Order Status Update */}
            <Card className="p-6">
              <h2 className="text-xl font-serif text-[var(--fg)] mb-4">
                Sipariş Durumu
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                    Durum
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                  >
                    <option value="RECEIVED">Sipariş Alındı</option>
                    <option value="IN_PRODUCTION">Üretimde</option>
                    <option value="PREVIEW_READY">Önizleme Hazır</option>
                    <option value="REVISION">Revizyon</option>
                    <option value="FINALIZING">Sonlandırılıyor</option>
                    <option value="DELIVERED">Teslim Edildi</option>
                    <option value="CANCELLED">İptal Edildi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                    Önizleme Linki
                  </label>
                  <input
                    type="url"
                    value={formData.previewLink}
                    onChange={(e) =>
                      setFormData({ ...formData, previewLink: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                    Admin Notları
                  </label>
                  <textarea
                    value={formData.adminNotes}
                    onChange={(e) =>
                      setFormData({ ...formData, adminNotes: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                    placeholder="İç notlar..."
                  />
                </div>

                <Button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  variant="primary"
                >
                  {isUpdating ? "Güncelleniyor..." : "Güncelle"}
                </Button>
              </div>
            </Card>

            {/* Order Info */}
            <Card className="p-6">
              <h2 className="text-xl font-serif text-[var(--fg)] mb-4">
                Sipariş Bilgileri
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Müşteri:</span>
                  <span className="font-medium">
                    {order.user?.email || order.guestEmail || "N/A"} {order.user?.name && `(${order.user.name})`}
                  </span>
                </div>
                {order.phoneNumber && (
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Telefon:</span>
                    <span className="font-medium">{order.phoneNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Ürün:</span>
                  <span className="font-medium">{order.product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Paket:</span>
                  <span className="font-medium">{order.tier.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Tutar:</span>
                  <span className="font-medium">
                    {formatPrice(order.totalPriceTRY)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Ödeme:</span>
                  <span className="font-medium">{formatPaymentStatus(order.paymentStatus)}</span>
                </div>
              </div>
            </Card>

            {/* Brief */}
            {order.brief && (
              <Card className="p-6">
                <h2 className="text-xl font-serif text-[var(--fg)] mb-4">
                  Hikâye Detayları
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-[var(--muted)]">İsimler:</span>
                    <p className="font-medium">{order.brief.names}</p>
                  </div>
                  {order.brief.occasion && (
                    <div>
                      <span className="text-sm text-[var(--muted)]">Özel Gün:</span>
                      <p className="font-medium">{order.brief.occasion}</p>
                    </div>
                  )}
                  {order.brief.notes && (
                    <div>
                      <span className="text-sm text-[var(--muted)]">Notlar:</span>
                      <p className="font-medium whitespace-pre-wrap">
                        {order.brief.notes}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Media Assets */}
            {order.mediaAssets.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-serif text-[var(--fg)] mb-4">
                  Yüklenen Dosyalar ({order.mediaAssets.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {order.mediaAssets.map((asset: any) => (
                    <a
                      key={asset.id}
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 border border-[var(--border)] rounded hover:bg-[var(--card)]"
                    >
                      <div className="text-2xl mb-2">
                        {asset.type === "PHOTO" ? "📷" : "🎥"}
                      </div>
                      <p className="text-xs text-[var(--muted)] truncate">
                        {asset.filename}
                      </p>
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Revisions */}
            {order.revisions.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-serif text-[var(--fg)] mb-4">
                  Revizyon Talepleri
                </h2>
                <div className="space-y-4">
                  {order.revisions.map((revision: any) => (
                    <div
                      key={revision.id}
                      className="p-4 bg-[var(--card)] border border-[var(--border)] rounded"
                    >
                      <p className="text-sm text-[var(--muted)] mb-2">
                        {formatDate(revision.createdAt)}
                        {revision.resolvedAt && " • Çözüldü"}
                      </p>
                      <p className="text-[var(--fg)]">{revision.message}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}

