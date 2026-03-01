import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import SectionHeader from "@/components/design-system/SectionHeader"
import Card from "@/components/design-system/Card"
import Link from "next/link"
import { formatPrice, formatDate, formatOrderStatus, formatPaymentStatus, ACTIVE_STATUSES, COMPLETED_STATUSES } from "@/lib/utils"

export const dynamic = "force-dynamic"

const AUTO_DELETE_DAYS = 14

function daysUntilDeletion(updatedAt: Date): number {
  const now = new Date()
  const diffMs = now.getTime() - new Date(updatedAt).getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(0, AUTO_DELETE_DAYS - diffDays)
}

export default async function OrdersPage() {
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
  })

  const activeOrders = orders.filter((o) => (ACTIVE_STATUSES as readonly string[]).includes(o.status))
  const completedOrders = orders.filter((o) => (COMPLETED_STATUSES as readonly string[]).includes(o.status))

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          <SectionHeader
            title="Siparişlerim"
            description="Tüm siparişlerinizi buradan görüntüleyebilirsiniz."
          />

          {orders.length === 0 ? (
            <Card className="p-12 text-center mt-8">
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
            <>
              {/* Aktif siparişler */}
              {activeOrders.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-serif text-[var(--fg)] mb-4">Aktif Siparişler</h2>
                  <div className="space-y-3">
                    {activeOrders.map((order) => (
                      <Link key={order.id} href={`/dashboard/orders/${order.orderCode}`}>
                        <Card hover className="p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-mono text-xs text-[var(--muted)]">{order.orderCode}</span>
                                <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded">
                                  {formatOrderStatus(order.status)}
                                </span>
                                <span className="px-2 py-0.5 text-xs bg-[var(--card)] border border-[var(--border)] rounded">
                                  {formatPaymentStatus(order.paymentStatus)}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-[var(--fg)]">
                                {order.product.name} — {order.tier.name}
                              </p>
                              <p className="text-xs text-[var(--muted)]">{formatDate(order.createdAt)}</p>
                            </div>
                            <p className="text-lg font-serif text-[var(--fg)] shrink-0 ml-4">
                              {formatPrice(order.totalPriceTRY)}
                            </p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tamamlanan siparişler */}
              {completedOrders.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-serif text-[var(--fg)] mb-4">Tamamlanan Siparişler</h2>
                  <div className="space-y-3">
                    {completedOrders.map((order) => {
                      const remaining = daysUntilDeletion(order.updatedAt)
                      return (
                        <Link key={order.id} href={`/dashboard/orders/${order.orderCode}`}>
                          <Card hover className="p-5">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="font-mono text-xs text-[var(--muted)]">{order.orderCode}</span>
                                  <span className={`px-2 py-0.5 text-xs rounded border ${
                                    order.status === "DELIVERED"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-red-50 text-red-700 border-red-200"
                                  }`}>
                                    {formatOrderStatus(order.status)}
                                  </span>
                                </div>
                                <p className="text-sm font-medium text-[var(--fg)]">
                                  {order.product.name} — {order.tier.name}
                                </p>
                                <p className="text-xs text-[var(--muted)]">{formatDate(order.createdAt)}</p>
                                {remaining <= 7 && (
                                  <p className="text-xs text-amber-600 mt-1">
                                    {remaining === 0
                                      ? "Bu sipariş bugün otomatik silinecek"
                                      : `Bu sipariş ${remaining} gün içinde otomatik silinecek`}
                                  </p>
                                )}
                              </div>
                              <p className="text-lg font-serif text-[var(--fg)] shrink-0 ml-4">
                                {formatPrice(order.totalPriceTRY)}
                              </p>
                            </div>
                          </Card>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </Section>
  )
}
