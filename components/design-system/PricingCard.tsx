import Button from './Button'

interface PricingCardProps {
  duration: string
  price: string
  features: string[]
  featured?: boolean
  product: string
}

export default function PricingCard({ duration, price, features, featured = false, product }: PricingCardProps) {
  return (
    <div className={`relative bg-white border rounded-xl p-6 md:p-8 shadow-sm flex flex-col h-full ${featured ? 'border-[var(--accent)] shadow-md' : 'border-[var(--border)]'}`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-[var(--accent)] text-white px-4 py-1 rounded-full text-xs font-sans uppercase tracking-wider">
            Popüler
          </span>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-serif text-[var(--fg)] mb-2 tracking-tight">{duration}</h3>
        <p className="text-3xl md:text-4xl font-serif text-[var(--fg)] mb-1 tracking-tight">{price} ₺</p>
      </div>

      <div className="flex-grow flex flex-col">
        <ul className="space-y-3 mb-8">
          {features.map((feature, idx) => (
            <li key={idx} className="text-[var(--muted)] text-sm md:text-base flex items-start gap-3 leading-relaxed">
              <svg className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant="outline"
        href={`/products/${product}`}
        className="w-full"
      >
        Paketleri İncele
      </Button>
    </div>
  )
}

