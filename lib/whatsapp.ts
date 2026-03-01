// WhatsApp helper function
// Replace +90 5XX XXX XX XX with your actual WhatsApp number

const WHATSAPP_NUMBER = '+90 5XX XXX XX XX'

export interface WhatsAppLinkParams {
  product?: 'ask' | 'hatira' | 'cocuk' | 'genel'
  name?: string
  occasion?: string
  notes?: string
  orderCode?: string
}

export function buildWhatsAppLink(params: WhatsAppLinkParams = {}): string {
  const { orderCode } = params

  let message = 'Merhaba İz Studio destek,'

  if (orderCode) {
    message += ` sipariş kodum: ${orderCode}.`
  } else {
    message += ' destek almak istiyorum.'
  }

  const encodedMessage = encodeURIComponent(message)
  const cleanNumber = WHATSAPP_NUMBER.replace(/\s/g, '')
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`
}


