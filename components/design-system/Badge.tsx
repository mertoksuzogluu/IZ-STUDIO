interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent'
  className?: string
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantClasses = variant === 'accent'
    ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20'
    : 'bg-gray-50 text-[var(--muted)] border border-[var(--border)]'
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-sans uppercase tracking-wider ${variantClasses} ${className}`}>
      {children}
    </span>
  )
}

