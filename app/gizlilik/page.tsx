import type { Metadata } from "next"
import LegalPageView from "@/components/LegalPageView"
import { getLegalPage } from "@/lib/legalPages"

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Feel Studio",
  description: "Feel Studio gizlilik politikası ve KVKK bilgilendirmesi.",
}

export default async function GizlilikPage() {
  const page = await getLegalPage("gizlilik")
  return <LegalPageView title={page.title} sections={page.sections} variant="document" />
}
