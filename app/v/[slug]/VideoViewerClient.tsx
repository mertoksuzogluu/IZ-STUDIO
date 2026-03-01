"use client"

import { useState } from "react"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"

interface VideoViewerClientProps {
  qrLink: {
    pinCode: string | null
    order: {
      deliveryAssets: Array<{ url: string; filename: string }>
    }
  }
}

export default function VideoViewerClient({ qrLink }: VideoViewerClientProps) {
  const [pin, setPin] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(!qrLink.pinCode)
  const [error, setError] = useState("")

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === qrLink.pinCode) {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Hatalı PIN kodu")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-serif text-[var(--fg)] mb-2">
                Feel Studio
              </h1>
              <p className="text-[var(--muted)]">
                Videoya erişmek için PIN kodunu girin
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                  PIN Kodu
                </label>
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--fg)] text-center text-2xl tracking-widest"
                  placeholder="0000"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent2)]"
              >
                Devam Et
              </button>
            </form>
          </div>
        </Container>
      </div>
    )
  }

  const videoAsset = qrLink.order.deliveryAssets[0]

  return (
    <div className="min-h-screen bg-[var(--bg)] py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
              <h1 className="text-4xl font-serif text-[var(--fg)] mb-2">
                Feel Studio
              </h1>
            <p className="text-[var(--muted)]">Sinematik Kısa Film</p>
          </div>

          {videoAsset ? (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                controls
                className="w-full h-full"
                src={videoAsset.url}
                poster="/placeholder-video.jpg"
              >
                Tarayıcınız video oynatmayı desteklemiyor.
              </video>
            </div>
          ) : (
            <div className="aspect-video bg-[var(--card)] border border-[var(--border)] rounded-lg flex items-center justify-center">
              <p className="text-[var(--muted)]">
                Video henüz hazır değil.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

