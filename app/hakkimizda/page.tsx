import type { Metadata } from "next"
import LegalPageView from "@/components/LegalPageView"
import { getLegalPage } from "@/lib/legalPages"

export const metadata: Metadata = {
  title: "Hakkımızda | Feel Studio",
  description: "Feel Studio hakkında bilgi. Kişiye özel sinematik kısa film prodüksiyonu.",
}

export default async function HakkimizdaPage() {
  const page = await getLegalPage("hakkimizda")
  return <LegalPageView title={page.title} sections={page.sections} />
}
