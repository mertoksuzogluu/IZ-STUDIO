/** Landing’de DB’den tier gelmezse gösterilecek varsayılanlar (3 kart hep görünsün). */
export const STANDARD_TIERS = [
  { durationSec: 30, name: "30 Saniye", priceTRY: 6900 },
  { durationSec: 60, name: "60 Saniye", priceTRY: 9900 },
  { durationSec: 100, name: "100 Saniye", priceTRY: 14900 },
] as const

export const TIER_FEATURES: Record<number, string[]> = {
  30: [
    "Sinematik kısa film",
    "Sadece 9:16 (Story/Reels)",
    "MP4 teslim",
    "24 saat teslim",
    "Acil teslimat seçeneği ile 3 saat (+300 ₺)",
  ],
  60: [
    "Sinematik kısa film",
    "16:9 yatay",
    "MP4 teslim",
    "24 saat teslim",
    "Acil teslimat seçeneği ile 3 saat (+300 ₺)",
  ],
  100: [
    "Sinematik kısa film",
    "16:9 + 9:16 ikisi de",
    "MP4 teslim",
    "24 saat teslim",
    "Acil teslimat seçeneği ile 3 saat (+300 ₺)",
  ],
}
