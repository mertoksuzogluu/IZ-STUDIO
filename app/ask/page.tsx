import type { Metadata } from 'next'
import ThemeShell from '@/components/ThemeShell'
import HeroMedia from '@/components/HeroMedia'
import Container from '@/components/design-system/Container'
import Section from '@/components/design-system/Section'
import SectionHeader from '@/components/design-system/SectionHeader'
import Button from '@/components/design-system/Button'
import PackageCard from '@/components/design-system/PackageCard'
import Card from '@/components/design-system/Card'
import FAQAccordion from '@/components/FAQAccordion'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import { getSiteCopy } from '@/lib/siteCopy'
import { getFaq } from '@/lib/faq'

export const metadata: Metadata = {
  title: 'Aşk Paketi | Feel Studio',
  description: 'Aşk hikâyenizi sinematik bir dille anlatıyoruz.',
}

const PACKAGE_DURATIONS = ["30 Saniye", "60 Saniye", "100 Saniye"] as const

function parseListItems(text: string | undefined | null): string[] {
  if (text == null || typeof text !== "string") return []
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

export default async function AskPage() {
  const [copy, faqItems] = await Promise.all([getSiteCopy(), getFaq("ask")])
  return (
    <ThemeShell themeKey="ask">
      <FloatingWhatsApp />
      
      {/* Hero Section - Editorial Split */}
      <Section>
        <Container>
          <div className="pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Left: Text Content */}
              <div className="fade-in">
                <h1 className="text-5xl md:text-6xl font-serif text-[var(--fg)] mb-6 tracking-tight leading-[1.05]">
                  {copy.askHeroTitle}
                </h1>
                <p className="text-base md:text-lg text-[var(--muted)] mb-10 leading-relaxed">
                  {copy.askHeroSubtitle}
                </p>
                <Button variant="primary" href="/products/ask">
                  Paketleri İncele
                </Button>
              </div>
              
              {/* Right: Video */}
              <div className="fade-in">
                <div className="aspect-video rounded-xl overflow-hidden border border-[var(--border)] shadow-sm">
                  <HeroMedia
                    alt="Aşk paketi sinematik kısa film örneği"
                    className="w-full h-full"
                    pageKey="ask"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Packages */}
      <Section variant="subtle">
        <Container>
          <SectionHeader
            eyebrow="Paketlerimiz"
            title="Aşkınızı en iyi anlatan paketi seçin"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {PACKAGE_DURATIONS.map((duration, index) => (
              <PackageCard
                key={duration}
                duration={duration}
                product="ask"
                featured={index === 1}
                tagline={copy.packageCardLabel}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* What We Need / What We Deliver */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <Card>
              <h2 className="text-2xl md:text-3xl font-serif text-[var(--fg)] mb-6 tracking-tight">
                {copy.askSectionTitleNeed ?? "Sizden Ne Alıyoruz?"}
              </h2>
              <ul className="space-y-4">
                {(parseListItems(copy.askSectionNeedItems).length
                  ? parseListItems(copy.askSectionNeedItems)
                  : [
                      "En az 10-15 adet fotoğrafınız (sipariş formunda yükleme)",
                      "Hikâyenizi anlatan kısa metin (sipariş formunda)",
                      "İsimler ve özel tarih (isteğe bağlı)",
                      "İstenen ton ve özel notlar",
                    ]
                ).map((item, index) => (
                  <li key={index} className="text-sm md:text-base text-[var(--muted)] flex items-start gap-3 leading-relaxed">
                    <svg className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h2 className="text-2xl md:text-3xl font-serif text-[var(--fg)] mb-6 tracking-tight">
                {copy.askSectionTitleDeliver ?? "Ne Teslim Ediyoruz?"}
              </h2>
              <ul className="space-y-4">
                {(parseListItems(copy.askSectionDeliverItems).length
                  ? parseListItems(copy.askSectionDeliverItems)
                  : [
                      "MP4 formatında kısa film (24 saat teslim)",
                      "30 sn: sadece 9:16 Story/Reels; 60 sn: 16:9; 100 sn: ikisi de",
                      "Acil teslimat seçeneği ile 3 saat teslim",
                    ]
                ).map((item, index) => (
                  <li key={index} className="text-sm md:text-base text-[var(--muted)] flex items-start gap-3 leading-relaxed">
                    <svg className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Process and Delivery */}
      <Section variant="subtle">
        <Container>
          <SectionHeader
            eyebrow="Süreç ve Teslim"
            title="Siparişinizden teslimata kadar"
          />
          
          <div className="max-w-3xl mx-auto space-y-6 text-sm md:text-base text-[var(--muted)] leading-relaxed">
            <p>
              Sipariş oluştururken formdan paylaştığınız fotoğraf ve hikâyeyi değerlendiriyoruz.
              Hikâyenize en uygun senaryoyu hazırlayıp onayınıza sunuyoruz.
            </p>
            <p>
              {copy.askDeliveryText}{" "}
              Revizyon haklarınızı kullanarak filmde istediğiniz değişiklikleri talep edebilirsiniz.
            </p>
            <p>
              Amacımız, aşk hikâyenizi en mükemmel şekilde yansıtan bir eser ortaya çıkarmak.
            </p>
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section id="sss">
        <Container>
          <SectionHeader
            eyebrow="Sıkça Sorulan Sorular"
            title="Aşk paketi hakkında"
          />
          
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqItems} />
          </div>
        </Container>
      </Section>
    </ThemeShell>
  )
}
