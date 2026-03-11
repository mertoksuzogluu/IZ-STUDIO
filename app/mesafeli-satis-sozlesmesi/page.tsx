import type { Metadata } from "next"
import LegalPageView from "@/components/LegalPageView"
import { getLegalPage } from "@/lib/legalPages"

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi | Feel Studio",
  description: "Feel Studio mesafeli satış sözleşmesi. 6502 sayılı kanun kapsamında.",
}

export default async function MesafeliSatisSozlesmesiPage() {
  const page = await getLegalPage("mesafeli-satis")
  return <LegalPageView title={page.title} sections={page.sections} variant="document" />
}
