import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import SectionHeader from "@/components/design-system/SectionHeader"
import AdminDiscountForm from "../AdminDiscountForm"

export default async function AdminEditDiscountPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  const [discount, products] = await Promise.all([
    prisma.discount.findUnique({
      where: { id: params.id },
      include: { product: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.product.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
  ])

  if (!discount) notFound()

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          <SectionHeader
            title={`İndirim: ${discount.code}`}
            description="İndirim bilgilerini güncelleyin."
          />
          <AdminDiscountForm
            discountId={discount.id}
            products={products}
            initial={{
              code: discount.code,
              type: discount.type,
              value: discount.value,
              productId: discount.productId,
              minOrderAmountTRY: discount.minOrderAmountTRY,
              validFrom: discount.validFrom,
              validUntil: discount.validUntil,
              maxUses: discount.maxUses,
              active: discount.active,
            }}
          />
        </div>
      </Container>
    </Section>
  )
}
