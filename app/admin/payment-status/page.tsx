import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import Card from "@/components/design-system/Card"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getPaymentStatus() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://feelcreativestudio.com"
  const res = await fetch(`${base}/api/admin/payment-status`, {
    cache: "no-store",
    headers: { cookie: "" }, // Server-side: auth() ile aynı istekte session var
  })
  if (!res.ok) return null
  return res.json()
}

export default async function AdminPaymentStatusPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/signin")
  }

  // API aynı sunucuda; doğrudan env okuyalım (API'yi fetch etmek cookie gerektirir)
  const providerRaw = process.env.PAYMENT_PROVIDER ?? ""
  const provider = providerRaw.trim().toLowerCase()
  const hasApiKey = !!(
    (process.env.IYZIPAY_API_KEY ?? process.env.IYZICO_API_KEY ?? "").trim()
  )
  const hasSecretKey = !!(
    (process.env.IYZIPAY_SECRET_KEY ?? process.env.IYZICO_SECRET_KEY ?? "").trim()
  )
  const sandboxRaw = process.env.IYZICO_SANDBOX ?? ""
  const isSandbox = sandboxRaw.trim().toLowerCase() === "true"

  const activeMode = provider === "iyzico" && hasApiKey && hasSecretKey ? "iyzico" : "mock"
  const reasons: string[] = []
  if (provider !== "iyzico") reasons.push(`PAYMENT_PROVIDER="${providerRaw || "(boş)"}" — "iyzico" olmalı`)
  if (!hasApiKey) reasons.push("IYZICO_API_KEY tanımlı değil veya boş")
  if (!hasSecretKey) reasons.push("IYZICO_SECRET_KEY tanımlı değil veya boş")
  if (activeMode === "iyzico") reasons.push(isSandbox ? "Sandbox (test) modunda" : "Canlı modda")

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16">
          <div className="mb-6">
            <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">
              ← Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-serif text-[var(--fg)] mb-2">Ödeme Durumu</h1>
          <p className="text-[var(--muted)] mb-8">Şu an hangi ödeme modunun kullanıldığı ve neden mock çıkıyorsa sebepleri.</p>

          <Card className="p-6 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  activeMode === "iyzico" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {activeMode === "iyzico" ? "iyzico (canlı/sandbox)" : "Mock (test sayfası)"}
              </span>
            </div>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-[var(--muted)]">PAYMENT_PROVIDER</dt>
                <dd className="font-mono text-[var(--fg)]">{providerRaw || "(boş)"}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">IYZICO_SANDBOX</dt>
                <dd className="font-mono text-[var(--fg)]">{sandboxRaw || "(boş)"} {isSandbox && "(sandbox açık)"}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">IYZICO_API_KEY</dt>
                <dd className="font-mono text-[var(--fg)]">{hasApiKey ? "Tanımlı" : "Yok / boş"}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">IYZICO_SECRET_KEY</dt>
                <dd className="font-mono text-[var(--fg)]">{hasSecretKey ? "Tanımlı" : "Yok / boş"}</dd>
              </div>
            </dl>

            {reasons.length > 0 && (
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <h3 className="text-sm font-medium text-[var(--fg)] mb-2">Durum</h3>
                <ul className="list-disc list-inside text-sm text-[var(--muted)] space-y-1">
                  {reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeMode === "mock" && (
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm text-amber-800 dark:text-amber-200">
                <strong>Mock sayfası kapanması için:</strong> Sunucudaki{" "}
                <code className="bg-black/10 px-1 rounded">.env.local</code> dosyasında{" "}
                <code className="bg-black/10 px-1 rounded">PAYMENT_PROVIDER=iyzico</code>,{" "}
                <code className="bg-black/10 px-1 rounded">IYZICO_API_KEY</code> /{" "}
                <code className="bg-black/10 px-1 rounded">IYZICO_SECRET_KEY</code> (veya resmi{" "}
                <code className="bg-black/10 px-1 rounded">IYZIPAY_*</code>) — iyzico panelden{" "}
                <strong>canlı</strong> anahtarlar tanımlı olmalı. Sonra{" "}
                <code className="bg-black/10 px-1 rounded">pm2 restart feelstudio</code>.{" "}
                <a
                  href="https://github.com/iyzico/iyzipay-node"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  iyzipay-node
                </a>
              </div>
            )}
          </Card>
        </div>
      </Container>
    </Section>
  )
}
