import type { Metadata } from 'next'
import ThemeShell from '@/components/ThemeShell'
import HeroMedia from '@/components/HeroMedia'
import { getSiteCopy, DEFAULT_SITE_COPY } from '@/lib/siteCopy'
import Container from '@/components/design-system/Container'
import Section from '@/components/design-system/Section'
import SectionHeader from '@/components/design-system/SectionHeader'
import Button from '@/components/design-system/Button'
import PackageCard from '@/components/design-system/PackageCard'
import Card from '@/components/design-system/Card'
import FAQAccordion from '@/components/FAQAccordion'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import { getFaq } from '@/lib/faq'

export const metadata: Metadata = {
  title: 'Çocuk Paketi | Feel Studio',
  description: 'Çocuğunuzun büyüme hikayesini sinematik bir dille ölümsüzleştirin.',
}

const PACKAGE_DURATIONS = ["30 Saniye", "60 Saniye", "100 Saniye"] as const

function parseListItems(text: string | undefined | null): string[] {
  if (text == null || typeof text !== "string") return []
  return text.split("\n").map((s) => s.trim()).filter(Boolean)
}

export default async function CocukPage() {
  let copy = DEFAULT_SITE_COPY
  try {
    copy = await getSiteCopy()
  } catch {}
  const faqItems = await getFaq("cocuk").catch(() => [])
  try {
  return (
    <ThemeShell themeKey="cocuk">
      <FloatingWhatsApp />
      
      {/* Hero Section - Editorial Split */}
      <Section>
        <Container>
          <div className="pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Left: Text Content */}
              <div className="fade-in">
                <h1 className="text-5xl md:text-6xl font-serif text-[var(--fg)] mb-6 tracking-tight leading-[1.05]">
                  {copy.cocukHeroTitle}
                </h1>
                <p className="text-base md:text-lg text-[var(--muted)] mb-10 leading-relaxed">
                  {copy.cocukHeroSubtitle}
                </p>
                <Button variant="primary" href="/products/cocuk">
                  Paketleri İncele
                </Button>
              </div>
              
              {/* Right: Video */}
              <div className="fade-in">
                <div className="aspect-video rounded-xl overflow-hidden border border-[var(--border)] shadow-sm">
                  <HeroMedia
                    alt="Çocuk paketi sinematik kısa film örneği"
                    className="w-full h-full"
                    pageKey="cocuk"
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
            title="Çocuğunuzun hikayesine en uygun paketi seçin"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {PACKAGE_DURATIONS.map((duration, index) => (
              <PackageCard
                key={duration}
                duration={duration}
                product="cocuk"
                featured={index === 1}
                tagline={copy.packageCardLabel}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Sizden Ne Alıyoruz / Ne Teslim Ediyoruz */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <Card>
              <h2 className="text-2xl md:text-3xl font-serif text-[var(--fg)] mb-6 tracking-tight">
                {copy.cocukSectionTitleNeed ?? "Sizden Ne Alıyoruz?"}
              </h2>
              <ul className="space-y-4">
                {(parseListItems(copy.cocukSectionNeedItems).length
                  ? parseListItems(copy.cocukSectionNeedItems)
                  : [
                      "Çocuğunuzun büyüme sürecini gösteren fotoğraflar (sipariş formunda yükleme)",
                      "İsim ve doğum tarihi (isteğe bağlı)",
                      "Özel anılar veya notlar (sipariş formunda)",
                      "İstenen ton ve müzik tercihi",
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
                {copy.cocukSectionTitleDeliver ?? "Ne Teslim Ediyoruz?"}
              </h2>
              <ul className="space-y-4">
                {(parseListItems(copy.cocukSectionDeliverItems).length
                  ? parseListItems(copy.cocukSectionDeliverItems)
                  : [
                      "MP4 formatında kısa film (24 saat teslim)",
                      "30 sn: 16:9 + 9:16 Story/Reels; 60 sn: 16:9; 100 sn: ikisi de",
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

      {/* Story Section */}
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              eyebrow="Hikâye"
              title="Çocukların kahraman olduğu masal"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <Card>
                <h3 className="text-xl md:text-2xl font-serif text-[var(--fg)] mb-4 tracking-tight">
                  Büyüme Hikayesi
                </h3>
                <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
                  {copy.cocukBodyText}
                </p>
              </Card>
              
              <Card>
                <h3 className="text-xl md:text-2xl font-serif text-[var(--fg)] mb-4 tracking-tight">
                  Özel Detaylar
                </h3>
                <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
                  Çocuğunuzun ismi, doğum tarihi ve özel notlarınızı filme ekleyebiliriz.
                  İstediğiniz ton (neşeli, macera dolu, sakin vb.) ve özel notlarınızı sipariş formunda yazabilirsiniz.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section id="sss" variant="subtle">
        <Container>
          <SectionHeader
            eyebrow="Sıkça Sorulan Sorular"
            title="Çocuk paketi hakkında"
          />
          
          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqItems} />
          </div>
        </Container>
      </Section>
    </ThemeShell>
  )
  } catch {
    return (
      <ThemeShell themeKey="cocuk">
        <Section>
          <Container>
            <div className="pt-32 pb-16 text-center">
              <h1 className="text-xl font-semibold text-[var(--fg)] mb-2">Sayfa yüklenemedi</h1>
              <p className="text-[var(--muted)] mb-6">Lütfen daha sonra tekrar deneyin.</p>
              <Button href="/" variant="primary">Ana sayfaya dön</Button>
            </div>
          </Container>
        </Section>
      </ThemeShell>
    )
  }
}
