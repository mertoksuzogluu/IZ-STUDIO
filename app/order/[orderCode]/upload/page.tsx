"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import Button from "@/components/design-system/Button"
import Card from "@/components/design-system/Card"

interface UploadedFile {
  id: string
  filename: string
  size: number
  type: string
  url: string
}

export default function OrderUploadPage() {
  const params = useParams()
  const router = useRouter()
  const orderCode = (params?.orderCode as string) ?? ""

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true)

      for (const file of acceptedFiles) {
        try {
          // Create FormData for file upload
          const formData = new FormData()
          formData.append("file", file)

          // Upload file directly via POST
          const response = await fetch(`/api/orders/${orderCode}/upload`, {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || "Upload başarısız")
          }

          const { asset } = await response.json()

          // Add to uploaded files
          setUploadedFiles((prev) => [
            ...prev,
            {
              id: asset.id,
              filename: asset.filename,
              size: asset.size,
              type: asset.type,
              url: asset.url,
            },
          ])
        } catch (error: any) {
          console.error("Upload error:", error)
          alert(`${file.name} yüklenemedi: ${error.message || "Lütfen tekrar deneyin."}`)
        }
      }

      setIsUploading(false)
    },
    [orderCode]
  )

  const [isTouchDevice, setIsTouchDevice] = useState(false)
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || (navigator as any).maxTouchPoints > 0)
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/heic": [".heic"],
      "video/mp4": [".mp4"],
      "video/quicktime": [".mov"],
      "video/x-msvideo": [".avi"],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    noDrag: isTouchDevice,
    noClick: false,
    multiple: true,
  })

  const handleContinue = () => {
    router.push(`/checkout/${orderCode}`)
  }

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif text-[var(--fg)] mb-2">
            Fotoğraf ve Videolarınızı Yükleyin
          </h1>
          <p className="text-[var(--muted)] mb-8">
            Sipariş kodunuz: <span className="font-mono">{orderCode}</span>
          </p>

          <Card className="p-8 mb-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-colors min-h-[180px] flex flex-col items-center justify-center ${
                isDragActive
                  ? "border-[var(--accent)] bg-[var(--card)]"
                  : "border-[var(--border)] hover:border-[var(--accent)] active:border-[var(--accent)]"
              }`}
              style={{ minHeight: "min(180px, 40vw)" }}
            >
              <input {...getInputProps()} className="sr-only" aria-label="Fotoğraf veya video dosyası seçin" />
              <div className="space-y-4 w-full">
                <div className="text-4xl">📸</div>
                <div>
                  <p className="text-lg font-medium text-[var(--fg)] mb-2">
                    {isDragActive
                      ? "Dosyaları buraya bırakın"
                      : isTouchDevice
                        ? "Dosya eklemek için dokunun"
                        : "Dosyaları sürükleyin veya tıklayın"}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    JPG, PNG, HEIC, MP4, MOV (Maks. 100MB)
                  </p>
                </div>
                {isTouchDevice && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); open() }}
                    className="mt-2 px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-medium touch-manipulation min-h-[48px]"
                  >
                    Dosya seç
                  </button>
                )}
              </div>
            </div>

            {isUploading && (
              <div className="mt-6">
                <p className="text-sm text-[var(--muted)] mb-2">Yükleniyor...</p>
                <div className="w-full bg-[var(--border)] rounded-full h-2">
                  <div
                    className="bg-[var(--accent)] h-2 rounded-full transition-all"
                    style={{ width: "50%" }}
                  />
                </div>
              </div>
            )}
          </Card>

          {uploadedFiles.length > 0 && (
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-serif text-[var(--fg)] mb-4">
                Yüklenen Dosyalar ({uploadedFiles.length})
              </h3>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-[var(--card)] border border-[var(--border)] rounded"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {file.type === "photo" ? "📷" : "🎥"}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[var(--fg)]">
                          {file.filename}
                        </p>
                        <p className="text-xs text-[var(--muted)]">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/order/${orderCode}/brief`)}
            >
              Geri
            </Button>
            <Button
              variant="primary"
              onClick={handleContinue}
              disabled={uploadedFiles.length === 0}
            >
              Ödeme Sayfasına Geç
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}

