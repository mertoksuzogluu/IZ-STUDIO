import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import Card from "@/components/design-system/Card"
import Button from "@/components/design-system/Button"
import OrderDetailClient from "./OrderDetailClient"
import { formatPrice, formatDate } from "@/lib/utils"
import { buildWhatsAppLink } from "@/lib/whatsapp"

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: { orderCode: string }
  searchParams: { payment?: string }
}) {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/signin")
  }

  const order = await prisma.order.findUnique({
    where: { orderCode: params.orderCode },
    include: {
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

  if (!order || order.userId !== session.user.id) {
    notFound()
  }

  const whatsappLink = buildWhatsAppLink()

  const isPaymentSuccess = searchParams.payment === "success"

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-serif text-[var(--fg)] mb-2">
                Sipariş Detayı
              </h1>
              <div className="flex items-center gap-3">
                <p className="font-mono text-sm text-[var(--muted)]">
                  Sipariş Kodu:
                </p>
                <p className="font-mono text-lg font-bold text-[var(--fg)] bg-[var(--card)] px-4 py-2 rounded border border-[var(--border)]">
                  {order.orderCode}
                </p>
              </div>
            </div>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">💬 WhatsApp Destek</Button>
            </a>
          </div>

          {isPaymentSuccess && (
            <Card className="p-6 mb-6 bg-green-50 border-green-200">
              <div className="flex items-start gap-4">
                <div className="text-3xl">✅</div>
                <div className="flex-1">
                  <h2 className="text-xl font-serif text-green-900 mb-2">
                    Ödeme Başarılı!
                  </h2>
                  <p className="text-green-800 mb-3">
                    Siparişiniz başarıyla alındı ve sıraya eklendi.
                  </p>
                  <div className="bg-white p-4 rounded border border-green-200 mb-3">
                    <p className="text-sm text-green-700 mb-1">
                      <strong>Sipariş Kodunuz:</strong>
                    </p>
                    <p className="font-mono text-lg font-bold text-green-900">
                      {order.orderCode}
                    </p>
                  </div>
                  <p className="text-sm text-green-700">
                    Siparişinize detay eklemek veya sorularınız için WhatsApp üzerinden ekibimizle iletişime geçebilirsiniz. Sipariş kodunuzu mesajınızda belirtmeyi unutmayın.
                  </p>
                </div>
              </div>
            </Card>
          )}

          <OrderDetailClient order={order} showPaymentSuccess={isPaymentSuccess} />
        </div>
      </Container>
    </Section>
  )
}

