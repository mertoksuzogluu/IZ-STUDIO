import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import SectionHeader from "@/components/design-system/SectionHeader"
import Card from "@/components/design-system/Card"
import Link from "next/link"
import { formatPrice, formatDate, formatOrderStatus, formatPaymentStatus } from "@/lib/utils"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/signin")
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      product: true,
      tier: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const stats = {
    total: await prisma.order.count({
      where: { userId: session.user.id },
    }),
    inProduction: await prisma.order.count({
      where: {
        userId: session.user.id,
        status: { in: ["IN_PRODUCTION", "PREVIEW_READY", "REVISION"] },
      },
    }),
    delivered: await prisma.order.count({
      where: {
        userId: session.user.id,
        status: "DELIVERED",
      },
    }),
  }

  const isAdmin = session.user.role === "admin"

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          {isAdmin && (
            <div className="mb-8 p-4 bg-[var(--card)] border border-[var(--border)] rounded-lg flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-[var(--muted)]">
                Admin hesabıyla giriş yaptınız. Site yönetimi (siparişler, paketler, metinler, örnek videolar) için Admin Panel kullanın.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center px-4 py-2 bg-[var(--fg)] text-white rounded-lg hover:opacity-90 text-sm font-medium"
              >
                Admin Panel →
              </Link>
            </div>
          )}
          <SectionHeader
            title={`Hoş geldiniz, ${session.user.name || session.user.email}`}
            description="Siparişlerinizi buradan takip edebilirsiniz."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-12">
            <Card>
              <p className="text-sm text-[var(--muted)] mb-2">Toplam Sipariş</p>
              <p className="text-3xl font-serif text-[var(--fg)]">
                {stats.total}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-[var(--muted)] mb-2">Üretimde</p>
              <p className="text-3xl font-serif text-[var(--fg)]">
                {stats.inProduction}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-[var(--muted)] mb-2">Teslim Edildi</p>
              <p className="text-3xl font-serif text-[var(--fg)]">
                {stats.delivered}
              </p>
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-[var(--fg)]">
                Son Siparişler
              </h2>
              <Link
                href="/dashboard/orders"
                className="text-sm text-[var(--accent)] hover:underline"
              >
                Tümünü Gör
              </Link>
            </div>

            {orders.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-[var(--muted)] mb-4">
                  Henüz siparişiniz bulunmuyor.
                </p>
                <Link href="/products">
                  <button className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent2)]">
                    Paketleri İncele
                  </button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link key={order.id} href={`/dashboard/orders/${order.orderCode}`}>
                    <Card hover className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm text-[var(--muted)]">
                              {order.orderCode}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded ${
                              order.paymentStatus !== "PAID" && order.status === "RECEIVED"
                                ? "bg-amber-50 border border-amber-200 text-amber-700"
                                : "bg-[var(--card)] border border-[var(--border)]"
                            }`}>
                              {formatOrderStatus(order.status, order.paymentStatus)}
                            </span>
                          </div>
                          <p className="font-medium text-[var(--fg)]">
                            {order.product.name} - {order.tier.name}
                          </p>
                          <p className="text-sm text-[var(--muted)]">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-serif text-[var(--fg)]">
                            {formatPrice(order.totalPriceTRY)}
                          </p>
                          <p className="text-xs text-[var(--muted)]">
                            {formatPaymentStatus(order.paymentStatus)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}

