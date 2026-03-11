const WHATSAPP_NUMBER = '+90 543 157 13 79'

export function buildWhatsAppLink(): string {
  const cleanNumber = WHATSAPP_NUMBER.replace(/\s/g, '')
  return `https://wa.me/${cleanNumber}`
}


