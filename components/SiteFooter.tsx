'use client'

import Link from 'next/link'
import Container from './design-system/Container'
import Button from './design-system/Button'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import PaymentBadges from './PaymentBadges'

export default function SiteFooter({
  tagline = "Sizin hikâyenizden sinematik kısa filmler. Stüdyo prodüksiyonu ile kişiye özel filmler.",
}: {
  tagline?: string
}) {
  return (
    <footer className="border-t border-[var(--border)] bg-white">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
            <div>
              <h3 className="text-lg md:text-xl font-serif text-[var(--fg)] mb-4 tracking-tight">Feel Studio</h3>
              <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
                {tagline}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-sans text-[var(--fg)] mb-4 uppercase tracking-wider">Bağlantılar</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/hakkimizda" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/sss" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
                    Sık Sorulan Sorular
                  </Link>
                </li>
                <li>
                  <Link href="/teslimat-iade" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
                    Teslimat ve İade
                  </Link>
                </li>
                <li>
                  <Link href="/mesafeli-satis-sozlesmesi" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
                    Mesafeli Satış Sözleşmesi
                  </Link>
                </li>
                <li>
                  <Link href="/gizlilik" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
                    Gizlilik Politikası
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-sans text-[var(--fg)] mb-4 uppercase tracking-wider">İletişim</h4>
              <a
                href={buildWhatsAppLink({})}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="text-sm"
                >
                  WhatsApp Destek
                </Button>
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border)]">
            <div className="mb-6">
              <PaymentBadges variant="default" />
            </div>
            <p className="text-sm text-[var(--muted)] text-center">
              &copy; {new Date().getFullYear()} Feel Studio. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
