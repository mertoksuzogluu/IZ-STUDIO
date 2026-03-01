import type { Metadata } from 'next'
import ThemeShell from '@/components/ThemeShell'
import Container from '@/components/design-system/Container'
import Section from '@/components/design-system/Section'
import Card from '@/components/design-system/Card'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | Feel Studio',
  description: 'Feel Studio gizlilik politikası ve KVKK bilgilendirmesi.',
}

const sections = [
  {
    title: 'Kişisel Verilerin Korunması',
    content: 'Feel Studio olarak, kişisel verilerinizin korunmasına büyük önem veriyoruz. 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, topladığımız kişisel verileriniz yalnızca hizmetlerimizi sunmak amacıyla kullanılmaktadır.',
  },
  {
    title: 'Toplanan Veriler',
    content: 'Hizmetlerimiz kapsamında aşağıdaki veriler toplanabilir:',
    list: [
      'İsim ve iletişim bilgileri (WhatsApp üzerinden)',
      'Gönderilen fotoğraflar ve içerikler',
      'Hikâye metinleri ve özel notlar',
      'İletişim geçmişi',
    ],
  },
  {
    title: 'Verilerin Kullanım Amacı',
    content: 'Toplanan kişisel verileriniz, sinematik kısa filmlerinizin hazırlanması, sipariş takibi, müşteri hizmetleri ve yasal yükümlülüklerimizin yerine getirilmesi amacıyla kullanılmaktadır.',
  },
  {
    title: 'Verilerin Saklanması ve Güvenliği',
    content: 'Kişisel verileriniz, hizmetin tamamlanmasından sonra yasal saklama süreleri boyunca güvenli bir şekilde saklanır. Verilerinizin güvenliği için gerekli teknik ve idari önlemler alınmaktadır.',
  },
  {
    title: 'Verilerin Paylaşılması',
    content: 'Kişisel verileriniz, yasal yükümlülükler dışında üçüncü kişilerle paylaşılmamaktadır. Gönderdiğiniz fotoğraflar ve içerikler yalnızca siparişinizin hazırlanması amacıyla kullanılmaktadır.',
  },
  {
    title: 'Haklarınız',
    content: 'KVKK kapsamında aşağıdaki haklara sahipsiniz:',
    list: [
      'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
      'İşlenmişse bilgi talep etme',
      'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
      'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme',
      'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
      'KVKK\'nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme',
    ],
  },
  {
    title: 'İletişim',
    content: 'Gizlilik politikamız hakkında sorularınız veya haklarınızı kullanmak istediğinizde, WhatsApp üzerinden bizimle iletişime geçebilirsiniz.',
  },
]

export default function GizlilikPage() {
  return (
    <ThemeShell themeKey="default">
      <Section>
        <Container>
          <div className="pt-20 pb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-[var(--fg)] mb-8 tracking-tight leading-[1.05]">
              Gizlilik Politikası
            </h1>
            
            <div className="space-y-8 max-w-4xl">
              {sections.map((section, index) => (
                <Card key={index}>
                  <h2 className="text-xl md:text-2xl font-serif text-[var(--fg)] mb-4 tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed mb-4">
                    {section.content}
                  </p>
                  {section.list && (
                    <ul className="list-disc list-inside space-y-2 ml-4 text-sm md:text-base text-[var(--muted)] leading-relaxed">
                      {section.list.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}
                </Card>
              ))}
              
              <div className="pt-8 border-t border-[var(--border)]">
                <p className="text-sm text-[var(--muted)]/80">
                  Son güncelleme: {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </ThemeShell>
  )
}
