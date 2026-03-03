/**
 * iyzico ödeme entegrasyonu.
 * Resmi client: https://github.com/iyzico/iyzipay-node
 * Env: IYZIPAY_API_KEY, IYZIPAY_SECRET_KEY, IYZIPAY_URI (veya IYZICO_* / IYZICO_SANDBOX)
 */
import Iyzipay from "iyzipay"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://feelcreativestudio.com"

/** Resmi kütüphane hem IYZIPAY_* hem kendi env isimlerimizi desteklesin diye birleştiriyoruz */
function getIyzicoConfig() {
  const apiKey = (process.env.IYZIPAY_API_KEY ?? process.env.IYZICO_API_KEY ?? "").trim()
  const secretKey = (process.env.IYZIPAY_SECRET_KEY ?? process.env.IYZICO_SECRET_KEY ?? "").trim()
  const uriFromEnv = (process.env.IYZIPAY_URI ?? "").trim()
  const sandboxEnv = (process.env.IYZICO_SANDBOX ?? "").trim().toLowerCase() === "true"
  const uri =
    uriFromEnv ||
    (sandboxEnv ? "https://sandbox-api.iyzipay.com" : "https://api.iyzipay.com")
  return { apiKey, secretKey, uri, isSandbox: sandboxEnv }
}

export interface PaymentProvider {
  initiatePayment(params: {
    orderCode: string
    amount: number
    currency: string
    customerEmail: string
    customerName?: string
    customerPhone?: string
    customerIp?: string
    returnUrl: string
    basketItems?: { id: string; name: string; category: string; price: number; type: "VIRTUAL" | "PHYSICAL" }[]
  }): Promise<{ paymentUrl: string; paymentId: string; token?: string }>

  verifyPayment(token: string): Promise<{
    success: boolean
    status: "PAID" | "PENDING" | "FAILED"
    paymentId?: string
  }>
}

// ─── Mock Payment Provider (geliştirme) ───
export class MockPaymentProvider implements PaymentProvider {
  async initiatePayment(params: {
    orderCode: string
    amount: number
    returnUrl: string
  }): Promise<{ paymentUrl: string; paymentId: string }> {
    const paymentId = `mock_${Date.now()}`
    const paymentUrl = `/api/payment/mock?paymentId=${paymentId}&orderCode=${params.orderCode}&returnUrl=${encodeURIComponent(params.returnUrl)}`
    return { paymentUrl, paymentId }
  }

  async verifyPayment(): Promise<{ success: boolean; status: "PAID" | "PENDING" | "FAILED" }> {
    return { success: true, status: "PAID" }
  }
}

// ─── iyzico Payment Provider (iyzipay-node ile) ───
export class IyzicoPaymentProvider implements PaymentProvider {
  private iyzipay: InstanceType<typeof Iyzipay>

  constructor() {
    const { apiKey, secretKey, uri } = getIyzicoConfig()
    if (!apiKey || !secretKey) {
      throw new Error(
        "IYZIPAY_API_KEY / IYZIPAY_SECRET_KEY veya IYZICO_API_KEY / IYZICO_SECRET_KEY env değişkenleri gerekli"
      )
    }
    // Resmi init: https://github.com/iyzico/iyzipay-node#initialization
    this.iyzipay = new Iyzipay({
      apiKey,
      secretKey,
      uri,
    })
  }

  async initiatePayment(params: {
    orderCode: string
    amount: number
    currency: string
    customerEmail: string
    customerName?: string
    customerPhone?: string
    customerIp?: string
    returnUrl: string
    basketItems?: { id: string; name: string; category: string; price: number; type: "VIRTUAL" | "PHYSICAL" }[]
  }): Promise<{ paymentUrl: string; paymentId: string; token?: string }> {
    const [firstName, ...lastParts] = (params.customerName || "Müşteri").split(" ")
    const lastName = lastParts.join(" ") || firstName

    const basketItems = params.basketItems?.length
      ? params.basketItems.map((item) => ({
          id: item.id,
          name: item.name,
          category1: item.category,
          itemType: Iyzipay.BASKET_ITEM_TYPE[item.type] || Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: item.price.toFixed(2),
        }))
      : [
          {
            id: params.orderCode,
            name: "Feel Studio Sipariş",
            category1: "Video Prodüksiyon",
            itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
            price: params.amount.toFixed(2),
          },
        ]

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: params.orderCode,
      price: params.amount.toFixed(2),
      paidPrice: params.amount.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      basketId: params.orderCode,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: params.returnUrl,
      enabledInstallments: [1, 2, 3, 6],
      buyer: {
        id: params.customerEmail.replace(/[^a-zA-Z0-9]/g, "").substring(0, 20) || "guest",
        name: firstName,
        surname: lastName,
        gsmNumber: params.customerPhone || "+905000000000",
        email: params.customerEmail,
        identityNumber: "11111111111",
        registrationAddress: "Türkiye",
        ip: params.customerIp || "127.0.0.1",
        city: "Istanbul",
        country: "Turkey",
      },
      billingAddress: {
        contactName: `${firstName} ${lastName}`,
        city: "Istanbul",
        country: "Turkey",
        address: "Türkiye",
      },
      shippingAddress: {
        contactName: `${firstName} ${lastName}`,
        city: "Istanbul",
        country: "Turkey",
        address: "Türkiye",
      },
      basketItems,
    }

    return new Promise((resolve, reject) => {
      this.iyzipay.checkoutFormInitialize.create(request, (err: any, result: any) => {
        if (err) {
          console.error("[iyzico] Initialize error:", err)
          return reject(new Error(err.errorMessage || "iyzico başlatma hatası"))
        }

        if (result.status !== "success") {
          console.error("[iyzico] Initialize failed:", result.errorMessage, result.errorCode)
          return reject(new Error(result.errorMessage || "iyzico ödeme başlatılamadı"))
        }

        console.log("[iyzico] Checkout form initialized, token:", result.token)
        resolve({
          paymentUrl: result.paymentPageUrl,
          paymentId: result.token,
          token: result.token,
        })
      })
    })
  }

  async verifyPayment(token: string): Promise<{
    success: boolean
    status: "PAID" | "PENDING" | "FAILED"
    paymentId?: string
  }> {
    return new Promise((resolve, reject) => {
      this.iyzipay.checkoutForm.retrieve(
        { locale: Iyzipay.LOCALE.TR, token },
        (err: any, result: any) => {
          if (err) {
            console.error("[iyzico] Retrieve error:", err)
            return resolve({ success: false, status: "FAILED" })
          }

          console.log("[iyzico] Payment result:", result.paymentStatus, result.status)

          if (result.status === "success" && result.paymentStatus === "SUCCESS") {
            return resolve({
              success: true,
              status: "PAID",
              paymentId: result.paymentId,
            })
          }

          return resolve({
            success: false,
            status: result.paymentStatus === "INIT_BANK_TRANSFER" ? "PENDING" : "FAILED",
            paymentId: result.paymentId,
          })
        }
      )
    })
  }
}

// ─── Provider seçimi ───
function createPaymentProvider(): PaymentProvider {
  const provider = (process.env.PAYMENT_PROVIDER || "").trim().toLowerCase()
  if (provider === "iyzico") {
    try {
      const { apiKey, secretKey, uri } = getIyzicoConfig()
      if (!apiKey || !secretKey) {
        console.warn(
          "[Payment] PAYMENT_PROVIDER=iyzico ama API key/secret bos (IYZIPAY_* veya IYZICO_*). Mock kullaniliyor."
        )
        return new MockPaymentProvider()
      }
      return new IyzicoPaymentProvider()
    } catch (e: any) {
      console.error("[Payment] iyzico provider olusturulamadi:", e.message)
      console.warn("[Payment] Mock provider kullaniliyor.")
      return new MockPaymentProvider()
    }
  }
  if (provider !== "mock") {
    console.warn(
      "[Payment] PAYMENT_PROVIDER ne 'iyzico' ne 'mock' (mevcut: '" +
        (process.env.PAYMENT_PROVIDER || "(bos)") +
        "'). Mock kullaniliyor."
    )
  }
  return new MockPaymentProvider()
}

export const paymentProvider: PaymentProvider = createPaymentProvider()
