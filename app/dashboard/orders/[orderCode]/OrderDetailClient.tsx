"use client"

import { useState } from "react"
import Card from "@/components/design-system/Card"
import Button from "@/components/design-system/Button"
import { formatPrice, formatDate, formatPaymentStatus } from "@/lib/utils"

interface OrderDetailClientProps {
  order: any
  showPaymentSuccess?: boolean
}

const statusSteps = [
  "RECEIVED",
  "IN_PRODUCTION",
  "PREVIEW_READY",
  "REVISION",
  "FINALIZING",
  "DELIVERED",
]

export default function OrderDetailClient({ order, showPaymentSuccess }: OrderDetailClientProps) {
  const [revisionMessage, setRevisionMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentStatusIndex = statusSteps.indexOf(order.status)

  const handleRevision = async () => {
    if (!revisionMessage.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/orders/${order.orderCode}/revision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: revisionMessage }),
      })

      if (!response.ok) throw new Error("Revizyon talebi gönderilemedi")

      alert("Revizyon talebiniz gönderildi.")
      setRevisionMessage("")
    } catch (error) {
      console.error("Revision error:", error)
      alert("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Payment Success Info */}
      {showPaymentSuccess && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="text-2xl">📋</div>
            <div className="flex-1">
              <h3 className="text-lg font-serif text-blue-900 mb-2">
                Siparişiniz Sıraya Alındı
              </h3>
              <p className="text-blue-800 text-sm mb-3">
                Siparişiniz başarıyla kaydedildi ve üretim sürecine alındı. Fotoğraf ve hikâyenizi formdan paylaştınız; teslim 24 saat (acil seçeneği ile 3 saat). Sorularınız için WhatsApp üzerinden iletişime geçebilirsiniz.
              </p>
              <div className="bg-white p-3 rounded border border-blue-200">
                <p className="text-xs text-blue-600 mb-1">Sipariş Kodunuz:</p>
                <p className="font-mono text-base font-bold text-blue-900">
                  {order.orderCode}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Status Timeline */}
      <Card className="p-6">
        <h2 className="text-xl font-serif text-[var(--fg)] mb-6">
          Sipariş Durumu
        </h2>
        <div className="space-y-4">
          {statusSteps.map((status, index) => {
            const isActive = index <= currentStatusIndex
            const isCurrent = index === currentStatusIndex

            return (
              <div key={status} className="flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isActive
                      ? "bg-[var(--accent)]"
                      : "bg-[var(--border)]"
                  }`}
                />
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      isActive ? "text-[var(--fg)]" : "text-[var(--muted)]"
                    }`}
                  >
                    {status === "RECEIVED" && "Sipariş Alındı"}
                    {status === "IN_PRODUCTION" && "Üretimde"}
                    {status === "PREVIEW_READY" && "Önizleme Hazır"}
                    {status === "REVISION" && "Revizyon"}
                    {status === "FINALIZING" && "Sonlandırılıyor"}
                    {status === "DELIVERED" && "Teslim Edildi"}
                    {isCurrent && " (Mevcut)"}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Order Info */}
      <Card className="p-6">
        <h2 className="text-xl font-serif text-[var(--fg)] mb-4">
          Sipariş Bilgileri
        </h2>
        <div className="space-y-3">
          <div className="pb-3 mb-3 border-b border-[var(--border)]">
            <span className="text-sm text-[var(--muted)] block mb-2">Sipariş Kodu:</span>
            <span className="font-mono text-xl font-bold text-[var(--fg)] bg-[var(--card)] px-4 py-2 rounded border border-[var(--border)] inline-block">
              {order.orderCode}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Ürün:</span>
            <span className="font-medium">{order.product.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Paket:</span>
            <span className="font-medium">{order.tier.name}</span>
          </div>
          {order.urgentDelivery && (
            <div className="flex justify-between text-[var(--accent)]">
              <span className="text-[var(--muted)]">Teslimat:</span>
              <span className="font-medium">Acil (3 saat)</span>
            </div>
          )}
          {order.uhd4k && (
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">4K video:</span>
              <span className="font-medium">Evet</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Tutar:</span>
            <span className="font-medium">{formatPrice(order.totalPriceTRY)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Ödeme:</span>
            <span className="font-medium">{formatPaymentStatus(order.paymentStatus)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Tarih:</span>
            <span className="font-medium">{formatDate(order.createdAt)}</span>
          </div>
          {order.phoneNumber && (
            <div className="flex justify-between pt-3 border-t border-[var(--border)]">
              <span className="text-[var(--muted)]">Telefon:</span>
              <span className="font-medium">{order.phoneNumber}</span>
            </div>
          )}
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
            {order.brief.tone && (
              <div>
                <span className="text-sm text-[var(--muted)]">Ton:</span>
                <p className="font-medium">{order.brief.tone}</p>
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

      {/* Preview Link */}
      {order.previewLink && (
        <Card className="p-6">
          <h2 className="text-xl font-serif text-[var(--fg)] mb-4">
            Önizleme
          </h2>
          <a
            href={order.previewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            Önizlemeyi Görüntüle →
          </a>
        </Card>
      )}

      {/* Delivery Assets */}
      {order.deliveryAssets.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-serif text-[var(--fg)] mb-4">
            Teslim Edilen Dosyalar
          </h2>
          <div className="space-y-2">
            {order.deliveryAssets.map((asset: any) => (
              <a
                key={asset.id}
                href={asset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border border-[var(--border)] rounded hover:bg-[var(--card)]"
              >
                📄 {asset.filename}
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Revision Request */}
      {order.status === "PREVIEW_READY" && (
        <Card className="p-6">
          <h2 className="text-xl font-serif text-[var(--fg)] mb-4">
            Revizyon Talebi
          </h2>
          <textarea
            value={revisionMessage}
            onChange={(e) => setRevisionMessage(e.target.value)}
            placeholder="Revizyon talebinizi buraya yazın..."
            rows={4}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)] mb-4"
          />
          <Button
            onClick={handleRevision}
            disabled={!revisionMessage.trim() || isSubmitting}
            variant="primary"
          >
            {isSubmitting ? "Gönderiliyor..." : "Revizyon Talebi Gönder"}
          </Button>
        </Card>
      )}

      {/* QR Link */}
      {order.qrLink && order.qrLink.isActive && (
        <Card className="p-6">
          <h2 className="text-xl font-serif text-[var(--fg)] mb-4">
            Fiziksel Paket QR Kodu
          </h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Zarfta fotoğrafınızı yolluyoruz, arkasına QR kodunu basıyoruz. Bu QR kodu tarayarak videonuza erişebilirsiniz.
          </p>
          <a
            href={`/v/${order.qrLink.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            QR Linki Aç →
          </a>
        </Card>
      )}
    </div>
  )
}

