import { prisma } from "@/lib/prisma"
import { getSiteCopy, DEFAULT_SITE_COPY } from "@/lib/siteCopy"
import { notFound } from "next/navigation"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import SectionHeader from "@/components/design-system/SectionHeader"
import Button from "@/components/design-system/Button"
import Card from "@/components/design-system/Card"
import { formatPrice, PHYSICAL_PACKAGE_FEE } from "@/lib/utils"

const DURATION_FEATURES: Record<number, string> = {
  30: "Sadece 9:16 (Story/Reels)",
  60: "16:9 yatay",
  100: "16:9 + 9:16 ikisi de",
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug, active: true },
      include: {
        tiers: {
          where: {
            active: true,
            durationSec: { in: [30, 60, 100] },
            physicalVariant: null,
          },
          orderBy: { durationSec: "asc" },
        },
      },
    })

    if (!product) {
      notFound()
    }

    let copy = DEFAULT_SITE_COPY
    try {
      copy = await getSiteCopy()
    } catch {
      // keep DEFAULT_SITE_COPY
    }
    const tiers = product.tiers

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              title={product.name}
              description={product.description || undefined}
            />

            {tiers.length === 0 ? (
              <div className="mt-12 p-8 rounded-xl bg-[var(--card)] border border-[var(--border)] text-center">
                <p className="text-[var(--muted)] mb-6">
                  Paketler şu an güncelleniyor. Lütfen kısa süre sonra tekrar
                  deneyin veya bizimle iletişime geçin.
                </p>
                <Button href="/products" variant="outline">
                  Tüm paketlere dön
                </Button>
              </div>
            ) : (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {tiers.map((tier, index) => {
                const duration = tier.durationSec ?? 30
                const isPopular = index === 1
                const formatLine = DURATION_FEATURES[duration] ?? "MP4 teslim"

                return (
                  <Card
                    key={tier.id}
                    className={`p-8 relative overflow-hidden transition-all hover:shadow-lg flex flex-col h-full ${
                      isPopular ? "border-2 border-[var(--accent)] shadow-md" : ""
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute top-0 right-0 bg-[var(--accent)] text-white px-3 py-1 text-xs font-medium">
                        Popüler
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-serif text-[var(--fg)] mb-3">
                        {tier.name}
                      </h3>
                      <p className="text-4xl font-serif text-[var(--fg)] mb-1">
                        {formatPrice(tier.priceTRY)}
                      </p>
                      <p className="text-sm text-[var(--muted)]">
                        {duration} saniye
                      </p>
                    </div>

                    <div className="flex-grow flex flex-col space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-[var(--fg)]">
                        <span className="text-[var(--accent)]">✨</span>
                        <span>{copy.productDetailSubtitle}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--fg)]">
                        <span className="text-[var(--accent)]">🎬</span>
                        <span>{formatLine}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                        <span className="text-[var(--accent)]">⏱</span>
                        <span>24 saat teslim (acil teslimat seçeneği ile 3 saat)</span>
                      </div>
                    </div>

                    <Button
                      href={`/order/start?product=${product.slug}&tier=${tier.id}`}
                      variant="outline"
                      className="w-full"
                    >
                      Sipariş Ver
                    </Button>
                  </Card>
                )
              })}
            </div>
            )}

            <div className="mt-8 p-6 rounded-xl bg-[var(--card)] border border-[var(--border)]">
              <p className="text-sm text-[var(--fg)]">
                <span className="font-medium">Fiziksel paket</span> — QR kod baskılı
                fotoğrafınız kargoyla gönderilir. Her pakete ekstra olarak
                eklenebilir (+{PHYSICAL_PACKAGE_FEE} ₺). Sipariş oluştururken
                &quot;Fiziksel paket dahil&quot; seçeneğini işaretleyebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
  } catch (err) {
    if (err && typeof err === "object" && (err as { digest?: string }).digest === "NEXT_NOT_FOUND") {
      throw err
    }
    console.error("Product detail page error:", err)
    return (
      <Section>
        <Container>
          <div className="pt-32 pb-16 text-center">
            <h1 className="text-xl font-semibold text-[var(--fg)] mb-2">Sayfa yüklenemedi</h1>
            <p className="text-[var(--muted)] mb-6">Lütfen daha sonra tekrar deneyin veya paketler sayfasına dönün.</p>
            <Button href="/products" variant="primary">Paketlere dön</Button>
          </div>
        </Container>
      </Section>
    )
  }
}
