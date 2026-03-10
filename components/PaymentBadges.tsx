'use client'

import Image from 'next/image'

function VisaLogo({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 780 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="780" height="500" rx="40" fill="#fff" />
      <path
        d="M293.2 348.7l33.4-195.8h53.4l-33.4 195.8zM540.7 157.3c-10.6-4-27.2-8.3-47.9-8.3-52.8 0-90 26.6-90.2 64.7-.3 28.2 26.5 43.9 46.8 53.3 20.8 9.6 27.8 15.8 27.7 24.4-.1 13.2-16.6 19.2-32 19.2-21.4 0-32.7-3-50.3-10.2l-6.9-3.1-7.5 44c12.5 5.5 35.6 10.2 59.6 10.5 56.2 0 92.6-26.3 93-68.8.2-22.9-14.4-40.4-46.1-54.8-19.2-9.3-30.9-15.5-30.8-24.9 0-8.4 9.9-17.3 31.4-17.3 17.9-.3 30.9 3.6 41 7.7l4.9 2.3 7.4-42.7zM676.3 152.9h-41.3c-12.8 0-22.4 3.5-28 16.3l-79.4 179.5h56.1s9.2-24.1 11.2-29.4c6.1 0 60.8.1 68.6.1 1.6 6.9 6.5 29.3 6.5 29.3h49.6l-43.3-195.8zm-65.8 126.3c4.4-11.3 21.4-54.8 21.4-54.8-.3.5 4.4-11.4 7.1-18.8l3.6 17s10.3 47 12.5 56.8h-44.6v-.2zM232.8 152.9L180.5 285l-5.6-27c-9.7-31.2-39.9-65.1-73.7-82l47.8 171.5 56.6-.1 84.2-195.5h-56.9z"
        fill="#1A1F71"
      />
      <path
        d="M131.9 152.9H46.4l-.7 4c67.2 16.2 111.7 55.5 130.1 102.6l-18.8-90.3c-3.2-12.4-12.7-16-25.1-16.3z"
        fill="#F7A600"
      />
    </svg>
  )
}

function MastercardLogo({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 780 500" xmlns="http://www.w3.org/2000/svg">
      <rect width="780" height="500" rx="40" fill="#fff" />
      <circle cx="312" cy="250" r="150" fill="#EB001B" />
      <circle cx="468" cy="250" r="150" fill="#F79E1B" />
      <path
        d="M390 130.7c-38.1 30-62.5 76.8-62.5 129.3s24.4 99.3 62.5 129.3c38.1-30 62.5-76.8 62.5-129.3s-24.4-99.3-62.5-129.3z"
        fill="#FF5F00"
      />
    </svg>
  )
}

function IyzicoCheckoutLogo({ className = '' }: { className?: string }) {
  return (
    <Image
      src="/images/payment/iyzico-checkout.svg"
      alt="iyzico ile öde"
      width={200}
      height={56}
      className={className}
      unoptimized
    />
  )
}

function IyzicoFooterLogo({ className = '' }: { className?: string }) {
  return (
    <Image
      src="/images/payment/iyzico-footer.svg"
      alt="iyzico ile öde"
      width={200}
      height={40}
      className={className}
      unoptimized
    />
  )
}

function SSLBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg className="w-8 h-8 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-green-700 leading-tight">SSL GÜVENLİ</span>
        <span className="text-[10px] text-green-600 leading-tight">256-bit şifreleme</span>
      </div>
    </div>
  )
}

export default function PaymentBadges({
  variant = 'default',
}: {
  variant?: 'default' | 'compact' | 'checkout'
}) {
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4">
        <VisaLogo className="h-7 w-auto opacity-70" />
        <MastercardLogo className="h-7 w-auto opacity-70" />
        <IyzicoCheckoutLogo className="h-7 w-auto opacity-70" />
        <SSLBadge className="opacity-80" />
      </div>
    )
  }

  if (variant === 'checkout') {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary,#f9fafb)] p-5">
        <div className="flex flex-wrap items-center justify-center gap-5">
          <VisaLogo className="h-8 w-auto" />
          <MastercardLogo className="h-8 w-auto" />
          <div className="h-6 w-px bg-[var(--border)]" />
          <IyzicoCheckoutLogo className="h-8 w-auto" />
          <div className="h-6 w-px bg-[var(--border)]" />
          <SSLBadge />
        </div>
        <p className="text-center text-[11px] text-[var(--muted)] mt-3">
          Ödeme işlemleri iyzico güvenli altyapısı üzerinden 256-bit SSL şifreleme ile gerçekleştirilir.
          Kart bilgileriniz tarafımızca saklanmaz.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs text-[var(--muted)] uppercase tracking-wider font-sans">Güvenli Ödeme</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <IyzicoFooterLogo className="h-10 w-auto" />
        <div className="h-6 w-px bg-[var(--border)]" />
        <SSLBadge />
      </div>
    </div>
  )
}
