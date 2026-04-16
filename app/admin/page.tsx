import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import Card from "@/components/design-system/Card"
import Link from "next/link"
import { formatPrice, formatDate, formatOrderStatus } from "@/lib/utils"

export const dynamic = "force-dynamic"

async function getDashboardData() {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayOfWeek = startOfToday.getDay() === 0 ? 6 : startOfToday.getDay() - 1
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfToday.getDate() - dayOfWeek)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    todayOrders,
    todayRevenue,
    weekRevenue,
    monthRevenue,
    totalRevenue,
    activeCount,
    pendingPayment,
    totalOrders,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count({
      where: { createdAt: { gte: startOfToday }, paymentStatus: "PAID" },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfToday }, paymentStatus: "PAID" },
      _sum: { totalPriceTRY: true },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfWeek }, paymentStatus: "PAID" },
      _sum: { totalPriceTRY: true },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: startOfMonth }, paymentStatus: "PAID" },
      _sum: { totalPriceTRY: true },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalPriceTRY: true },
    }),
    prisma.order.count({
      where: { status: { in: ["RECEIVED", "IN_PRODUCTION", "PREVIEW_READY", "REVISION", "FINALIZING"] } },
    }),
    prisma.order.count({
      where: { paymentStatus: "PENDING" },
    }),
    prisma.order.count(),
    prisma.order.findMany({
      include: {
        user: { select: { email: true, name: true } },
        product: { select: { name: true } },
        tier: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  // Son 7 gün günlük kazanç
  const dailyData: { label: string; amount: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(startOfToday)
    dayStart.setDate(dayStart.getDate() - i)
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)

    const result = await prisma.order.aggregate({
      where: {
        createdAt: { gte: dayStart, lt: dayEnd },
        paymentStatus: "PAID",
      },
      _sum: { totalPriceTRY: true },
    })

    const dayLabel = new Intl.DateTimeFormat("tr-TR", { weekday: "short" }).format(dayStart)
    dailyData.push({
      label: dayLabel,
      amount: result._sum.totalPriceTRY || 0,
    })
  }

  return {
    todayOrders,
    todayRevenue: todayRevenue._sum.totalPriceTRY || 0,
    weekRevenue: weekRevenue._sum.totalPriceTRY || 0,
    monthRevenue: monthRevenue._sum.totalPriceTRY || 0,
    totalRevenue: totalRevenue._sum.totalPriceTRY || 0,
    activeCount,
    pendingPayment,
    totalOrders,
    recentOrders,
    dailyData,
  }
}

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  const data = await getDashboardData()
  const maxDaily = Math.max(...data.dailyData.map((d) => d.amount), 1)

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif text-[var(--fg)] mb-2">Dashboard</h1>
            <p className="text-[var(--muted)]">Genel bakış ve gelir istatistikleri</p>
          </div>

          {/* Gelir kartları */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-5">
              <p className="text-xs text-[var(--muted)] mb-1 uppercase tracking-wide">Bugün</p>
              <p className="text-2xl md:text-3xl font-serif text-[var(--fg)]">{formatPrice(data.todayRevenue)}</p>
              <p className="text-xs text-[var(--muted)] mt-1">{data.todayOrders} sipariş</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-[var(--muted)] mb-1 uppercase tracking-wide">Bu Hafta</p>
              <p className="text-2xl md:text-3xl font-serif text-[var(--fg)]">{formatPrice(data.weekRevenue)}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-[var(--muted)] mb-1 uppercase tracking-wide">Bu Ay</p>
              <p className="text-2xl md:text-3xl font-serif text-[var(--fg)]">{formatPrice(data.monthRevenue)}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-[var(--muted)] mb-1 uppercase tracking-wide">Toplam</p>
              <p className="text-2xl md:text-3xl font-serif text-[var(--fg)]">{formatPrice(data.totalRevenue)}</p>
              <p className="text-xs text-[var(--muted)] mt-1">{data.totalOrders} sipariş</p>
            </Card>
          </div>

          {/* Durum kartları + Günlük grafik */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-5">
              <p className="text-xs text-[var(--muted)] mb-1 uppercase tracking-wide">Aktif Sipariş</p>
              <p className="text-4xl font-serif text-[var(--fg)]">{data.activeCount}</p>
              <p className="text-xs text-[var(--muted)] mt-1">Üretimde + bekleyen</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-[var(--muted)] mb-1 uppercase tracking-wide">Ödeme Bekliyor</p>
              <p className="text-4xl font-serif text-[var(--fg)]">{data.pendingPayment}</p>
            </Card>
            <Card className="p-5">
              <p className="text-xs text-[var(--muted)] mb-3 uppercase tracking-wide">Son 7 Gün</p>
              <div className="flex items-end gap-1 h-16">
                {data.dailyData.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-[var(--fg)] rounded-sm min-h-[2px]"
                      style={{ height: `${Math.max(4, (day.amount / maxDaily) * 100)}%` }}
                    />
                    <span className="text-[9px] text-[var(--muted)]">{day.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Son siparişler */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-serif text-[var(--fg)]">Son Siparişler</h2>
              <Link href="/admin/orders" className="text-sm text-[var(--accent)] hover:underline">
                Tümünü gör
              </Link>
            </div>
            <div className="space-y-2">
              {data.recentOrders.map((order) => (
                <Link key={order.id} href={`/admin/orders/${order.orderCode}`}>
                  <Card hover className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[var(--muted)]">{order.orderCode}</span>
                        <span className={`px-2 py-0.5 text-xs rounded border ${
                          order.paymentStatus !== "PAID" && order.status === "RECEIVED"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-[var(--card)] border-[var(--border)]"
                        }`}>
                          {formatOrderStatus(order.status, order.paymentStatus)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-serif text-[var(--fg)]">{formatPrice(order.totalPriceTRY)}</span>
                        <span className="text-xs text-[var(--muted)] ml-2">{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
              {data.recentOrders.length === 0 && (
                <Card className="p-6 text-center">
                  <p className="text-[var(--muted)]">Henüz sipariş yok.</p>
                </Card>
              )}
            </div>
          </div>

          {/* Yönetim linkleri */}
          <h2 className="text-xl font-serif text-[var(--fg)] mb-4">Yönetim</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/orders">
              <Card hover className="p-5 h-full">
                <h3 className="text-lg font-serif text-[var(--fg)] mb-1">Siparişler</h3>
                <p className="text-sm text-[var(--muted)]">Sipariş listesi, durum güncelleme, haftalık görünüm.</p>
              </Card>
            </Link>
            <Link href="/admin/products">
              <Card hover className="p-5 h-full">
                <h3 className="text-lg font-serif text-[var(--fg)] mb-1">Paketler / Ürünler</h3>
                <p className="text-sm text-[var(--muted)]">Fiyat ve detay güncelleme.</p>
              </Card>
            </Link>
            <Link href="/admin/settings">
              <Card hover className="p-5 h-full">
                <h3 className="text-lg font-serif text-[var(--fg)] mb-1">Site Teması</h3>
                <p className="text-sm text-[var(--muted)]">Özel gün teması.</p>
              </Card>
            </Link>
            <Link href="/admin/discounts">
              <Card hover className="p-5 h-full">
                <h3 className="text-lg font-serif text-[var(--fg)] mb-1">İndirim Kodları</h3>
                <p className="text-sm text-[var(--muted)]">İndirim tanımlama.</p>
              </Card>
            </Link>
            <Link href="/admin/site-copy">
              <Card hover className="p-5 h-full">
                <h3 className="text-lg font-serif text-[var(--fg)] mb-1">Site Metinleri</h3>
                <p className="text-sm text-[var(--muted)]">Başlık ve açıklamaları düzenleyin.</p>
              </Card>
            </Link>
            <Link href="/admin/page-images">
              <Card hover className="p-5 h-full">
                <h3 className="text-lg font-serif text-[var(--fg)] mb-1">Sayfa Görselleri</h3>
                <p className="text-sm text-[var(--muted)]">Hero görsel / video yükleyin.</p>
              </Card>
            </Link>
            <Link href="/admin/faq">
              <Card hover className="p-5 h-full">
                <h3 className="text-lg font-serif text-[var(--fg)] mb-1">SSS Yönetimi</h3>
                <p className="text-sm text-[var(--muted)]">Her sayfanın sıkça sorulan sorularını düzenleyin.</p>
              </Card>
            </Link>
            <Link href="/admin/legal-pages">
              <Card hover className="p-5 h-full">
                <h3 className="text-lg font-serif text-[var(--fg)] mb-1">Bağlantılar Sayfaları</h3>
                <p className="text-sm text-[var(--muted)]">Hakkımızda, Teslimat/İade, Mesafeli Satış, Gizlilik.</p>
              </Card>
            </Link>
            <Link href="/admin/example-videos">
              <Card hover className="p-5 h-full">
                <h3 className="text-lg font-serif text-[var(--fg)] mb-1">Örnek Videolar</h3>
                <p className="text-sm text-[var(--muted)]">Galeri videoları yönetin.</p>
              </Card>
            </Link>
            <Link href="/admin/payment-status">
              <Card hover className="p-5 h-full">
                <h3 className="text-lg font-serif text-[var(--fg)] mb-1">Ödeme Durumu</h3>
                <p className="text-sm text-[var(--muted)]">iyzico canlı mı / mock mu — nedenini görün.</p>
              </Card>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  )
}
