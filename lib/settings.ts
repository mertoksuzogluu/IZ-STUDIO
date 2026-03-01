import { prisma } from "@/lib/prisma"

const ACTIVE_SPECIAL_THEME_KEY = "active_special_theme"

function getSiteSettingDelegate(): { findUnique: any; upsert: any } | null {
  const delegate = (prisma as any).siteSetting
  if (!delegate?.findUnique || !delegate?.upsert) return null
  return delegate
}

export type SpecialThemeValue = "default" | "anneler_gunu" | "babalar_gunu" | "sevgililer_gunu"

const VALID_THEMES: SpecialThemeValue[] = ["default", "anneler_gunu", "babalar_gunu", "sevgililer_gunu"]

export async function getActiveSpecialTheme(): Promise<SpecialThemeValue> {
  try {
    const siteSetting = getSiteSettingDelegate()
    if (!siteSetting) return "default"
    const row = await siteSetting.findUnique({
      where: { key: ACTIVE_SPECIAL_THEME_KEY },
    })
    const v = row?.value as SpecialThemeValue | undefined
    if (v && VALID_THEMES.includes(v)) return v
    return "default"
  } catch {
    return "default"
  }
}

export async function setActiveSpecialTheme(value: SpecialThemeValue): Promise<void> {
  const siteSetting = getSiteSettingDelegate()
  if (!siteSetting) throw new Error("siteSetting modeli yok. npx prisma generate çalıştırın.")
  await siteSetting.upsert({
    where: { key: ACTIVE_SPECIAL_THEME_KEY },
    create: { key: ACTIVE_SPECIAL_THEME_KEY, value },
    update: { value },
  })
}
