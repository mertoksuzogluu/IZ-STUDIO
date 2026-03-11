import WhatsAppCTAButton from './WhatsAppCTAButton'

interface PricingTier {
  duration: string
  price: string
  features: string[]
}

interface PricingTableProps {
  tiers: PricingTier[]
  product: 'ask' | 'hatira' | 'cocuk'
}

export default function PricingTable({ tiers, product }: PricingTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tiers.map((tier, index) => (
        <div
          key={index}
          className="bg-[var(--card)] border border-[var(--border)] rounded-sm p-6 hover:border-[var(--accent)] transition-all duration-300"
        >
          <div className="mb-4">
            <h3 className="text-2xl font-serif text-[var(--fg)] mb-2">{tier.duration}</h3>
            <p className="text-3xl font-serif text-[var(--accent)] mb-1">{tier.price} ₺</p>
          </div>
          
          <ul className="space-y-3 mb-6">
            {tier.features.map((feature, idx) => (
              <li key={idx} className="text-[var(--muted)] text-sm flex items-start gap-2">
                <svg className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          
          <WhatsAppCTAButton className="w-full" variant="secondary">
            WhatsApp ile Sipariş
          </WhatsAppCTAButton>
        </div>
      ))}
    </div>
  )
}

