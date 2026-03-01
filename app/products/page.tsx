import { unstable_noStore } from "next/cache"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getSiteCopy, DEFAULT_SITE_COPY } from "@/lib/siteCopy"

type ProductWithTiers = Prisma.ProductGetPayload<{
  include: { tiers: true }
}>
import Link from "next/link"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import SectionHeader from "@/components/design-system/SectionHeader"
import Button from "@/components/design-system/Button"
import Card from "@/components/design-system/Card"
import { formatPrice, PHYSICAL_PACKAGE_FEE } from "@/lib/utils"

export const dynamic = "force-dynamic"

function buildTierFeatures(packageLabel: string): Record<number, string[]> {
  return {
    30: [
      packageLabel,
      "16:9 + 9:16 (Story/Reels)",
      "MP4 teslim",
      "24 saat teslim",
      "Acil teslimat seçeneği ile 3 saat",
    ],
    60: [
      packageLabel,
      "16:9 yatay",
      "MP4 teslim",
      "24 saat teslim",
      "Acil teslimat seçeneği ile 3 saat",
    ],
    100: [
      packageLabel,
      "16:9 + 9:16 ikisi de",
      "MP4 teslim",
      "24 saat teslim",
      "Acil teslimat seçeneği ile 3 saat",
    ],
  }
}

const PRODUCT_META: Record<
  string,
  { emoji: string; bg: string; border: string; accent: string }
> = {
  ask: {
    emoji: "💕",
    bg: "bg-rose-50",
    border: "border-rose-200",
    accent: "text-rose-600",
  },
  hatira: {
    emoji: "📸",
    bg: "bg-amber-50",
    border: "border-amber-200",
    accent: "text-amber-600",
  },
  cocuk: {
    emoji: "👶",
    bg: "bg-blue-50",
    border: "border-blue-200",
    accent: "text-blue-600",
  },
}

export default async function ProductsPage() {
  unstable_noStore()
  try {
    let products: ProductWithTiers[] = []
    let copy = DEFAULT_SITE_COPY
    try {
      copy = await getSiteCopy()
    } catch {
      // keep DEFAULT_SITE_COPY
    }
    try {
      products = await prisma.product.findMany({
        where: { active: true },
        include: {
          tiers: {
            where: { active: true, physicalVariant: null },
            orderBy: [{ durationSec: "asc" }, { priceTRY: "asc" }],
          },
        },
        orderBy: { createdAt: "asc" },
      })
    } catch (err) {
      console.error("Products page DB error:", err)
      if (err && typeof (err as Error).message === "string") {
        console.error("Products page DB error message:", (err as Error).message)
      }
    }
    const packageLabel = copy?.packageCardLabel ?? DEFAULT_SITE_COPY.packageCardLabel
    const TIER_FEATURES = buildTierFeatures(packageLabel)

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          <SectionHeader
            eyebrow="Paketlerimiz"
            title="Her hikâyenin kendine özgü bir anlatımı vardır"
            description="Aşk, Hatıra ve Çocuk paketlerinde aynı kalite ve detay. Size uygun süreyi seçin; isterseniz QR kod baskılı fotoğrafı kargoyla alın."
          />

          {products.length === 0 ? (
            <div className="mt-12 text-center py-12 px-4 bg-[var(--card)] border border-[var(--border)] rounded-xl">
              <p className="text-[var(--muted)] mb-4">
                Paketler şu an listelenemiyor. Lütfen biraz sonra tekrar deneyin.
              </p>
              <Button href="/" variant="outline">
                Ana sayfaya dön
              </Button>
            </div>
          ) : (
          <div className="space-y-16 mt-12">
            {products.map((product) => {
              const meta = PRODUCT_META[product.slug] ?? PRODUCT_META.ask
              const tiers = product.tiers.filter(
                (t) => t.durationSec === 30 || t.durationSec === 60 || t.durationSec === 100
              )
              if (tiers.length === 0) return null

              return (
                <div key={product.id}>
                  <div
                    className={`rounded-2xl border-2 ${meta.border} ${meta.bg} p-6 md:p-8 mb-8`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{meta.emoji}</span>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-serif text-[var(--fg)] mb-2">
                          {product.name}
                        </h2>
                        <p className="text-[var(--muted)] leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {tiers.slice(0, 3).map((tier, index) => {
                      const duration = tier.durationSec ?? 30
                      const features = TIER_FEATURES[duration] ?? TIER_FEATURES[30]
                      const isPopular = index === 1

                      return (
                        <Card
                          key={tier.id}
                          className={`p-6 md:p-8 relative overflow-hidden transition-all hover:shadow-lg flex flex-col h-full ${
                            isPopular
                              ? "border-2 border-[var(--accent)] shadow-md"
                              : ""
                          }`}
                        >
                          {isPopular && (
                            <div className="absolute top-0 right-0 bg-[var(--accent)] text-white px-3 py-1 text-xs font-medium">
                              Popüler
                            </div>
                          )}

                          <div className="text-center mb-6">
                            <h3 className="text-xl md:text-2xl font-serif text-[var(--fg)] mb-2">
                              {tier.name}
                            </h3>
                            <p className="text-3xl md:text-4xl font-serif text-[var(--fg)] mb-1">
                              {formatPrice(tier.priceTRY)}
                            </p>
                            <p className="text-sm text-[var(--muted)]">
                              {duration} saniye
                            </p>
                          </div>

                          <div className="flex-grow flex flex-col space-y-3 mb-6">
                            {features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-sm text-[var(--fg)]"
                              >
                                <span className="text-[var(--accent)]">✓</span>
                                <span>{feature}</span>
                              </div>
                            ))}
                            <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                              <span>⏱</span>
                              <span>
                                24 saat teslim (acil teslimat seçeneği ile 3
                                saat)
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Button
                              href={`/order/start?product=${product.slug}&tier=${tier.id}`}
                              variant="outline"
                              className="w-full"
                            >
                              Sadece dijital
                            </Button>
                            <Link
                              href={`/order/start?product=${product.slug}&tier=${tier.id}&physical=1`}
                              className="block"
                            >
                              <Button
                                variant="primary"
                                className="w-full"
                              >
                                Fiziksel paket dahil (+{PHYSICAL_PACKAGE_FEE} ₺)
                              </Button>
                            </Link>
                            <p className="text-xs text-center text-[var(--muted)]">
                              QR kod baskılı fotoğraf kargolanır
                            </p>
                          </div>
                        </Card>
                      )
                    })}
                  </div>

                  <p className="text-sm text-[var(--muted)] mt-4 text-center">
                    Fiziksel pakette zarfta fotoğrafınızı yolluyoruz, arkasına QR
                    kodunu basıyoruz. Teslimat adresini sipariş formunda
                    belirteceksiniz.
                  </p>
                </div>
              )
            })}
          </div>
          )}
        </div>
      </Container>
    </Section>
  )
  } catch (err) {
    console.error("Products page error:", err)
    return (
      <Section>
        <Container>
          <div className="pt-32 pb-16 text-center">
            <h1 className="text-xl font-semibold text-[var(--fg)] mb-2">Paketler yüklenemedi</h1>
            <p className="text-[var(--muted)] mb-6">Lütfen daha sonra tekrar deneyin veya ana sayfaya dönün.</p>
            <Button href="/" variant="primary">Ana sayfaya dön</Button>
          </div>
        </Container>
      </Section>
    )
  }
}
