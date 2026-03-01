import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOrderCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `FL-${timestamp}-${random}`
}

export function generateQrSlug(): string {
  return Math.random().toString(36).substring(2, 10)
}

/** Fiziksel paket (QR kod baskılı fotoğraf kargo) ek ücreti (₺) */
export const PHYSICAL_PACKAGE_FEE = 499

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace("TRY", "₺")
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export function formatOrderStatus(status: string): string {
  const statusMap: Record<string, string> = {
    RECEIVED: "Sipariş Alındı",
    IN_PRODUCTION: "Üretimde",
    PREVIEW_READY: "Önizleme Hazır",
    REVISION: "Revizyon",
    FINALIZING: "Sonlandırılıyor",
    DELIVERED: "Teslim Edildi",
    CANCELLED: "İptal Edildi",
  }
  return statusMap[status] || status
}

export function formatPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "Beklemede",
    PAID: "Ödendi",
    FAILED: "Başarısız",
    REFUNDED: "İade Edildi",
  }
  return statusMap[status] || status
}

export function getWeekLabel(date: Date): string {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayOfWeek = startOfToday.getDay() === 0 ? 6 : startOfToday.getDay() - 1
  const startOfThisWeek = new Date(startOfToday)
  startOfThisWeek.setDate(startOfToday.getDate() - dayOfWeek)

  const d = new Date(date)
  const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())

  const diffMs = startOfThisWeek.getTime() - dStart.getTime()
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000))

  if (diffWeeks < 0 || dStart >= startOfThisWeek) return "Bu hafta"
  if (diffWeeks === 0) return "Bu hafta"
  if (diffWeeks === 1) return "Geçen hafta"
  return `${diffWeeks} hafta önce`
}

export function getWeekKey(date: Date): number {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const dayOfWeek = startOfToday.getDay() === 0 ? 6 : startOfToday.getDay() - 1
  const startOfThisWeek = new Date(startOfToday)
  startOfThisWeek.setDate(startOfToday.getDate() - dayOfWeek)

  const d = new Date(date)
  const dStart = new Date(d.getFullYear(), d.getMonth(), d.getDate())

  const diffMs = startOfThisWeek.getTime() - dStart.getTime()
  return Math.max(0, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)))
}

export const ACTIVE_STATUSES = ["RECEIVED", "IN_PRODUCTION", "PREVIEW_READY", "REVISION", "FINALIZING"] as const
export const COMPLETED_STATUSES = ["DELIVERED", "CANCELLED"] as const
