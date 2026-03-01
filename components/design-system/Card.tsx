interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const hoverClasses = hover ? 'hover:border-[var(--fg)]/20 hover:shadow-md transition-all duration-300 cursor-pointer' : ''
  
  return (
    <div
      className={`bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 md:p-8 shadow-sm ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
