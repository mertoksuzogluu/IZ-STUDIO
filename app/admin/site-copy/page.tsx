import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import SectionHeader from "@/components/design-system/SectionHeader"
import AdminSiteCopyForm from "./AdminSiteCopyForm"

export default async function AdminSiteCopyPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          <SectionHeader
            title="Site metinleri"
            description="Ana sayfa, footer ve paket sayfalarındaki başlık ve açıklama metinlerini buradan düzenleyebilirsiniz. Değişiklikler sitede anında yansır."
          />
          <AdminSiteCopyForm />
        </div>
      </Container>
    </Section>
  )
}
