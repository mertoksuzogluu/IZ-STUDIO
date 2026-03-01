import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import AdminOrdersList from "./AdminOrdersList"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { tab?: string; search?: string }
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  const orders = await prisma.order.findMany({
    include: {
      user: { select: { email: true, name: true } },
      product: true,
      tier: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const serialized = orders.map((o) => ({
    id: o.id,
    orderCode: o.orderCode,
    status: o.status,
    paymentStatus: o.paymentStatus,
    totalPriceTRY: o.totalPriceTRY,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    userEmail: o.user?.email || o.guestEmail || "—",
    userName: o.user?.name || "",
    productName: o.product.name,
    tierName: o.tier.name,
  }))

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          <AdminOrdersList
            orders={serialized}
            initialTab={searchParams.tab || "active"}
            initialSearch={searchParams.search || ""}
          />
        </div>
      </Container>
    </Section>
  )
}
