import Button from "./Button"

interface PackageCardProps {
  duration: string
  product: string
  featured?: boolean
  tagline?: string
}

export default function PackageCard({
  duration,
  product,
  featured = false,
  tagline = "Sinematik kısa film",
}: PackageCardProps) {
  return (
    <div
      className={`relative bg-white border rounded-xl p-6 md:p-8 shadow-sm flex flex-col h-full ${
        featured ? "border-[var(--accent)] shadow-md" : "border-[var(--border)]"
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-[var(--accent)] text-white px-4 py-1 rounded-full text-xs font-sans uppercase tracking-wider">
            Popüler
          </span>
        </div>
      )}

      <div className="mb-8 flex-grow">
        <h3 className="text-xl md:text-2xl font-serif text-[var(--fg)] tracking-tight">
          {duration}
        </h3>
        <p className="text-sm text-[var(--muted)] mt-2">
          {tagline}
        </p>
      </div>

      <Button variant="outline" href={`/products/${product}`} className="w-full">
        Paketleri İncele
      </Button>
    </div>
  )
}
