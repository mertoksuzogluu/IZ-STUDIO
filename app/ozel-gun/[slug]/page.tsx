import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { getSiteCopy } from "@/lib/siteCopy"
import { notFound } from "next/navigation"
import ThemeShell from "@/components/ThemeShell"
import {
  SLUG_TO_SPECIAL_THEME,
  SPECIAL_DAY_COPY,
  SPECIAL_DAY_PRODUCTS,
  type SpecialThemeKey,
} from "@/lib/themes"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import SectionHeader from "@/components/design-system/SectionHeader"
import Button from "@/components/design-system/Button"
import Card from "@/components/design-system/Card"
import Link from "next/link"
import { formatPrice, PHYSICAL_PACKAGE_FEE } from "@/lib/utils"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const themeKey = SLUG_TO_SPECIAL_THEME[params.slug]
  if (!themeKey) return { title: "Sayfa bulunamadı" }
  const day = SPECIAL_DAY_COPY[themeKey]
  return {
    title: `${day.title}’ne Özel Film | Feel Studio`,
    description: day.message,
  }
}

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

export default async function OzelGunPage({
  params,
}: {
  params: { slug: string }
}) {
  const themeKey = SLUG_TO_SPECIAL_THEME[params.slug] as
    | SpecialThemeKey
    | undefined
  if (!themeKey) notFound()

  const dayCopy = SPECIAL_DAY_COPY[themeKey]
  const allowedSlugs = SPECIAL_DAY_PRODUCTS[themeKey]
  const [products, copy] = await Promise.all([
    prisma.product.findMany({
      where: { active: true, slug: { in: allowedSlugs } },
      include: {
        tiers: {
          where: { active: true, physicalVariant: null },
          orderBy: [{ durationSec: "asc" }, { priceTRY: "asc" }],
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    getSiteCopy(),
  ])
  const TIER_FEATURES = buildTierFeatures(copy.packageCardLabel)

  return (
    <ThemeShell themeKey={themeKey}>
      <Section>
        <Container>
          <div className="pt-24 pb-12 md:pt-28 md:pb-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-sm uppercase tracking-widest text-[var(--accent)] font-sans mb-3">
                {dayCopy.title}
              </p>
              <h1 className="text-3xl md:text-4xl font-serif text-[var(--fg)] mb-4 tracking-tight">
                {dayCopy.title}’ne özel sinematik film
              </h1>
              <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed">
                {dayCopy.message}
              </p>
            </div>

            <SectionHeader
              eyebrow="Paketler"
              title="Aynı kalite, özel güne özel hediye"
              description="Aşk, Hatıra veya Çocuk paketlerinden birini seçin; süreyi ve dijital/fiziksel seçeneğini belirleyin."
            />

            <div className="space-y-16 mt-12">
              {products.map((product) => {
                const meta = PRODUCT_META[product.slug] ?? PRODUCT_META.ask
                const tiers = product.tiers.filter(
                  (t) =>
                    t.durationSec === 30 ||
                    t.durationSec === 60 ||
                    t.durationSec === 100
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
                        const features =
                          TIER_FEATURES[duration] ?? TIER_FEATURES[30]
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
                                  <span className="text-[var(--accent)]">
                                    ✓
                                  </span>
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
                                  Fiziksel paket dahil (+{PHYSICAL_PACKAGE_FEE}{" "}
                                  ₺)
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
                      Fiziksel pakette zarfta fotoğrafınızı yolluyoruz, arkasına
                      QR kodunu basıyoruz. Teslimat adresini sipariş formunda
                      belirteceksiniz.
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </Container>
      </Section>
    </ThemeShell>
  )
}
