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
  title: 'Hatıra Paketi | Feel Studio',
  description: 'Eski fotoğraflarınızdan canlanan anılar, sinematik bir dille.',
}

const PACKAGE_DURATIONS = ["30 Saniye", "60 Saniye", "100 Saniye"] as const

function parseListItems(text: string | undefined | null): string[] {
  if (text == null || typeof text !== "string") return []
  return text.split("\n").map((s) => s.trim()).filter(Boolean)
}

const processSteps = [
  {
    step: '1',
    title: 'Fotoğraflarınızı Gönderin',
    description: 'Sipariş formunda eski ve yeni fotoğraflarınızı yükleyin.',
  },
  {
    step: '2',
    title: 'Hikâyenizi Anlatın',
    description: 'Sipariş formunda anılarınızla ilgili kısa not veya hikâye yazın.',
  },
  {
    step: '3',
    title: 'Film Hazırlanır',
    description: '24 saat içinde teslim. Acil teslimat seçeneği ile 3 saat.',
  },
]

export default async function HatiraPage() {
  let copy = DEFAULT_SITE_COPY
  try {
    copy = await getSiteCopy()
  } catch {}
  const faqItems = await getFaq("hatira").catch(() => [])
  try {
  return (
    <ThemeShell themeKey="hatira">
      <FloatingWhatsApp />
      
      {/* Hero Section - Editorial Split */}
      <Section>
        <Container>
          <div className="pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Left: Text Content */}
              <div className="fade-in">
                <h1 className="text-5xl md:text-6xl font-serif text-[var(--fg)] mb-6 tracking-tight leading-[1.05]">
                  {copy.hatiraHeroTitle}
                </h1>
                <p className="text-base md:text-lg text-[var(--muted)] mb-10 leading-relaxed italic">
                  {copy.hatiraHeroSubtitle}
                </p>
                <Button variant="primary" href="/products/hatira">
                  Paketleri İncele
                </Button>
              </div>
              
              {/* Right: Video */}
              <div className="fade-in">
                <div className="aspect-video rounded-xl overflow-hidden border border-[var(--border)] shadow-sm">
                  <HeroMedia
                    alt="Hatıra paketi sinematik kısa film örneği"
                    className="w-full h-full"
                    pageKey="hatira"
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
            title="Geçmişinizi ölümsüzleştirecek paketi seçin"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {PACKAGE_DURATIONS.map((duration, index) => (
              <PackageCard
                key={duration}
                duration={duration}
                product="hatira"
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
                {copy.hatiraSectionTitleNeed ?? "Sizden Ne Alıyoruz?"}
              </h2>
              <ul className="space-y-4">
                {(parseListItems(copy.hatiraSectionNeedItems).length
                  ? parseListItems(copy.hatiraSectionNeedItems)
                  : [
                      "Eski ve yeni fotoğraflarınız (sipariş formunda yükleme)",
                      "Anılarınızla ilgili kısa not veya hikâye (sipariş formunda)",
                      "Özel tarihler ve isimler (isteğe bağlı)",
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
                {copy.hatiraSectionTitleDeliver ?? "Ne Teslim Ediyoruz?"}
              </h2>
              <ul className="space-y-4">
                {(parseListItems(copy.hatiraSectionDeliverItems).length
                  ? parseListItems(copy.hatiraSectionDeliverItems)
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

      {/* How It's Made Timeline */}
      <Section>
        <Container>
          <SectionHeader
            eyebrow="Anı Filmi Nasıl Hazırlanır?"
            title="Süreç basit"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            <div className="hidden md:block absolute left-0 right-0 top-12 h-px bg-[var(--border)]" />
            
            {processSteps.map((step, index) => (
              <div key={index} className="relative text-center fade-in">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-[var(--accent)] text-white font-serif text-xl md:text-2xl mb-4 relative z-10">
                  {step.step}
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-[var(--fg)] mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Trust + Privacy Emphasis */}
      <Section variant="subtle">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-serif text-[var(--fg)] mb-4 tracking-tight">
              Güven ve Gizlilik
            </h2>
            <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
              Gönderdiğiniz tüm fotoğraflar ve içerikler yalnızca siparişinizin hazırlanması amacıyla kullanılır.
              KVKK uyumlu gizlilik politikamız kapsamında, verileriniz güvenle saklanır.
            </p>
            <Button variant="outline" href="/gizlilik">
              Gizlilik Politikası
            </Button>
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section id="sss">
        <Container>
          <SectionHeader
            eyebrow="Sıkça Sorulan Sorular"
            title="Hatıra paketi hakkında"
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
      <ThemeShell themeKey="hatira">
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
