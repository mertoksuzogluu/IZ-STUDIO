"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import Button from "@/components/design-system/Button"
import Card from "@/components/design-system/Card"

export default function OrderBriefPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const orderCode = (params?.orderCode as string) ?? ""

  const [physicalPackage, setPhysicalPackage] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    names: "",
    occasion: "",
    tone: "",
    notes: "",
    urgency: "",
    shippingFullName: "",
    shippingAddressLine1: "",
    shippingAddressLine2: "",
    shippingCity: "",
    shippingDistrict: "",
    shippingPostalCode: "",
    shippingPhone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-()]/g, "")
    return /^(05\d{9}|\+905\d{9})$/.test(cleaned)
  }

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!session?.user?.email && !validateEmail(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin (örn: isim@domain.com)"
    }

    if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Geçerli bir telefon numarası girin (05XX XXX XX XX)"
    }

    if (!formData.names.trim()) {
      newErrors.names = "İsim alanı zorunludur"
    }

    if (physicalPackage) {
      if (formData.shippingPhone && !validatePhone(formData.shippingPhone)) {
        newErrors.shippingPhone = "Geçerli bir telefon numarası girin (05XX XXX XX XX)"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    fetch(`/api/orders/${orderCode}/brief`)
      .then((r) => r.json())
      .then((data) => setPhysicalPackage(!!data.physicalPackage))
      .catch(() => {})
  }, [orderCode])

  // Kayıtlı kullanıcı giriş yaptıysa e-postayı otomatik doldur
  useEffect(() => {
    if (session?.user?.email && !formData.email) {
      setFormData((prev) => ({ ...prev, email: session.user.email ?? "" }))
    }
  }, [session?.user?.email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    const payload = { ...formData }
    if (session?.user?.email) payload.email = session.user.email

    try {
      const response = await fetch(`/api/orders/${orderCode}/brief`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Brief kaydedilemedi")

      router.push(`/order/${orderCode}/upload`)
    } catch (error) {
      console.error("Brief save error:", error)
      alert("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl font-serif text-[var(--fg)] mb-2">
            Hikâyenizi Anlatın
          </h1>
          <p className="text-[var(--muted)] mb-8">
            Sipariş kodunuz: <span className="font-mono">{orderCode}</span>
          </p>

          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                  E-posta Adresi *
                </label>
                {session?.user?.email ? (
                  <>
                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      className="w-full px-4 py-3 border border-[var(--border)] rounded-lg bg-[var(--border)]/30 text-[var(--fg)] cursor-not-allowed"
                      placeholder="ornek@email.com"
                    />
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      Giriş yaptığınız hesabın e-posta adresi kullanılıyor.
                    </p>
                  </>
                ) : (
                  <>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        if (errors.email) setErrors((prev) => { const n = { ...prev }; delete n.email; return n })
                      }}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)] ${
                        errors.email ? "border-red-400" : "border-[var(--border)]"
                      }`}
                      placeholder="ornek@email.com"
                    />
                    {errors.email ? (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    ) : (
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Sipariş durumu hakkında bilgilendirme için
                      </p>
                    )}
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                  Telefon Numarası *
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, phoneNumber: e.target.value })
                    if (errors.phoneNumber) setErrors((prev) => { const n = { ...prev }; delete n.phoneNumber; return n })
                  }}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)] ${
                    errors.phoneNumber ? "border-red-400" : "border-[var(--border)]"
                  }`}
                  placeholder="05XX XXX XX XX"
                />
                {errors.phoneNumber ? (
                  <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
                ) : (
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Siparişiniz hakkında size ulaşabilmemiz için
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                  İsimler *
                </label>
                <input
                  type="text"
                  value={formData.names}
                  onChange={(e) => {
                    setFormData({ ...formData, names: e.target.value })
                    if (errors.names) setErrors((prev) => { const n = { ...prev }; delete n.names; return n })
                  }}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)] ${
                    errors.names ? "border-red-400" : "border-[var(--border)]"
                  }`}
                  placeholder="Örn: Ayşe ve Mehmet"
                />
                {errors.names && <p className="mt-1 text-xs text-red-500">{errors.names}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                  Özel Gün / Anı
                </label>
                <input
                  type="text"
                  value={formData.occasion}
                  onChange={(e) =>
                    setFormData({ ...formData, occasion: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                  placeholder="Örn: Düğün, Yıldönümü, Doğum Günü"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                  Ton / Hissiyat
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) =>
                    setFormData({ ...formData, tone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                >
                  <option value="">Seçiniz</option>
                  <option value="romantic">Romantik</option>
                  <option value="nostalgic">Nostaljik</option>
                  <option value="joyful">Neşeli</option>
                  <option value="emotional">Duygusal</option>
                  <option value="elegant">Zarif</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                  Notlar / Özel İstekler
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                  placeholder="Hikâyeniz hakkında eklemek istediğiniz detaylar..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                  Aciliyet
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) =>
                    setFormData({ ...formData, urgency: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                >
                  <option value="">Standart (24 saat)</option>
                  <option value="urgent">Acil teslimat (3 saat — siparişte seçildi)</option>
                </select>
              </div>

              {physicalPackage && (
                <>
                  <div className="border-t border-[var(--border)] pt-6 mt-6">
                    <h3 className="text-lg font-serif text-[var(--fg)] mb-4">
                      Teslimat adresi
                    </h3>
                    <p className="text-sm text-[var(--muted)] mb-4">
                      QR kod baskılı fotoğrafınız bu adrese kargolanacaktır.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--fg)] mb-2">Ad Soyad *</label>
                        <input
                          type="text"
                          value={formData.shippingFullName}
                          onChange={(e) =>
                            setFormData({ ...formData, shippingFullName: e.target.value })
                          }
                          required
                          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                          placeholder="Alıcı adı soyadı"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--fg)] mb-2">Adres (sokak, bina, daire) *</label>
                        <input
                          type="text"
                          value={formData.shippingAddressLine1}
                          onChange={(e) =>
                            setFormData({ ...formData, shippingAddressLine1: e.target.value })
                          }
                          required
                          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                          placeholder="Mahalle, sokak, bina no, daire no"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--fg)] mb-2">Adres 2 (opsiyonel)</label>
                        <input
                          type="text"
                          value={formData.shippingAddressLine2}
                          onChange={(e) =>
                            setFormData({ ...formData, shippingAddressLine2: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                          placeholder="Blok, kat vb."
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--fg)] mb-2">İlçe *</label>
                          <input
                            type="text"
                            value={formData.shippingDistrict}
                            onChange={(e) =>
                              setFormData({ ...formData, shippingDistrict: e.target.value })
                            }
                            required
                            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                            placeholder="İlçe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--fg)] mb-2">İl *</label>
                          <input
                            type="text"
                            value={formData.shippingCity}
                            onChange={(e) =>
                              setFormData({ ...formData, shippingCity: e.target.value })
                            }
                            required
                            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                            placeholder="İl"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--fg)] mb-2">Posta kodu</label>
                          <input
                            type="text"
                            value={formData.shippingPostalCode}
                            onChange={(e) =>
                              setFormData({ ...formData, shippingPostalCode: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)]"
                            placeholder="Posta kodu"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--fg)] mb-2">Alıcı Telefon Numarası *</label>
                          <input
                            type="tel"
                            value={formData.shippingPhone}
                            onChange={(e) => {
                              setFormData({ ...formData, shippingPhone: e.target.value })
                              if (errors.shippingPhone) setErrors((prev) => { const n = { ...prev }; delete n.shippingPhone; return n })
                            }}
                            required
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)] ${
                              errors.shippingPhone ? "border-red-400" : "border-[var(--border)]"
                            }`}
                            placeholder="05XX XXX XX XX"
                          />
                          {errors.shippingPhone && <p className="mt-1 text-xs text-red-500">{errors.shippingPhone}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Geri
                </Button>
                <Button type="submit" variant="primary" disabled={isLoading}>
                  {isLoading ? "Kaydediliyor..." : "Devam Et"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Container>
    </Section>
  )
}

