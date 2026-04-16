import { prisma } from "@/lib/prisma"

const SITE_COPY_KEY = "site_copy"

function getSiteSettingDelegate(): { findUnique: (args: any) => Promise<any>; upsert: (args: any) => Promise<any> } | null {
  try {
    const delegate = (prisma as any).siteSetting
    if (!delegate?.findUnique || !delegate?.upsert) return null
    return delegate
  } catch {
    return null
  }
}

export type SiteCopy = {
  heroTitle: string
  heroSubtitle: string
  footerTagline: string
  packageCardLabel: string
  productDetailSubtitle: string
  askHeroTitle: string
  askHeroSubtitle: string
  hatiraHeroTitle: string
  hatiraHeroSubtitle: string
  cocukHeroTitle: string
  cocukHeroSubtitle: string
  cocukBodyText: string
  landingAskDesc: string
  landingHatiraDesc: string
  landingCocukDesc: string
  processStep1Title: string
  processStep1Desc: string
  processStep2Title: string
  processStep2Desc: string
  processStep3Title: string
  processStep3Desc: string
  askDeliveryText: string
  askSectionTitleNeed: string
  askSectionNeedItems: string
  askSectionTitleDeliver: string
  askSectionDeliverItems: string
  hatiraSectionTitleNeed: string
  hatiraSectionNeedItems: string
  hatiraSectionTitleDeliver: string
  hatiraSectionDeliverItems: string
  cocukSectionTitleNeed: string
  cocukSectionNeedItems: string
  cocukSectionTitleDeliver: string
  cocukSectionDeliverItems: string
  sssPageTitle: string
  sssPageDescription: string
  sssCtaText: string
  sss1Question: string
  sss1Answer: string
  sss2Question: string
  sss2Answer: string
  sss3Question: string
  sss3Answer: string
  sss4Question: string
  sss4Answer: string
  sss5Question: string
  sss5Answer: string
  sss6Question: string
  sss6Answer: string
  sss7Question: string
  sss7Answer: string
  sss8Question: string
  sss8Answer: string
  sss9Question: string
  sss9Answer: string
  sss10Question: string
  sss10Answer: string
}

export const DEFAULT_SITE_COPY: SiteCopy = {
  heroTitle: "Bir iz, bir ömür.",
  heroSubtitle:
    "Sizin hikâyenizden sinematik kısa filmler. Stüdyo prodüksiyonu ile kişiye özel filmler.",
  footerTagline:
    "Sizin hikâyenizden sinematik kısa filmler. Stüdyo prodüksiyonu ile kişiye özel filmler.",
  packageCardLabel: "Sinematik kısa film",
  productDetailSubtitle: "Sinematik prodüksiyon",
  askHeroTitle: "Aşk Hikâyeniz",
  askHeroSubtitle:
    "Birlikte yazdığınız hikâyeyi sinematik bir dille anlatıyoruz. Stüdyo prodüksiyonu ile kişiye özel film.",
  hatiraHeroTitle: "Hatıralar Canlanıyor",
  hatiraHeroSubtitle:
    "Eski fotoğraflarınızdan canlanan anılar, sinematik bir dille. Stüdyo prodüksiyonu ile kişiye özel film.",
  cocukHeroTitle: "Çocukluk Hikayesi",
  cocukHeroSubtitle:
    "Çocuğunuzun büyüme hikayesini sinematik bir dille ölümsüzleştirin. Stüdyo prodüksiyonu ile kişiye özel film.",
  cocukBodyText:
    "Bebeklikten bugüne kadar olan yolculuğu, her anıyı özenle işleyerek sinematik bir masala dönüştürüyoruz. Çocuğunuzun büyüme sürecini, oyunlarını, gülüşlerini ve özel anlarını ölümsüzleştiriyoruz.",
  landingAskDesc: "Aşk hikâyenizi sinematik bir dille anlatıyoruz.",
  landingHatiraDesc: "Eski fotoğraflarınızdan canlanan anılar.",
  landingCocukDesc: "Çocuğunuzun büyüme hikayesini ölümsüzleştirin.",
  processStep1Title: "Gönder",
  processStep1Desc:
    "Fotoğraflarınızı ve hikâyenizi sipariş oluştururken formdan paylaşın.",
  processStep2Title: "Film",
  processStep2Desc: "Sinematik kısa filminiz profesyonelce oluşturulur.",
  processStep3Title: "Teslim",
  processStep3Desc: "24 saat içinde teslim. Acil teslimat seçeneği ile 3 saat.",
  askDeliveryText:
    "Siparişinizden sonra 24 saat içinde sinematik kısa filminizi teslim ediyoruz. Acil teslimat seçeneği ile 3 saat.",
  askSectionTitleNeed: "Sizden Ne Alıyoruz?",
  askSectionNeedItems:
    "En az 10-15 adet fotoğrafınız (sipariş formunda yükleme)\nHikâyenizi anlatan kısa metin (sipariş formunda)\nİsimler ve özel tarih (isteğe bağlı)\nİstenen ton ve özel notlar",
  askSectionTitleDeliver: "Ne Teslim Ediyoruz?",
  askSectionDeliverItems:
    "MP4 formatında kısa film (24 saat teslim)\n30 sn: sadece 9:16 Story/Reels; 60 sn: 16:9; 100 sn: ikisi de\nAcil teslimat seçeneği ile 3 saat teslim",
  hatiraSectionTitleNeed: "Sizden Ne Alıyoruz?",
  hatiraSectionNeedItems:
    "Eski ve yeni fotoğraflarınız (sipariş formunda yükleme)\nAnılarınızla ilgili kısa not veya hikâye (sipariş formunda)\nÖzel tarihler ve isimler (isteğe bağlı)\nİstenen ton ve özel notlar",
  hatiraSectionTitleDeliver: "Ne Teslim Ediyoruz?",
  hatiraSectionDeliverItems:
    "MP4 formatında kısa film (24 saat teslim)\n30 sn: sadece 9:16 Story/Reels; 60 sn: 16:9; 100 sn: ikisi de\nAcil teslimat seçeneği ile 3 saat teslim",
  cocukSectionTitleNeed: "Sizden Ne Alıyoruz?",
  cocukSectionNeedItems:
    "Çocuğunuzun büyüme sürecini gösteren fotoğraflar (sipariş formunda yükleme)\nİsim ve doğum tarihi (isteğe bağlı)\nÖzel anılar veya notlar (sipariş formunda)\nİstenen ton ve müzik tercihi",
  cocukSectionTitleDeliver: "Ne Teslim Ediyoruz?",
  cocukSectionDeliverItems:
    "MP4 formatında kısa film (24 saat teslim)\n30 sn: sadece 9:16 Story/Reels; 60 sn: 16:9; 100 sn: ikisi de\nAcil teslimat seçeneği ile 3 saat teslim",
  sssPageTitle: "Sık Sorulan Sorular",
  sssPageDescription:
    "Feel Studio hakkında merak ettikleriniz. Sorunuzun cevabını bulamadıysanız, WhatsApp üzerinden bizimle iletişime geçebilirsiniz.",
  sssCtaText: "Sorunuzun cevabını bulamadınız mı?",
  sss1Question: "Feel Studio nedir?",
  sss1Answer:
    "Feel Studio, sizin hikâyenizden sinematik kısa filmler oluşturan bir dijital hediye stüdyosudur. Sipariş formunda fotoğraflarınızı ve hikâyenizi paylaşırsınız, biz de bunları sinematik bir dille anlatan kısa filmler hazırlarız. Teslim 24 saat; acil teslimat seçeneği ile 3 saat.",
  sss2Question: "Nasıl sipariş verebilirim?",
  sss2Answer:
    "Siteden paket seçip sipariş oluşturursunuz. Fotoğraflarınızı ve hikâyenizi sipariş formunda paylaşırsınız. Ödeme sonrası süreç başlar.",
  sss3Question: "Film ne kadar sürede hazır olur?",
  sss3Answer: "Standart teslim süremiz 24 saattir. Acil teslimat seçeneği ile 3 saat içinde teslim.",
  sss4Question: "Hangi video formatlarında teslim ediliyor?",
  sss4Answer:
    "30 saniye: sadece 9:16 dikey (Story/Reels). 60 saniye: 16:9 yatay. 100 saniye: hem 16:9 hem 9:16. Tüm filmler MP4 formatında teslim edilir.",
  sss5Question: "Revizyon hakkı nedir?",
  sss5Answer:
    "İlk teslimden sonra beğenmediğiniz kısımları belirtirsiniz, biz düzeltiriz. Revizyon taleplerinizi WhatsApp üzerinden iletebilirsiniz.",
  sss6Question: "Fotoğraflarım güvende mi?",
  sss6Answer:
    "Evet, sipariş formunda paylaştığınız tüm fotoğraflar ve içerikler yalnızca siparişinizin hazırlanması amacıyla kullanılır. Gizlilik politikamız için ilgili sayfayı ziyaret edebilirsiniz.",
  sss7Question: "Ödeme nasıl yapılıyor?",
  sss7Answer:
    "Sipariş sonrası güvenli ödeme sayfasına yönlendirilirsiniz. Özel durumlar için WhatsApp üzerinden esnek seçenekler sunulabilir.",
  sss8Question: "Hangi paketi seçmeliyim?",
  sss8Answer:
    "Paketler 30, 60 ve 100 saniye. Kısa ve öz için 30 saniye, daha detaylı hikâye için 60 veya 100 saniye öneririz. Acil teslimat seçeneği ile 3 saatte teslim mümkün.",
  sss9Question: "Sosyal medyada paylaşabilir miyim?",
  sss9Answer:
    "Evet, teslim edilen filmleri paylaşabilirsiniz. 30 saniye paketinde teslim yalnızca 9:16 (Story/Reels) formatındadır; 100 saniye paketinde hem 16:9 hem 9:16 dahildir.",
  sss10Question: "Müzik seçimini nasıl yapıyoruz?",
  sss10Answer:
    "WhatsApp üzerinden size uygun müzik örnekleri göndeririz. Beğendiğiniz müziği seçebilir veya kendi müziğinizi önerebilirsiniz. Telif hakları konusunda dikkatli olunması gerekir.",
}

function deepMerge<T extends Record<string, unknown>>(
  defaults: T,
  overrides: Partial<T> | null | undefined
): T {
  if (!overrides || typeof overrides !== "object") return { ...defaults }
  const out = { ...defaults }
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    if (overrides[key] !== undefined && overrides[key] !== null) {
      ;(out as Record<string, unknown>)[key as string] = overrides[key]
    }
  }
  return out
}

export async function getSiteCopy(): Promise<SiteCopy> {
  try {
    const siteSetting = getSiteSettingDelegate()
    if (!siteSetting) return DEFAULT_SITE_COPY
    const row = await siteSetting.findUnique({
      where: { key: SITE_COPY_KEY },
    })
    if (!row?.value) return DEFAULT_SITE_COPY
    const parsed = JSON.parse(row.value) as Partial<SiteCopy>
    return deepMerge(DEFAULT_SITE_COPY, parsed)
  } catch {
    return DEFAULT_SITE_COPY
  }
}

export async function setSiteCopy(data: Partial<SiteCopy>): Promise<SiteCopy> {
  const siteSetting = getSiteSettingDelegate()
  if (!siteSetting) {
    throw new Error(
      "Prisma client güncel değil: siteSetting modeli yok. Proje kökünde 'npx prisma generate' çalıştırın."
    )
  }
  const current = await getSiteCopy()
  const merged = deepMerge(current, data)
  // Tüm değerleri string yap (form bazen boş string veya farklı tip gönderebilir)
  const normalized: SiteCopy = { ...DEFAULT_SITE_COPY }
  for (const k of Object.keys(DEFAULT_SITE_COPY) as (keyof SiteCopy)[]) {
    const v = merged[k]
    normalized[k] = v != null && v !== "" ? String(v) : DEFAULT_SITE_COPY[k]
  }
  const valueStr = JSON.stringify(normalized)
  await siteSetting.upsert({
    where: { key: SITE_COPY_KEY },
    create: { key: SITE_COPY_KEY, value: valueStr },
    update: { value: valueStr },
  })
  return normalized
}
