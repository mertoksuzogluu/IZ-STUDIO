import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import SectionHeader from "@/components/design-system/SectionHeader"
import AdminExampleVideosForm from "./AdminExampleVideosForm"

export default async function AdminExampleVideosPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          <SectionHeader
            title="Örnek videolar"
            description="Ana sayfadaki “Örnek çalışmalar” bölümünde gösterilecek videoları buradan ekleyebilir veya düzenleyebilirsiniz. Her video için başlık, küçük resim ve isteğe bağlı video URL’leri girin."
          />
          <AdminExampleVideosForm />
        </div>
      </Container>
    </Section>
  )
}
