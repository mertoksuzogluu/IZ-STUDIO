import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import AdminProductForm from "./AdminProductForm"

export default async function AdminProductEditPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { tiers: { orderBy: { priceTRY: "asc" } } },
  })

  if (!product) notFound()

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          <div className="mb-6">
            <Link
              href="/admin/products"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              ← Paketlere dön
            </Link>
          </div>
          <AdminProductForm product={product} />
        </div>
      </Container>
    </Section>
  )
}
