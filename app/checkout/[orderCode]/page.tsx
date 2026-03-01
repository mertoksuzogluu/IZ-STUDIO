import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import CheckoutClient from "./CheckoutClient"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"

export default async function CheckoutPage({
  params,
}: {
  params: { orderCode: string }
}) {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/signin")
  }

  const order = await prisma.order.findUnique({
    where: { orderCode: params.orderCode },
    include: {
      product: { select: { name: true } },
      tier: { select: { name: true } },
      user: { select: { email: true, name: true } },
    },
  })

  if (!order || order.userId !== session.user.id) {
    redirect("/dashboard")
  }

  if (order.paymentStatus === "PAID") {
    redirect(`/dashboard/orders/${params.orderCode}`)
  }

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16 max-w-2xl mx-auto">
          <CheckoutClient order={order} />
        </div>
      </Container>
    </Section>
  )
}

