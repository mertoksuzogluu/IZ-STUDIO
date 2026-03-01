import type { Metadata } from 'next'
import Link from 'next/link'
import ThemeShell from '@/components/ThemeShell'
import HeroMedia from '@/components/HeroMedia'
import Container from '@/components/design-system/Container'
import Section from '@/components/design-system/Section'
import SectionHeader from '@/components/design-system/SectionHeader'
import Button from '@/components/design-system/Button'
import Card from '@/components/design-system/Card'
import Badge from '@/components/design-system/Badge'
import ModalVideoGallery from '@/components/ModalVideoGallery'
import StoryAnimation from '@/components/StoryAnimation'
import { getSiteCopy } from '@/lib/siteCopy'
import { getExampleVideos } from '@/lib/exampleVideos'
import { getActiveSpecialTheme } from '@/lib/settings'
import { SPECIAL_DAY_COPY, type SpecialThemeKey } from '@/lib/themes'
import SpecialDayBanner from '@/components/SpecialDayBanner'
import { getFaq } from '@/lib/faq'

export const metadata: Metadata = {
  title: 'Feel Studio | Sinematik Kısa Filmler',
  description: 'Sizin hikâyenizden sinematik kısa filmler. Bir iz, bir ömür.',
}

// Örnek videolar admin panelden güncellenebildiği için her istekte taze veri al
export const revalidate = 0

export default async function HomePage() {
  const [copy, exampleVideos, activeTheme, faqPreview] = await Promise.all([
    getSiteCopy(),
    getExampleVideos(),
    getActiveSpecialTheme(),
    getFaq("genel"),
  ])
  const themeKey = activeTheme as 'default' | SpecialThemeKey
  const specialCopy =
    themeKey !== 'default' ? SPECIAL_DAY_COPY[themeKey as SpecialThemeKey] : null

  const products = [
    {
      title: 'Aşk',
      description: copy.landingAskDesc,
      slug: 'ask',
      imageSrc: '/placeholder-ask.jpg',
      imageAlt: 'Aşk paketi',
      animationType: 'ask' as const,
    },
    {
      title: 'Hatıra',
      description: copy.landingHatiraDesc,
      slug: 'hatira',
      imageSrc: '/placeholder-hatira.jpg',
      imageAlt: 'Hatıra paketi',
      animationType: 'hatira' as const,
    },
    {
      title: 'Çocuk',
      description: copy.landingCocukDesc,
      slug: 'cocuk',
      imageSrc: '/placeholder-cocuk.jpg',
      imageAlt: 'Çocuk paketi',
      animationType: 'cocuk' as const,
    },
  ]
  const processSteps = [
    { step: '1', title: copy.processStep1Title, description: copy.processStep1Desc },
    { step: '2', title: copy.processStep2Title, description: copy.processStep2Desc },
    { step: '3', title: copy.processStep3Title, description: copy.processStep3Desc },
  ]
  return (
    <ThemeShell themeKey={themeKey}>
      {/* Özel gün banner'ı */}
      {specialCopy && (
        <SpecialDayBanner themeKey={themeKey as SpecialThemeKey} />
      )}

      {/* Hero Section - Editorial Split Layout */}
      <Section>
        <Container>
          <div className="pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Left: Text Content */}
              <div className="fade-in">
                <h1 className="text-5xl md:text-6xl font-serif text-[var(--fg)] mb-6 tracking-tight leading-[1.05]">
                  {copy.heroTitle}
                </h1>
                <p className="text-base md:text-lg text-[var(--muted)] mb-10 leading-relaxed">
                  {copy.heroSubtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="primary" href="/products">
                    Paketleri İncele
                  </Button>
                  <Button variant="outline" href="#ornekler">
                    Örnekleri Gör
                  </Button>
                </div>
              </div>
              
              {/* Right: Video */}
              <div className="fade-in">
                <div className="aspect-video rounded-xl overflow-hidden border border-[var(--border)] shadow-sm">
                  <HeroMedia
                    alt="Feel Studio sinematik kısa film örneği"
                    className="w-full h-full"
                    enableParallax={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Product Grid */}
      <Section variant="subtle">
        <Container>
          <SectionHeader
            eyebrow="Paketlerimiz"
            title="Her hikâyenin kendine özgü bir anlatımı vardır"
            description="Size en uygun paketi seçin ve hikâyenizi ölümsüzleştirin."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`}>
                <Card hover className="h-full">
                  <div className="aspect-video bg-[var(--card)] rounded-lg mb-6 overflow-hidden border border-[var(--border)] flex items-center justify-center">
                    <StoryAnimation type={product.animationType} className="w-full h-full" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif text-[var(--fg)] mb-3 tracking-tight">
                    {product.title}
                  </h3>
                  <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
                    {product.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* How It Works - Sipariş süreci (adım adım) */}
      <Section id="surec">
        <Container>
          <SectionHeader
            eyebrow="Sipariş süreci"
            title="Adım adım nasıl ilerliyoruz?"
            description="Hikâyenizi paylaşın, gerisini biz halledelim."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Timeline line for desktop */}
            <div className="hidden md:block absolute left-0 right-0 top-12 h-px bg-[var(--border)]" />
            
            {processSteps.map((step, index) => (
              <div key={index} className="relative text-center fade-in">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-[var(--fg)] text-white font-serif text-xl md:text-2xl mb-4 relative z-10">
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

      {/* Örnek çalışmalar - Video galerisi (süreçten farklı: bitmiş işler) */}
      <Section id="ornekler" variant="subtle">
        <Container>
          <SectionHeader
            eyebrow="Örnek çalışmalar"
            title="Bitmiş filmlerden sahneler"
            description="Sizin için hazırlayacağımız tarzda örnek videolar. İzleyin, tarzımızı keşfedin."
          />
          
          <ModalVideoGallery items={exampleVideos} />
        </Container>
      </Section>

      {/* Trust Section */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            <div>
              <Badge variant="accent" className="mb-4">Teslim Süresi</Badge>
              <p className="text-2xl md:text-3xl font-serif text-[var(--fg)] mb-2">24 saat</p>
              <p className="text-sm text-[var(--muted)]">Acil teslimat seçeneği ile 3 saat</p>
            </div>
            <div>
              <Badge variant="accent" className="mb-4">Gizlilik</Badge>
              <p className="text-2xl md:text-3xl font-serif text-[var(--fg)] mb-2">%100 Güvenli</p>
              <p className="text-sm text-[var(--muted)]">KVKK uyumlu</p>
            </div>
            <div>
              <Badge variant="accent" className="mb-4">Revizyon</Badge>
              <p className="text-2xl md:text-3xl font-serif text-[var(--fg)] mb-2">1-3 Hakkı</p>
              <p className="text-sm text-[var(--muted)]">Paketinize göre</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ Preview */}
      <Section variant="subtle">
        <Container>
          <SectionHeader
            eyebrow="Sık Sorulan Sorular"
            title="Merak ettikleriniz"
            description="Daha fazla soru için SSS sayfamızı ziyaret edin."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
            {faqPreview.map((item, index) => (
              <Card key={index}>
                <h3 className="text-lg font-serif text-[var(--fg)] mb-3 tracking-tight">
                  {item.question}
                </h3>
                <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
                  {item.answer}
                </p>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button variant="outline" href="/sss">
              Tüm Soruları Gör
            </Button>
          </div>
        </Container>
      </Section>
    </ThemeShell>
  )
}
