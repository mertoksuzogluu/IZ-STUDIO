import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import OrderStartForm from "./OrderStartForm"

export default async function OrderStartPage({
  searchParams,
}: {
  searchParams: { product?: string; tier?: string; physical?: string }
}) {
  const productSlug = searchParams.product
  const tierId = searchParams.tier
  const physicalPackage = searchParams.physical === "1"

  if (!productSlug || !tierId) {
    redirect("/products")
  }

  const tier = await prisma.packageTier.findUnique({
    where: { id: tierId, active: true },
    include: {
      product: { select: { id: true, name: true, slug: true } },
    },
  })

  if (!tier) {
    redirect("/products")
  }

  return (
    <OrderStartForm
      productId={tier.product.id}
      productSlug={tier.product.slug}
      tierId={tier.id}
      physicalPackage={physicalPackage}
      tier={{
        name: tier.name,
        priceTRY: tier.priceTRY,
        durationSec: tier.durationSec,
        productName: tier.product.name,
      }}
    />
  )
}
