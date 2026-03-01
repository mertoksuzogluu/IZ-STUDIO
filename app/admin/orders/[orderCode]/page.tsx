import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import AdminOrderDetailClient from "./AdminOrderDetailClient"

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { orderCode: string }
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  const order = await prisma.order.findUnique({
    where: { orderCode: params.orderCode },
    include: {
      user: true,
      product: true,
      tier: true,
      brief: true,
      mediaAssets: true,
      deliveryAssets: true,
      revisions: {
        orderBy: { createdAt: "desc" },
      },
      shipments: {
        orderBy: { createdAt: "desc" },
      },
      qrLink: true,
    },
  })

  if (!order) {
    notFound()
  }

  return <AdminOrderDetailClient order={order} />
}

