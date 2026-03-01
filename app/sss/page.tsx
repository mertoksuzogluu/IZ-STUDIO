import type { Metadata } from 'next'
import ThemeShell from '@/components/ThemeShell'
import Container from '@/components/design-system/Container'
import Section from '@/components/design-system/Section'
import SectionHeader from '@/components/design-system/SectionHeader'
import Button from '@/components/design-system/Button'
import FAQAccordion from '@/components/FAQAccordion'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { getSiteCopy } from '@/lib/siteCopy'
import { getFaq } from '@/lib/faq'

export const metadata: Metadata = {
  title: 'Sık Sorulan Sorular | Feel Studio',
  description: 'Feel Studio hakkında sık sorulan sorular ve cevapları.',
}

const SSS_KEYS = [
  'sss1', 'sss2', 'sss3', 'sss4', 'sss5', 'sss6', 'sss7', 'sss8', 'sss9', 'sss10',
] as const

function getSssItems(copy: Awaited<ReturnType<typeof getSiteCopy>>) {
  const items: { question: string; answer: string }[] = []
  for (const key of SSS_KEYS) {
    const q = copy[`${key}Question` as keyof typeof copy]
    const a = copy[`${key}Answer` as keyof typeof copy]
    if (typeof q === 'string' && q.trim()) {
      items.push({ question: q.trim(), answer: typeof a === 'string' ? a.trim() : '' })
    }
  }
  return items
}

export default async function SSSPage() {
  const [copy, faqItems] = await Promise.all([getSiteCopy(), getFaq("genel")])
  const sssItems = getSssItems(copy)
  const items = faqItems.length > 0 ? faqItems : sssItems
  return (
    <ThemeShell themeKey="default">
      <Section>
        <Container>
          <div className="pt-20 pb-12">
            <SectionHeader
              title={copy.sssPageTitle || 'Sık Sorulan Sorular'}
              description={copy.sssPageDescription || 'Feel Studio hakkında merak ettikleriniz. Sorunuzun cevabını bulamadıysanız, WhatsApp üzerinden bizimle iletişime geçebilirsiniz.'}
            />
            
            <div className="max-w-3xl mx-auto mb-12">
              <FAQAccordion items={items.length ? items : [{ question: 'Henüz soru eklenmedi.', answer: 'Admin panelinden SSS metinlerini düzenleyebilirsiniz.' }]} />
            </div>
            
            <div className="text-center">
              <p className="text-sm md:text-base text-[var(--muted)] mb-6 leading-relaxed">
                {copy.sssCtaText || 'Sorunuzun cevabını bulamadınız mı?'}
              </p>
              <a
                href={buildWhatsAppLink({})}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary">
                  WhatsApp Destek
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </ThemeShell>
  )
}
