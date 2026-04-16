import { prisma } from "@/lib/prisma"

export interface LegalSection {
  title: string
  content: string
  list?: string[]
}

export interface LegalPage {
  title: string
  sections: LegalSection[]
}

export type LegalPageKey = "hakkimizda" | "teslimat-iade" | "mesafeli-satis" | "gizlilik"

const LEGAL_KEY_PREFIX = "legal_"

const DEFAULT_PAGES: Record<LegalPageKey, LegalPage> = {
  hakkimizda: {
    title: "Hakkımızda",
    sections: [
      {
        title: "Feel Studio Nedir?",
        content:
          "Feel Studio, kişiye özel sinematik kısa film üreten bir dijital prodüksiyon stüdyosudur. Sizin fotoğraflarınız ve hikâyenizden yola çıkarak, profesyonel stüdyo kalitesinde duygusal kısa filmler hazırlıyoruz.",
      },
      {
        title: "Misyonumuz",
        content:
          "Her insanın anlatılmaya değer bir hikâyesi olduğuna inanıyoruz. Aşk hikâyeleri, çocukluk anıları, aile hatıraları… Tüm bu özel anları sinematik bir dille ölümsüzleştiriyoruz. Amacımız, fotoğraflarınızın ötesine geçerek duygularınızı görselleştirmek.",
      },
      {
        title: "Nasıl Çalışıyoruz?",
        content: "Sipariş sürecimiz son derece basit ve hızlıdır:",
        list: [
          "Paketinizi seçin ve sipariş oluşturun",
          "Fotoğraflarınızı ve hikâyenizi formdan paylaşın",
          "Profesyonel ekibimiz sinematik filminizi hazırlar",
          "24 saat içinde (acil teslimat ile 3 saat) filminiz teslim edilir",
        ],
      },
      {
        title: "Neden Feel Studio?",
        content: "Feel Studio'yu tercih etmeniz için pek çok neden var:",
        list: [
          "Profesyonel stüdyo kalitesinde prodüksiyon",
          "Hızlı teslimat: standart 24 saat, acil 3 saat",
          "Kişiye özel hikâye anlatımı",
          "Revizyon hakkı ile memnuniyet garantisi",
          "256-bit SSL şifreleme ile güvenli ödeme",
          "KVKK uyumlu veri işleme",
        ],
      },
      {
        title: "İletişim",
        content:
          "Sorularınız veya özel talepleriniz için WhatsApp üzerinden bizimle her zaman iletişime geçebilirsiniz. Size en kısa sürede dönüş yapacağız.",
      },
    ],
  },
  "teslimat-iade": {
    title: "Teslimat ve İade Koşulları",
    sections: [
      {
        title: "Teslimat Bilgileri",
        content:
          "Feel Studio olarak tüm siparişlerimiz dijital ortamda teslim edilmektedir. Hazırlanan sinematik kısa filmleriniz, kullanıcı paneliniz üzerinden indirilebilir formatta sunulur.",
      },
      {
        title: "Teslimat Süreleri",
        content: "Siparişleriniz aşağıdaki sürelerde teslim edilir:",
        list: [
          "Standart Teslimat: Sipariş onayından itibaren 24 saat içinde",
          "Acil Teslimat: Sipariş onayından itibaren 3 saat içinde (ek ücretlidir)",
          "Teslimat süresi, ödeme onayının alınmasından itibaren başlar",
        ],
      },
      {
        title: "Teslimat Formatları",
        content: "Filminiz seçtiğiniz pakete göre aşağıdaki formatlarda teslim edilir:",
        list: [
          "30 saniye paket: yalnızca 9:16 dikey format (Instagram Story, Reels, TikTok uyumlu)",
          "60 saniye paket: 16:9 yatay format (YouTube, TV uyumlu)",
          "100 saniye paket: hem 16:9 hem 9:16 format",
          "MP4 formatında yüksek kaliteli video dosyası",
          "4K UHD seçeneği ile ultra yüksek çözünürlük (ek ücretli)",
        ],
      },
      {
        title: "Fiziksel Paket Teslimatı",
        content:
          "Fiziksel paket seçeneği bulunan siparişlerde, QR kodlu özel kutu kargo ile adresinize gönderilir. Kargo süreci 2-5 iş günü sürebilir. Kargo takip numarası kullanıcı panelinizden takip edilebilir.",
      },
      {
        title: "Revizyon Hakkı",
        content:
          "Teslim edilen filmden memnun kalmamanız durumunda, paketinize dahil olan revizyon hakkınızı kullanabilirsiniz. Revizyon talebinizi kullanıcı panelinizden iletebilirsiniz. Revizyon, talebinizin iletilmesinden itibaren 24 saat içinde tamamlanır.",
      },
      {
        title: "İade Koşulları",
        content:
          "Dijital ürün niteliğinde olan sinematik kısa filmler, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği gereğince, dijital içeriğin teslim edilmesiyle cayma hakkı sona erer. Ancak aşağıdaki durumlarda iade veya yeniden üretim talep edebilirsiniz:",
        list: [
          "Siparişte belirtilen içeriğin hiç teslim edilmemesi",
          "Teslim edilen içeriğin sipariş edilen üründen tamamen farklı olması",
          "Teknik olarak kullanılamaz durumda olması (bozuk dosya vb.)",
        ],
      },
      {
        title: "İade Süreci",
        content:
          "İade talebinizi teslim tarihinden itibaren 14 gün içinde WhatsApp destek hattımız üzerinden iletebilirsiniz. Talepleriniz en geç 3 iş günü içinde değerlendirilir. Onaylanan iadeler, ödemenin yapıldığı yönteme 14 iş günü içinde geri ödenir.",
      },
    ],
  },
  "mesafeli-satis": {
    title: "Mesafeli Satış Sözleşmesi",
    sections: [
      {
        title: "1. Taraflar",
        content:
          "İşbu Mesafeli Satış Sözleşmesi, bir tarafta Feel Studio (bundan sonra \"SATICI\" olarak anılacaktır) ile diğer tarafta hizmeti satın alan (bundan sonra \"ALICI\" olarak anılacaktır) arasında, aşağıdaki koşullar dahilinde akdedilmiştir.",
      },
      {
        title: "2. Konu",
        content:
          "İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait feelcreativestudio.com internet sitesinden elektronik ortamda siparişini verdiği, sözleşmede belirtilen niteliklere sahip dijital ürün/hizmetin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.",
      },
      {
        title: "3. Satıcı Bilgileri",
        content: "Ünvan: Feel Studio\nWeb Sitesi: feelcreativestudio.com\nİletişim: WhatsApp destek hattı üzerinden ulaşılabilir.",
      },
      {
        title: "4. Ürün/Hizmet Bilgileri",
        content:
          "Sözleşmeye konu ürün/hizmet, kişiye özel sinematik kısa film prodüksiyonudur. Ürünün temel özellikleri (türü, miktarı, fiyatı) sipariş sayfasında ve sipariş onay e-postasında belirtilmektedir. Ürün fiyatlarına KDV dahildir.",
      },
      {
        title: "5. Sipariş ve Ödeme",
        content: "ALICI, sipariş sürecinde aşağıdaki adımları takip eder:",
        list: [
          "İstediği ürün/paketi seçer ve sipariş formunu doldurur",
          "Fotoğraf ve hikâyesini yükler",
          "Ödeme sayfasında güvenli ödeme işlemini tamamlar",
          "Ödeme, iyzico güvenli ödeme altyapısı üzerinden 256-bit SSL şifreleme ile gerçekleştirilir",
          "Kredi kartı, banka kartı ve taksit seçenekleri mevcuttur",
        ],
      },
      {
        title: "6. Teslimat",
        content:
          "Dijital ürünler, ödemenin onaylanmasını takiben belirtilen süre içinde (standart 24 saat, acil teslimat 3 saat) ALICI'nın kullanıcı paneli üzerinden dijital ortamda teslim edilir. Fiziksel paket seçeneğinde kargo ile gönderilir.",
      },
      {
        title: "7. Cayma Hakkı",
        content:
          "6502 sayılı Kanun'un 53/ı maddesi ve Mesafeli Sözleşmeler Yönetmeliği'nin 15/ğ maddesi gereğince, dijital içeriğin ifasına başlanmasıyla birlikte cayma hakkı kullanılamaz. ALICI, sipariş onayı sırasında dijital içeriğin teslim edileceğini ve cayma hakkından feragat ettiğini kabul eder. Henüz prodüksiyona başlanmamış siparişlerde, ALICI sipariş tarihinden itibaren 14 gün içinde cayma hakkını kullanabilir.",
      },
      {
        title: "8. Garanti ve Revizyon",
        content:
          "SATICI, teslim edilen filmin sipariş formunda belirtilen özelliklere uygun olacağını taahhüt eder. ALICI, paketine dahil olan revizyon hakkını kullanarak değişiklik talep edebilir. Revizyon talepleri teslim tarihinden itibaren 7 gün içinde yapılmalıdır.",
      },
      {
        title: "9. Kişisel Verilerin Korunması",
        content:
          "SATICI, ALICI tarafından paylaşılan kişisel verileri ve fotoğrafları 6698 sayılı KVKK kapsamında korur. Bu veriler yalnızca sipariş edilen hizmetin ifası amacıyla kullanılır ve üçüncü şahıslarla paylaşılmaz.",
      },
      {
        title: "10. Uyuşmazlık Çözümü",
        content:
          "İşbu sözleşmeden doğabilecek uyuşmazlıklarda Türkiye Cumhuriyeti kanunları uygulanır. Tüketici sorunları ile ilgili başvurular, Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri'ne yapılabilir.",
      },
      {
        title: "11. Yürürlük",
        content:
          "ALICI, sipariş onayı ile birlikte işbu sözleşmenin tüm koşullarını kabul etmiş sayılır. Sözleşme, sipariş tarihinde yürürlüğe girer.",
      },
    ],
  },
  gizlilik: {
    title: "Gizlilik Politikası",
    sections: [
      {
        title: "Kişisel Verilerin Korunması",
        content:
          "Feel Studio olarak, kişisel verilerinizin korunmasına büyük önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, topladığımız kişisel verileriniz yalnızca hizmetlerimizi sunmak amacıyla kullanılmaktadır.",
      },
      {
        title: "Toplanan Veriler",
        content: "Hizmetlerimiz kapsamında aşağıdaki veriler toplanabilir:",
        list: [
          "İsim ve iletişim bilgileri (WhatsApp üzerinden)",
          "Gönderilen fotoğraflar ve içerikler",
          "Hikâye metinleri ve özel notlar",
          "İletişim geçmişi",
        ],
      },
      {
        title: "Verilerin Kullanım Amacı",
        content:
          "Toplanan kişisel verileriniz, sinematik kısa filmlerinizin hazırlanması, sipariş takibi, müşteri hizmetleri ve yasal yükümlülüklerimizin yerine getirilmesi amacıyla kullanılmaktadır.",
      },
      {
        title: "Verilerin Saklanması ve Güvenliği",
        content:
          "Kişisel verileriniz, hizmetin tamamlanmasından sonra yasal saklama süreleri boyunca güvenli bir şekilde saklanır. Verilerinizin güvenliği için gerekli teknik ve idari önlemler alınmaktadır.",
      },
      {
        title: "Verilerin Paylaşılması",
        content:
          "Kişisel verileriniz, yasal yükümlülükler dışında üçüncü kişilerle paylaşılmamaktadır. Gönderdiğiniz fotoğraflar ve içerikler yalnızca siparişinizin hazırlanması amacıyla kullanılmaktadır.",
      },
      {
        title: "Haklarınız",
        content: "KVKK kapsamında aşağıdaki haklara sahipsiniz:",
        list: [
          "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
          "İşlenmişse bilgi talep etme",
          "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
          "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
          "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
          "KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme",
        ],
      },
      {
        title: "İletişim",
        content:
          "Gizlilik politikamız hakkında sorularınız veya haklarınızı kullanmak istediğinizde, WhatsApp üzerinden bizimle iletişime geçebilirsiniz.",
      },
    ],
  },
}

export async function getLegalPage(key: LegalPageKey): Promise<LegalPage> {
  try {
    const row = await prisma.siteSetting.findUnique({
      where: { key: `${LEGAL_KEY_PREFIX}${key}` },
    })
    if (!row?.value) return DEFAULT_PAGES[key]
    const parsed = JSON.parse(row.value)
    if (!parsed?.title || !Array.isArray(parsed?.sections)) return DEFAULT_PAGES[key]
    return parsed
  } catch {
    return DEFAULT_PAGES[key]
  }
}

export async function getAllLegalPages(): Promise<Record<LegalPageKey, LegalPage>> {
  const keys: LegalPageKey[] = ["hakkimizda", "teslimat-iade", "mesafeli-satis", "gizlilik"]
  const result: Record<string, LegalPage> = {}
  for (const key of keys) {
    result[key] = await getLegalPage(key)
  }
  return result as Record<LegalPageKey, LegalPage>
}

export async function setLegalPage(key: LegalPageKey, page: LegalPage): Promise<LegalPage> {
  const filtered: LegalPage = {
    title: page.title?.trim() || DEFAULT_PAGES[key].title,
    sections: page.sections
      .filter((s) => s.title?.trim() || s.content?.trim())
      .map((s) => ({
        title: s.title?.trim() || "",
        content: s.content?.trim() || "",
        ...(s.list?.length ? { list: s.list.filter((l) => l?.trim()) } : {}),
      })),
  }
  const dbKey = `${LEGAL_KEY_PREFIX}${key}`
  await prisma.siteSetting.upsert({
    where: { key: dbKey },
    create: { key: dbKey, value: JSON.stringify(filtered) },
    update: { value: JSON.stringify(filtered) },
  })
  return filtered
}

export function getDefaultLegalPages() {
  return DEFAULT_PAGES
}
