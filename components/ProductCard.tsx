import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  title: string
  description: string
  href: string
  imageSrc: string
  imageAlt: string
}

export default function ProductCard({
  title,
  description,
  href,
  imageSrc,
  imageAlt,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-[var(--card)] border border-[var(--border)] rounded-sm overflow-hidden hover:border-[var(--accent)] transition-all duration-300 hover:transform hover:-translate-y-1"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-serif text-[var(--fg)] mb-2 group-hover:text-[var(--accent)] transition-colors">
          {title}
        </h3>
        <p className="text-[var(--muted)] text-sm mb-4">{description}</p>
        <span className="text-[var(--fg)] text-sm font-sans inline-flex items-center gap-2 group-hover:gap-3 transition-all">
          İncele
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

