'use client'

import { buildWhatsAppLink } from '@/lib/whatsapp'

interface WhatsAppCTAButtonProps {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
}

export default function WhatsAppCTAButton({
  children,
  className = '',
  variant = 'primary',
}: WhatsAppCTAButtonProps) {
  const handleClick = () => {
    const url = buildWhatsAppLink()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const baseClasses = 'inline-flex items-center justify-center px-6 py-3 rounded-sm font-sans text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]'
  
  const variantClasses = variant === 'primary'
    ? 'bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent2)] hover:text-[var(--bg)]'
    : 'border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--card)]'

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
      aria-label="WhatsApp ile iletişime geç"
    >
      {children}
    </button>
  )
}

