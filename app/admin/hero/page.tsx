"use client"

import { useState, useEffect, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import SectionHeader from "@/components/design-system/SectionHeader"
import Card from "@/components/design-system/Card"
import Button from "@/components/design-system/Button"

interface HeroFile {
  name: string
  url: string
  type: "image" | "video"
}

export default function AdminHeroPage() {
  const [files, setFiles] = useState<HeroFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/admin/hero")
      const data = await res.json()
      setFiles(data.files || [])
    } catch {
      setFiles([])
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    setMessage("")
    for (const file of acceptedFiles) {
      try {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch("/api/admin/hero", {
          method: "POST",
          body: formData,
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Yükleme başarısız")
        setMessage(`${file.name} yüklendi.`)
      } catch (e: any) {
        setMessage(e.message || "Yükleme hatası")
      }
    }
    setUploading(false)
    fetchFiles()
  }, [])

  const handleDelete = async (filename: string) => {
    if (!confirm(`${filename} silinsin mi?`)) return
    try {
      const res = await fetch("/api/admin/hero", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      })
      if (!res.ok) throw new Error("Silme başarısız")
      setMessage(`${filename} silindi.`)
      fetchFiles()
    } catch (e: any) {
      setMessage(e.message)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
    },
    maxSize: 150 * 1024 * 1024,
    multiple: true,
  })

  const videos = files.filter((f) => f.type === "video")
  const images = files.filter((f) => f.type === "image")

  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16 max-w-3xl mx-auto">
          <SectionHeader
            title="Hero Görsel / Video"
            description="Ana sayfanın üst kısmında gösterilecek video veya görseli yükleyin. Sürükle-bırak ile ekleyebilirsiniz."
          />

          <Card className="p-8 mb-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-[var(--accent)] bg-[var(--card)]"
                  : "border-[var(--border)] hover:border-[var(--accent)]"
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-3">
                <div className="text-4xl">🎬</div>
                <p className="text-lg font-medium text-[var(--fg)]">
                  {isDragActive
                    ? "Bırakın..."
                    : uploading
                    ? "Yükleniyor..."
                    : "Görsel veya video sürükleyin ya da tıklayın"}
                </p>
                <p className="text-sm text-[var(--muted)]">
                  JPG, PNG, WebP, MP4, WebM — Maks. 150 MB
                </p>
              </div>
            </div>

            {message && (
              <p className="mt-4 text-sm text-[var(--accent)] text-center">{message}</p>
            )}
          </Card>

          {files.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-serif text-[var(--fg)] mb-4">
                Mevcut Dosyalar ({files.length})
              </h3>

              {videos.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-[var(--muted)] mb-3">Videolar</h4>
                  <div className="space-y-3">
                    {videos.map((f) => (
                      <div key={f.name} className="flex items-center gap-4 p-3 bg-[var(--card)] border border-[var(--border)] rounded-lg">
                        <video
                          src={f.url}
                          className="w-32 h-20 object-cover rounded"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--fg)] truncate">{f.name}</p>
                          <p className="text-xs text-[var(--muted)]">{f.url}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(f.name)}
                          className="text-red-500 hover:text-red-700 text-sm shrink-0"
                        >
                          Sil
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-[var(--muted)] mb-3">Görseller</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {images.map((f) => (
                      <div key={f.name} className="relative group">
                        <img
                          src={f.url}
                          alt={f.name}
                          className="w-full aspect-video object-cover rounded-lg border border-[var(--border)]"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            onClick={() => handleDelete(f.name)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                          >
                            Sil
                          </button>
                        </div>
                        <p className="text-xs text-[var(--muted)] mt-1 truncate">{f.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {files.length === 0 && (
            <Card className="p-6 text-center">
              <p className="text-[var(--muted)]">
                Henüz hero görseli veya videosu yüklenmemiş. Yukarıdan yükleyebilirsiniz.
              </p>
            </Card>
          )}

          <div className="mt-6">
            <Button variant="outline" href="/admin">
              Admin Panele Dön
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
