"use client"

import { useEffect, useRef } from "react"
import { THEMES } from "@/lib/themes"
import type { ThemeKey } from "@/lib/themes"

const SPECIAL_THEMES: ThemeKey[] = ["anneler_gunu", "babalar_gunu", "sevgililer_gunu"]

interface GlobalThemeWrapperProps {
  themeKey: string
  children: React.ReactNode
}

export default function GlobalThemeWrapper({ themeKey, children }: GlobalThemeWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)

  const key = SPECIAL_THEMES.includes(themeKey as ThemeKey) ? (themeKey as ThemeKey) : null
  const theme = key ? THEMES[key] : null

  useEffect(() => {
    if (!ref.current || !theme) return
    const vars = theme.cssVars
    const el = ref.current
    el.style.setProperty("--bg", vars.bg)
    el.style.setProperty("--fg", vars.fg)
    el.style.setProperty("--muted", vars.muted)
    el.style.setProperty("--card", vars.card)
    el.style.setProperty("--border", vars.border)
    el.style.setProperty("--accent", vars.accent)
    el.style.setProperty("--accent2", vars.accent2)
    el.style.setProperty("--overlayFrom", vars.heroOverlayFrom)
    el.style.setProperty("--overlayTo", vars.heroOverlayTo)
  }, [theme])

  if (!key) {
    return <>{children}</>
  }

  return (
    <div
      ref={ref}
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
    >
      {children}
    </div>
  )
}
