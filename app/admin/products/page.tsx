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

export default async function AdminProductsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  const products = await prisma.product.findMany({
    include: {
      tiers: { where: { active: true }, orderBy: { priceTRY: "asc" } },
    },
    orderBy: { createdAt: "asc" },
  })

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          <SectionHeader
            title="Paketler / Ürünler"
            description="Ürün ve paketleri yönetin. Değişiklikler sitede anında yansır."
          />

          <div className="mt-8 flex justify-end mb-6">
            <Link href="/admin/products/new">
              <Button variant="primary">+ Yeni Ürün</Button>
            </Link>
          </div>

          <div className="space-y-6">
            {products.map((product) => (
              <Card key={product.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-serif text-[var(--fg)] mb-1">
                      {product.name}
                    </h2>
                    <p className="text-sm text-[var(--muted)]">
                      slug: {product.slug}
                      {product.isPhysical && " • Fiziksel paket var"}
                      {!product.active && " • Pasif"}
                    </p>
                    {product.description && (
                      <p className="text-sm text-[var(--muted)] mt-2 max-w-xl">
                        {product.description}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {product.tiers.map((tier) => (
                        <span
                          key={tier.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--card)] border border-[var(--border)] rounded text-sm"
                        >
                          {tier.name} — {formatPrice(tier.priceTRY)}
                          {tier.durationSec != null && ` (${tier.durationSec} sn)`}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link href={`/admin/products/${product.id}`}>
                    <Button variant="outline">Düzenle</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
