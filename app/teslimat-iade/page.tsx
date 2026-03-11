import type { Metadata } from "next"
import LegalPageView from "@/components/LegalPageView"
import { getLegalPage } from "@/lib/legalPages"

export const metadata: Metadata = {
  title: "Teslimat ve İade Koşulları | Feel Studio",
  description: "Feel Studio teslimat süreleri, iade koşulları ve revizyon hakları.",
}

export default async function TeslimatIadePage() {
  const page = await getLegalPage("teslimat-iade")
  return <LegalPageView title={page.title} sections={page.sections} />
}
