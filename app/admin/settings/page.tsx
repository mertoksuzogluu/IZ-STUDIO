import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import SectionHeader from "@/components/design-system/SectionHeader"
import AdminThemeForm from "./AdminThemeForm"
import { getActiveSpecialTheme } from "@/lib/settings"

export default async function AdminSettingsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  const currentTheme = await getActiveSpecialTheme()

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          <SectionHeader
            title="Site Teması"
            description="Özel gün seçildiğinde tüm sitenin tasarımı bu temaya geçer. Seçmezseniz normal görünüm kullanılır."
          />
          <AdminThemeForm initialTheme={currentTheme} />
        </div>
      </Container>
    </Section>
  )
}
