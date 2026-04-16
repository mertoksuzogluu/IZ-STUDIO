import { prisma } from "@/lib/prisma"

export interface FaqItem {
  question: string
  answer: string
}

type FaqPage = "genel" | "ask" | "hatira" | "cocuk"

const FAQ_KEY_PREFIX = "faq_"

const DEFAULT_FAQ: Record<FaqPage, FaqItem[]> = {
  genel: [
    { question: "Film ne kadar sürede hazır olur?", answer: "Standart teslim süremiz 24 saattir. Acil teslimat seçeneği ile 3 saat içinde teslim." },
    { question: "Fotoğraf ve hikâyemi nasıl paylaşırım?", answer: "Sipariş oluştururken formdan fotoğraflarınızı ve hikâyenizi paylaşırsınız. Sonraki adımda yükleme ekranı açılır." },
    { question: "Video formatları nasıl?", answer: "30 saniye: sadece 9:16 dikey (Story/Reels). 60 saniye: 16:9 yatay. 100 saniye: hem 16:9 hem 9:16." },
  ],
  ask: [
    { question: "Aşk paketi için kaç fotoğraf gerekli?", answer: "En az 10-15 adet fotoğraf yeterlidir. Sipariş oluştururken formdan yüklersiniz." },
    { question: "Hikâyemizi nasıl anlatmalıyız?", answer: "Sipariş formunda hikâyenizi kısa metin veya anahtar kelimelerle yazın." },
    { question: "Müzik seçimini nasıl yapıyoruz?", answer: "Size uygun müzik örnekleri göndeririz. Beğendiğinizi seçebilir veya kendi müziğinizi önerebilirsiniz." },
    { question: "Film ne kadar sürede hazır olur?", answer: "Standart teslim 24 saattir. Acil teslimat seçeneği ile 3 saat." },
    { question: "Revizyon hakkı nasıl kullanılır?", answer: "İlk teslimden sonra beğenmediğiniz kısımları belirtirsiniz, biz düzeltiriz." },
  ],
  hatira: [
    { question: "Eski fotoğrafların kalitesi yeterli mi?", answer: "Eski fotoğrafların kalitesi düşük olsa bile, modern tekniklerle işleyip kullanabiliriz." },
    { question: "Kaç fotoğraf göndermeliyim?", answer: "En az 10-15 adet fotoğraf yeterlidir. Eski ve yeni fotoğrafların karışımı idealdir." },
    { question: "Film ne kadar sürede hazır olur?", answer: "Standart teslim 24 saattir. Acil teslimat seçeneği ile 3 saat." },
  ],
  cocuk: [
    { question: "Çocuk paketi için hangi fotoğrafları göndermeliyim?", answer: "Çocuğunuzun büyüme sürecini gösteren fotoğraflar idealdir. En az 10-15 fotoğraf önerilir." },
    { question: "Film ne kadar sürede hazır olur?", answer: "Standart teslim 24 saattir. Acil teslimat seçeneği ile 3 saat." },
    { question: "Çocuğumun ismini filme ekleyebilir miyiz?", answer: "Evet, sipariş formunda isim ve doğum tarihi gibi bilgileri yazabilirsiniz." },
    { question: "Revizyon hakkı nasıl kullanılır?", answer: "İlk teslimden sonra beğenmediğiniz kısımları belirtirsiniz, biz düzeltiriz." },
    { question: "Sosyal medyada paylaşabilir miyim?", answer: "Evet, teslim edilen filmleri sosyal medyada paylaşabilirsiniz." },
  ],
}

export async function getFaq(page: FaqPage): Promise<FaqItem[]> {
  try {
    const row = await prisma.siteSetting.findUnique({
      where: { key: `${FAQ_KEY_PREFIX}${page}` },
    })
    if (!row?.value) return DEFAULT_FAQ[page] || []
    const parsed = JSON.parse(row.value)
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_FAQ[page] || []
    return parsed.filter((item: any) => item?.question?.trim())
  } catch {
    return DEFAULT_FAQ[page] || []
  }
}

export async function getAllFaq(): Promise<Record<FaqPage, FaqItem[]>> {
  const pages: FaqPage[] = ["genel", "ask", "hatira", "cocuk"]
  const result: Record<string, FaqItem[]> = {}
  for (const page of pages) {
    result[page] = await getFaq(page)
  }
  return result as Record<FaqPage, FaqItem[]>
}

export async function setFaq(page: FaqPage, items: FaqItem[]): Promise<FaqItem[]> {
  const filtered = items.filter((item) => item.question?.trim())
  const key = `${FAQ_KEY_PREFIX}${page}`
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: JSON.stringify(filtered) },
    update: { value: JSON.stringify(filtered) },
  })
  return filtered
}
