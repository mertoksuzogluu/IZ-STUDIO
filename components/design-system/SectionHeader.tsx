interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}

export default function SectionHeader({ eyebrow, title, description, className = '' }: SectionHeaderProps) {
  return (
    <div className={`text-center mb-12 md:mb-16 ${className}`}>
      {eyebrow && (
        <p className="text-sm md:text-base text-[var(--muted)] uppercase tracking-wider mb-3 font-sans">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-serif text-[var(--fg)] tracking-tight mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}


