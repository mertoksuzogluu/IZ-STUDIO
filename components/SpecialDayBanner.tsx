import Link from "next/link"
import Container from "@/components/design-system/Container"
import {
  SPECIAL_DAY_COPY,
  SPECIAL_DAY_BANNER,
  SPECIAL_DAY_SLUGS,
  type SpecialThemeKey,
} from "@/lib/themes"

interface SpecialDayBannerProps {
  themeKey: SpecialThemeKey
}

export default function SpecialDayBanner({ themeKey }: SpecialDayBannerProps) {
  const copy = SPECIAL_DAY_COPY[themeKey]
  const decor = SPECIAL_DAY_BANNER[themeKey]
  const slug = SPECIAL_DAY_SLUGS[themeKey]

  return (
    <section
      className="relative border-b border-[var(--border)] bg-[var(--card)]/95 overflow-hidden"
      aria-label={copy.title}
    >
      {/* Dekoratif arka plan: hafif gradient + emoji desen */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, var(--accent) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, var(--accent) 0%, transparent 50%)`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center gap-4 md:gap-8 text-4xl md:text-5xl opacity-[0.12] pointer-events-none select-none">
        {decor.emoji.map((e, i) => (
          <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}>
            {e}
          </span>
        ))}
      </div>

      <Container className="relative">
        <div className="py-8 md:py-12 text-center">
          {/* Üst süs: emoji çizgisi */}
          <div className="flex justify-center gap-3 md:gap-5 mb-5 text-2xl md:text-3xl">
            {decor.emoji.map((emoji, i) => (
              <span key={i} className="drop-shadow-sm">
                {emoji}
              </span>
            ))}
          </div>

          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-[var(--accent)] font-sans mb-3">
            {copy.title}
          </p>
          <h2 className="text-xl md:text-2xl font-serif text-[var(--fg)] max-w-2xl mx-auto leading-relaxed mb-6">
            {copy.message}
          </h2>

          {copy.cta && (
            <Link
              href={`/ozel-gun/${slug}`}
              className="inline-flex items-center gap-2 mt-2 px-6 py-3.5 rounded-xl bg-[var(--accent)] text-white font-medium text-sm md:text-base hover:opacity-90 transition-opacity shadow-md"
            >
              <span>{copy.cta}</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          )}

          {/* Alt süs: tekrar emoji */}
          <div className="flex justify-center gap-2 mt-6 text-lg opacity-70">
            {decor.emoji.slice(0, 3).map((emoji, i) => (
              <span key={i}>{emoji}</span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
