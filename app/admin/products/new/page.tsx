import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import AdminNewProductForm from "./AdminNewProductForm"

export default async function AdminNewProductPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          <div className="mb-6">
            <Link
              href="/admin/products"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              ← Paketlere dön
            </Link>
          </div>
          <AdminNewProductForm />
        </div>
      </Container>
    </Section>
  )
}
