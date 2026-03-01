export type ThemeKey = 'default' | 'ask' | 'hatira' | 'cocuk' | 'anneler_gunu' | 'babalar_gunu' | 'sevgililer_gunu'

export type SpecialThemeKey = 'anneler_gunu' | 'babalar_gunu' | 'sevgililer_gunu'

/** URL slug -> theme key (özel gün sayfası için) */
export const SPECIAL_DAY_SLUGS: Record<SpecialThemeKey, string> = {
  anneler_gunu: 'anneler-gunu',
  babalar_gunu: 'babalar-gunu',
  sevgililer_gunu: 'sevgililer-gunu',
}

export const SLUG_TO_SPECIAL_THEME: Record<string, SpecialThemeKey> = {
  'anneler-gunu': 'anneler_gunu',
  'babalar-gunu': 'babalar_gunu',
  'sevgililer-gunu': 'sevgililer_gunu',
}

/** Özel gün temalarında sitede gösterilecek duygusal metinler */
export const SPECIAL_DAY_COPY: Record<
  SpecialThemeKey,
  { title: string; message: string; cta?: string }
> = {
  anneler_gunu: {
    title: 'Anneler Günü',
    message:
      'Hayatımızın her anında yanımızda olan, bizi biz yapan değerli annelerimizin Anneler Günü kutlu olsun. Onların hikâyesini sinematik bir filmle ölümsüzleştirin.',
    cta: 'Anneye özel film siparişi ver',
  },
  babalar_gunu: {
    title: 'Babalar Günü',
    message:
      'Her anımızda yanımızda olan, gücümüz ve güvencemiz babalarımızın Babalar Günü kutlu olsun. Onun hikâyesini duygusal bir kısa filmle taçlandırın.',
    cta: 'Babaya özel film siparişi ver',
  },
  sevgililer_gunu: {
    title: 'Sevgililer Günü',
    message:
      'Birlikte yazdığınız aşk hikâyesi eşsiz. Sevgililer Günü’nde birbirinize en güzel hediyeyi verin: ortak anılarınızdan sinematik bir film.',
    cta: 'Aşk filminizi sipariş edin',
  },
}

/** Özel gün banner süslemeleri (emoji) */
export const SPECIAL_DAY_BANNER: Record<
  SpecialThemeKey,
  { emoji: string[] }
> = {
  anneler_gunu: { emoji: ['🌸', '💐', '🌷', '🌺', '💕'] },
  babalar_gunu: { emoji: ['🎁', '⭐', '👔', '🏆', '💙'] },
  sevgililer_gunu: { emoji: ['🌹', '❤️', '💕', '🌹', '💝'] },
}

/** Özel gün sayfasında gösterilecek ürün slug'ları (sadece bunlar listelenir) */
export const SPECIAL_DAY_PRODUCTS: Record<SpecialThemeKey, string[]> = {
  anneler_gunu: ['ask', 'hatira'],
  babalar_gunu: ['ask', 'hatira'],
  sevgililer_gunu: ['ask'],
}

export interface Theme {
  cssVars: {
    bg: string
    fg: string
    muted: string
    card: string
    border: string
    accent: string
    accent2: string
    heroOverlayFrom: string
    heroOverlayTo: string
  }
  backgroundStyle?: string // Not used in white theme
  grainOpacity?: number // Not used in white theme
  buttonStyle: {
    primary: string
    secondary: string
  }
}

export const THEMES: Record<ThemeKey, Theme> = {
  default: {
    cssVars: {
      bg: '#FFFFFF',
      fg: '#111111',
      muted: '#666666',
      card: '#FFFFFF',
      border: '#EAEAEA',
      accent: '#111111',
      accent2: '#333333',
      heroOverlayFrom: 'transparent',
      heroOverlayTo: 'transparent',
    },
    buttonStyle: {
      primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent2)]',
      secondary: 'border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--card)]',
    },
  },
  ask: {
    cssVars: {
      bg: '#FFFFFF',
      fg: '#111111',
      muted: '#666666',
      card: '#FFFFFF',
      border: '#EAEAEA',
      accent: '#6D1F2A', // Deep wine accent (badges only)
      accent2: '#8A3A4A',
      heroOverlayFrom: 'transparent',
      heroOverlayTo: 'transparent',
    },
    buttonStyle: {
      primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent2)]',
      secondary: 'border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--card)]',
    },
  },
  hatira: {
    cssVars: {
      bg: '#FFFFFF',
      fg: '#111111',
      muted: '#666666',
      card: '#FFFFFF',
      border: '#EAEAEA',
      accent: '#8A6A3A', // Sepia/brown accent (badges only)
      accent2: '#A0825A',
      heroOverlayFrom: 'transparent',
      heroOverlayTo: 'transparent',
    },
    buttonStyle: {
      primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent2)]',
      secondary: 'border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--card)]',
    },
  },
  cocuk: {
    cssVars: {
      bg: '#FFFFFF',
      fg: '#111111',
      muted: '#666666',
      card: '#FFFFFF',
      border: '#EAEAEA',
      accent: '#2D6CDF',
      accent2: '#4A7FE8',
      heroOverlayFrom: 'transparent',
      heroOverlayTo: 'transparent',
    },
    buttonStyle: {
      primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent2)]',
      secondary: 'border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--card)]',
    },
  },
  anneler_gunu: {
    cssVars: {
      bg: '#FFF5F8',
      fg: '#2D1B22',
      muted: '#7A5C66',
      card: '#FFF9FB',
      border: '#F0D8E0',
      accent: '#C41E5A',
      accent2: '#E84D82',
      heroOverlayFrom: 'rgba(196,30,90,0.15)',
      heroOverlayTo: 'transparent',
    },
    buttonStyle: {
      primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent2)]',
      secondary: 'border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--card)]',
    },
  },
  babalar_gunu: {
    cssVars: {
      bg: '#F5F8FC',
      fg: '#1A2332',
      muted: '#5C6B7A',
      card: '#F8FAFD',
      border: '#D8E4F0',
      accent: '#1E5A8A',
      accent2: '#2D7AB8',
      heroOverlayFrom: 'rgba(30,90,138,0.12)',
      heroOverlayTo: 'transparent',
    },
    buttonStyle: {
      primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent2)]',
      secondary: 'border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--card)]',
    },
  },
  sevgililer_gunu: {
    cssVars: {
      bg: '#FFF0F2',
      fg: '#2D1115',
      muted: '#8A4A52',
      card: '#FFF5F6',
      border: '#F5D8DC',
      accent: '#B91C3C',
      accent2: '#DC2626',
      heroOverlayFrom: 'rgba(185,28,60,0.12)',
      heroOverlayTo: 'transparent',
    },
    buttonStyle: {
      primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent2)]',
      secondary: 'border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--card)]',
    },
  },
}
