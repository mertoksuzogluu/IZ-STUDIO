import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import SectionHeader from "@/components/design-system/SectionHeader"
import Card from "@/components/design-system/Card"
import Button from "@/components/design-system/Button"
import { formatPrice } from "@/lib/utils"

export default async function AdminDiscountsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  const discounts = await prisma.discount.findMany({
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          <SectionHeader
            title="İndirim Kodları"
            description="İndirim tanımlayın. Müşteri sipariş oluştururken kodu girebilir; ödeme buna göre alınır."
          />

          <div className="mt-8 flex justify-end mb-6">
            <Link href="/admin/discounts/new">
              <Button variant="primary">+ Yeni İndirim</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {discounts.length === 0 ? (
              <Card className="p-8 text-center text-[var(--muted)]">
                Henüz indirim kodu yok. &quot;Yeni İndirim&quot; ile ekleyin.
              </Card>
            ) : (
              discounts.map((d) => (
                <Card key={d.id} className="p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-mono font-semibold text-[var(--fg)]">
                        {d.code}
                      </p>
                      <p className="text-sm text-[var(--muted)] mt-1">
                        {d.type === "PERCENTAGE"
                          ? `%${d.value} indirim`
                          : `${formatPrice(d.value)} sabit indirim`}
                        {d.product && ` • ${d.product.name}`}
                        {d.minOrderAmountTRY != null &&
                          ` • Min. ${formatPrice(d.minOrderAmountTRY)}`}
                      </p>
                      <p className="text-xs text-[var(--muted)] mt-2">
                        Kullanım: {d.usedCount}
                        {d.maxUses != null ? ` / ${d.maxUses}` : ""}
                        {d.validFrom && ` • Geçerlilik: ${d.validFrom.toLocaleDateString("tr-TR")} - `}
                        {d.validUntil && d.validUntil.toLocaleDateString("tr-TR")}
                        {!d.active && " • Pasif"}
                      </p>
                    </div>
                    <Link href={`/admin/discounts/${d.id}`}>
                      <Button variant="outline">Düzenle</Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}
