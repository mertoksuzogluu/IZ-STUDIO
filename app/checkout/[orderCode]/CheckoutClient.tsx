"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Button from "@/components/design-system/Button"
import Card from "@/components/design-system/Card"
import { formatPrice } from "@/lib/utils"

interface CheckoutClientProps {
  order: {
    orderCode: string
    totalPriceTRY: number
    urgentDelivery?: boolean
    uhd4k?: boolean
    physicalPackage?: boolean
    discountAmountTRY?: number
    product: { name: string } | null
    tier: { name: string } | null
  }
}

export default function CheckoutClient({ order }: CheckoutClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const err = searchParams?.get("error")
    if (err === "payment_failed") setError("Ödeme başarısız oldu. Lütfen tekrar deneyin.")
  }, [searchParams])

  const handlePayment = async () => {
    setIsProcessing(true)
    setError("")

    try {
      const response = await fetch(`/api/payment/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode: order.orderCode }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Ödeme başlatılamadı")

      window.location.href = data.paymentUrl
    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err.message || "Ödeme başlatılamadı. Lütfen tekrar deneyin.")
      setIsProcessing(false)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-serif text-[var(--fg)] mb-2">
        Ödeme
      </h1>
      <p className="text-[var(--muted)] mb-8">
        Sipariş kodunuz: <span className="font-mono">{order.orderCode}</span>
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <Card className="p-8 mb-6">
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Ürün:</span>
            <span className="font-medium text-[var(--fg)]">
              {order.product?.name || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Paket:</span>
            <span className="font-medium text-[var(--fg)]">
              {order.tier?.name || "N/A"}
            </span>
          </div>
          {order.urgentDelivery && (
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Acil teslimat (3 saat):</span>
              <span className="text-[var(--fg)]">+300 ₺</span>
            </div>
          )}
          {order.uhd4k && (
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">4K video:</span>
              <span className="text-[var(--fg)]">+200 ₺</span>
            </div>
          )}
          {order.physicalPackage && (
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Fiziksel paket:</span>
              <span className="text-[var(--fg)]">+150 ₺</span>
            </div>
          )}
          {(order.discountAmountTRY ?? 0) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>İndirim:</span>
              <span>-{formatPrice(order.discountAmountTRY!)}</span>
            </div>
          )}
          <div className="border-t border-[var(--border)] pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-[var(--fg)]">Toplam:</span>
              <span className="text-3xl font-serif text-[var(--fg)]">
                {formatPrice(order.totalPriceTRY)}
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? "Ödeme sayfasına yönlendiriliyorsunuz..." : "Güvenli Ödemeye Geç"}
        </Button>

        <div className="flex items-center justify-center gap-2 mt-4">
          <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-xs text-[var(--muted)]">256-bit SSL ile güvenli ödeme — iyzico altyapısı</span>
        </div>
      </Card>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 mb-2">
          <strong>Bilgi:</strong> Ödeme iyzico güvenli ödeme sayfasında gerçekleşir.
        </p>
        <p className="text-xs text-blue-700">
          Kredi kartı, banka kartı ve taksit seçenekleri mevcuttur. Ödeme sonrası otomatik olarak siparişinize yönlendirilirsiniz.
        </p>
      </div>
    </div>
  )
}

