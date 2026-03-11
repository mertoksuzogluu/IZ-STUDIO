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
  variant?: "cards" | "document"
}

function DocumentView({ title, sections }: { title: string; sections: LegalSection[] }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white border border-[var(--border)] rounded-2xl shadow-sm px-8 py-10 md:px-14 md:py-14">
        <h1 className="text-2xl md:text-3xl font-serif text-[var(--fg)] mb-2 tracking-tight text-center">
          {title}
        </h1>
        <p className="text-xs text-[var(--muted)] text-center mb-10 pb-6 border-b border-[var(--border)]">
          Son güncelleme: {new Date().getFullYear()}
        </p>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-base md:text-lg font-semibold text-[var(--fg)] mb-2">
                {section.title}
              </h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
              {section.list && section.list.length > 0 && (
                <ul className="list-disc ml-6 mt-2 space-y-1 text-sm text-[var(--muted)] leading-relaxed">
                  {section.list.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CardsView({ title, sections }: { title: string; sections: LegalSection[] }) {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-serif text-[var(--fg)] mb-8 tracking-tight leading-[1.05]">
        {title}
      </h1>
      <div className="space-y-8">
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
  )
}

export default function LegalPageView({ title, sections, variant = "cards" }: LegalPageViewProps) {
  return (
    <ThemeShell themeKey="default">
      <Section>
        <Container>
          <div className="pt-20 pb-12">
            {variant === "document" ? (
              <DocumentView title={title} sections={sections} />
            ) : (
              <CardsView title={title} sections={sections} />
            )}
          </div>
        </Container>
      </Section>
    </ThemeShell>
  )
}
