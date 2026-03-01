import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import SectionHeader from "@/components/design-system/SectionHeader"
import AdminDiscountForm from "../AdminDiscountForm"

export default async function AdminNewDiscountPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  })

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          <SectionHeader
            title="Yeni İndirim"
            description="İndirim kodu ve kurallarını girin."
          />
          <AdminDiscountForm products={products} />
        </div>
      </Container>
    </Section>
  )
}
