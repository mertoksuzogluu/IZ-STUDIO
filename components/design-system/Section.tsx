interface SectionProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'subtle'
  id?: string
}

export default function Section({ children, className = '', variant = 'default', id }: SectionProps) {
  const variantClasses = variant === 'subtle' ? 'bg-[var(--border)]/30' : 'bg-[var(--card)]'
  
  return (
    <section id={id} className={`py-16 md:py-24 ${variantClasses} ${className}`}>
      {children}
    </section>
  )
}

