import { prisma } from "@/lib/prisma"

export type DiscountApplyResult =
  | { valid: true; discountId: string; code: string; amountTRY: number }
  | { valid: false; error: string }

/**
 * İndirim kodunu doğrular ve uygulanacak tutarı hesaplar.
 * productId ve minOrderAmount kontrolü yapılır.
 */
export async function validateAndApplyDiscount(
  code: string,
  subtotalTRY: number,
  productId: string | null
): Promise<DiscountApplyResult> {
  if (!code?.trim()) {
    return { valid: false, error: "Kod girilmedi" }
  }

  const discount = await prisma.discount.findUnique({
    where: { code: code.trim().toUpperCase(), active: true },
    include: { product: true },
  })

  if (!discount) {
    return { valid: false, error: "Geçersiz veya pasif indirim kodu" }
  }

  const now = new Date()
  if (discount.validFrom && now < discount.validFrom) {
    return { valid: false, error: "İndirim kodu henüz geçerli değil" }
  }
  if (discount.validUntil && now > discount.validUntil) {
    return { valid: false, error: "İndirim kodu süresi dolmuş" }
  }

  if (discount.maxUses != null && discount.usedCount >= discount.maxUses) {
    return { valid: false, error: "İndirim kodu kullanım limiti doldu" }
  }

  if (discount.productId != null && discount.productId !== productId) {
    return { valid: false, error: "Bu indirim bu ürün için geçerli değil" }
  }

  if (
    discount.minOrderAmountTRY != null &&
    subtotalTRY < discount.minOrderAmountTRY
  ) {
    return {
      valid: false,
      error: `Minimum sipariş tutarı ${discount.minOrderAmountTRY} ₺`,
    }
  }

  let amountTRY: number
  if (discount.type === "PERCENTAGE") {
    amountTRY = Math.round((subtotalTRY * discount.value) / 100)
  } else {
    amountTRY = Math.min(discount.value, subtotalTRY)
  }

  if (amountTRY <= 0) {
    return { valid: false, error: "İndirim tutarı hesaplanamadı" }
  }

  return {
    valid: true,
    discountId: discount.id,
    code: discount.code,
    amountTRY,
  }
}
