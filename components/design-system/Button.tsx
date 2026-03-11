'use client'

import Link from 'next/link'
import { buildWhatsAppLink } from '@/lib/whatsapp'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  children: React.ReactNode
  href?: string
  whatsapp?: {
    orderCode?: string
  }
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  href,
  whatsapp,
  onClick,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center px-6 py-3 rounded-sm font-sans text-sm md:text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent2)]',
    secondary: 'bg-white text-[var(--fg)] border border-[var(--border)] hover:bg-gray-50',
    ghost: 'text-[var(--fg)] hover:bg-gray-50',
    outline: 'border border-[var(--border)] text-[var(--fg)] hover:bg-gray-50',
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (whatsapp) {
      const url = buildWhatsAppLink()
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    onClick?.(e)
  }

  // If href is provided and it's an internal link, use Next.js Link
  if (href && !href.startsWith('http') && !whatsapp) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

