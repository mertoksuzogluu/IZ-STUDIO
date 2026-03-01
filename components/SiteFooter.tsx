'use client'

import Link from 'next/link'
import Container from './design-system/Container'
import Button from './design-system/Button'
import { buildWhatsAppLink } from '@/lib/whatsapp'

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
                  <Link href="/gizlilik" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/sss" className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
                    Sık Sorulan Sorular
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

          <div className="pt-8 border-t border-[var(--border)] text-center">
            <p className="text-sm text-[var(--muted)]">
              &copy; {new Date().getFullYear()} Feel Studio. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
