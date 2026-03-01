'use client'

import { useEffect, useRef } from 'react'
import { ThemeKey, THEMES } from '@/lib/themes'

interface ThemeShellProps {
  themeKey: ThemeKey
  children: React.ReactNode
}

export default function ThemeShell({ themeKey, children }: ThemeShellProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const theme = THEMES[themeKey]

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    
    // Set CSS variables
    const vars = theme.cssVars
    container.style.setProperty('--bg', vars.bg)
    container.style.setProperty('--fg', vars.fg)
    container.style.setProperty('--muted', vars.muted)
    container.style.setProperty('--card', vars.card)
    container.style.setProperty('--border', vars.border)
    container.style.setProperty('--accent', vars.accent)
    container.style.setProperty('--accent2', vars.accent2)
    container.style.setProperty('--overlayFrom', vars.heroOverlayFrom)
    container.style.setProperty('--overlayTo', vars.heroOverlayTo)
  }, [theme])

  return (
    <div
      ref={containerRef}
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--fg)',
      }}
    >
      {children}
    </div>
  )
}
