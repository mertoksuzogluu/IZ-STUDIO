declare module "iyzipay" {
  interface IyzipayConfig {
    apiKey: string
    secretKey: string
    uri: string
  }

  interface CheckoutFormInitializeResult {
    status: string
    locale: string
    systemTime: number
    conversationId: string
    token: string
    checkoutFormContent: string
    tokenExpireTime: number
    paymentPageUrl: string
    errorCode?: string
    errorMessage?: string
    errorGroup?: string
  }

  interface CheckoutFormRetrieveResult {
    status: string
    locale: string
    systemTime: number
    conversationId: string
    token: string
    paymentId: string
    paymentStatus: string
    price: number
    paidPrice: number
    currency: string
    installment: number
    basketId: string
    errorCode?: string
    errorMessage?: string
  }

  class Iyzipay {
    constructor(config: IyzipayConfig)
    checkoutFormInitialize: {
      create(request: any, callback: (err: any, result: CheckoutFormInitializeResult) => void): void
    }
    checkoutForm: {
      retrieve(request: any, callback: (err: any, result: CheckoutFormRetrieveResult) => void): void
    }
    payment: {
      create(request: any, callback: (err: any, result: any) => void): void
    }
    static LOCALE: { TR: string; EN: string }
    static CURRENCY: { TRY: string; USD: string; EUR: string; GBP: string }
    static PAYMENT_GROUP: { PRODUCT: string; LISTING: string; SUBSCRIPTION: string }
    static BASKET_ITEM_TYPE: { PHYSICAL: string; VIRTUAL: string }
  }

  export = Iyzipay
}
