import ThemeShell from "@/components/ThemeShell"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import Card from "@/components/design-system/Card"

interface LegalSection {
  title: string
  content: string
  list?: string[]
}

interface LegalPageViewProps {
  title: string
  sections: LegalSection[]
}

export default function LegalPageView({ title, sections }: LegalPageViewProps) {
  return (
    <ThemeShell themeKey="default">
      <Section>
        <Container>
          <div className="pt-20 pb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-[var(--fg)] mb-8 tracking-tight leading-[1.05]">
              {title}
            </h1>

            <div className="space-y-8 max-w-4xl">
              {sections.map((section, index) => (
                <Card key={index}>
                  <h2 className="text-xl md:text-2xl font-serif text-[var(--fg)] mb-4 tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed whitespace-pre-line mb-4">
                    {section.content}
                  </p>
                  {section.list && section.list.length > 0 && (
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
