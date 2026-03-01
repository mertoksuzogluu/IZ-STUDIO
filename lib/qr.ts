import QRCode from "qrcode"

export async function generateQRCodeDataURL(text: string): Promise<string> {
  try {
    const qrDataURL = await QRCode.toDataURL(text, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
    return qrDataURL
  } catch (error) {
    console.error("QR code generation error:", error)
    throw error
  }
}

export function getQRCodeUrl(orderCode: string): string {
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://feelcreativestudio.com"
  return `${baseUrl}/v/${orderCode}`
}

export function getQRCodeText(slug: string): string {
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://feelcreativestudio.com"
  return `${baseUrl}/v/${slug}`
}

