"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSession } from "next-auth/react"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import Button from "@/components/design-system/Button"
import Card from "@/components/design-system/Card"
import { formatPrice, PHYSICAL_PACKAGE_FEE } from "@/lib/utils"

const ACIL_FEE = 300
const UHD4K_FEE = 200

interface OrderStartFormProps {
  productId: string
  productSlug: string
  tierId: string
  physicalPackage?: boolean
  tier: {
    name: string
    priceTRY: number
    durationSec: number | null
    productName: string
  }
}

export default function OrderStartForm({
  productId,
  productSlug,
  tierId,
  physicalPackage: initialPhysical = false,
  tier,
}: OrderStartFormProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [urgentDelivery, setUrgentDelivery] = useState(false)
  const [uhd4k, setUhd4k] = useState(false)
  const [physicalPackage, setPhysicalPackage] = useState(initialPhysical)
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string
    amountTRY: number
  } | null>(null)
  const [discountError, setDiscountError] = useState<string | null>(null)

  const basePrice = tier.priceTRY
  const subtotal =
    basePrice +
    (urgentDelivery ? ACIL_FEE : 0) +
    (uhd4k ? UHD4K_FEE : 0) +
    (physicalPackage ? PHYSICAL_PACKAGE_FEE : 0)
  const total = Math.max(0, subtotal - (appliedDiscount?.amountTRY ?? 0))

  const applyDiscount = async () => {
    if (!discountCode.trim()) return
    setDiscountError(null)
    try {
      const res = await fetch(
        `/api/discounts/validate?code=${encodeURIComponent(discountCode.trim())}&subtotalTRY=${subtotal}&productId=${encodeURIComponent(productId)}`
      )
      const data = await res.json()
      if (data.valid && data.amountTRY > 0) {
        setAppliedDiscount({ code: data.code, amountTRY: data.amountTRY })
      } else {
        setAppliedDiscount(null)
        setDiscountError(data.error || "Geçersiz indirim kodu")
      }
    } catch {
      setAppliedDiscount(null)
      setDiscountError("Kod kontrol edilemedi")
    }
  }

  const handleStartOrder = async (asGuest: boolean = false) => {
    if (!asGuest && !session) {
      const returnUrl = `/order/start?product=${productSlug}&tier=${tierId}`
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(returnUrl)}`)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          tierId,
          guest: asGuest && !session,
          urgentDelivery,
          uhd4k,
          physicalPackage,
          discountCode: appliedDiscount?.code || discountCode.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Sipariş oluşturulamadı")
      }

      const { orderCode } = await response.json()
      if (orderCode) {
        router.push(`/order/${orderCode}/brief`)
      } else {
        throw new Error("Sipariş kodu alınamadı")
      }
    } catch (error: any) {
      console.error("Order creation error:", error)
      alert(error.message || "Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <Section>
        <Container>
          <div className="pt-32 pb-16 text-center">
            <p className="text-[var(--muted)]">Yükleniyor...</p>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl font-serif text-[var(--fg)] mb-6 text-center">
            Siparişinizi Oluşturun
          </h1>
          <p className="text-[var(--muted)] mb-8 text-center">
            Fotoğraf ve hikâyenizi sipariş formunda paylaşacaksınız. Aşağıdan
            seçenekleri işaretleyip toplam tutarı görün.
          </p>

          {/* Sepet özeti - sadece formda */}
          <Card className="p-6 mb-8 text-left">
            <h2 className="text-lg font-serif text-[var(--fg)] mb-4">
              Sipariş özeti
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">
                  {tier.productName} — {tier.name}
                  {tier.durationSec ? ` (${tier.durationSec} sn)` : ""}
                </span>
                <span className="font-medium text-[var(--fg)]">
                  {formatPrice(basePrice)}
                </span>
              </div>
              <label className="flex items-center justify-between gap-3 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={urgentDelivery}
                  onChange={(e) => setUrgentDelivery(e.target.checked)}
                  className="rounded border-[var(--border)]"
                />
                <span className="flex-1 text-[var(--fg)]">
                  Acil teslimat (3 saat)
                </span>
                <span className="text-[var(--accent)]">+300 ₺</span>
              </label>
              <label className="flex items-center justify-between gap-3 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uhd4k}
                  onChange={(e) => setUhd4k(e.target.checked)}
                  className="rounded border-[var(--border)]"
                />
                <span className="flex-1 text-[var(--fg)]">4K video</span>
                <span className="text-[var(--accent)]">+200 ₺</span>
              </label>
              <label className="flex items-center justify-between gap-3 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={physicalPackage}
                  onChange={(e) => setPhysicalPackage(e.target.checked)}
                  className="rounded border-[var(--border)]"
                />
                <span className="flex-1 text-[var(--fg)]">
                  Fiziksel paket (QR kod baskılı fotoğraf kargolanır)
                </span>
                <span className="text-[var(--accent)]">+{PHYSICAL_PACKAGE_FEE} ₺</span>
              </label>
              <div className="pt-2 border-t border-[var(--border)]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => {
                      setDiscountCode(e.target.value.toUpperCase())
                      setAppliedDiscount(null)
                      setDiscountError(null)
                    }}
                    placeholder="İndirim kodu"
                    className="flex-1 px-4 py-2 border border-[var(--border)] rounded bg-[var(--card)] text-[var(--fg)]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={applyDiscount}
                    className="shrink-0"
                  >
                    Uygula
                  </Button>
                </div>
                {discountError && (
                  <p className="text-xs text-red-600 mt-1">{discountError}</p>
                )}
                {appliedDiscount && (
                  <p className="text-xs text-green-600 mt-1">
                    İndirim uygulandı: -{formatPrice(appliedDiscount.amountTRY)}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[var(--border)] mt-4 pt-4 flex justify-between items-center">
              <span className="font-medium text-[var(--fg)]">Toplam</span>
              <span className="text-2xl font-serif text-[var(--fg)]">
                {formatPrice(total)}
              </span>
            </div>
          </Card>

          <div className="space-y-4">
            {session ? (
              <Button
                onClick={() => handleStartOrder(false)}
                disabled={isLoading}
                variant="primary"
                className="w-full"
              >
                {isLoading ? "Oluşturuluyor..." : "Devam Et"}
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => handleStartOrder(false)}
                  disabled={isLoading}
                  variant="primary"
                  className="w-full"
                >
                  {isLoading ? "Oluşturuluyor..." : "Giriş Yap ve Devam Et"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border)]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[var(--bg)] px-2 text-[var(--muted)]">
                      veya
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => handleStartOrder(true)}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? "Oluşturuluyor..." : "Kayıt Olmadan Devam Et"}
                </Button>
                <p className="text-xs text-center text-[var(--muted)]">
                  Kayıt olmadan devam ederseniz siparişinizi takip etmek için
                  e-posta adresiniz gerekecektir.
                </p>
              </>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
