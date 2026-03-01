"use client"

import { useState, useEffect, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Container from "@/components/design-system/Container"
import Section from "@/components/design-system/Section"
import SectionHeader from "@/components/design-system/SectionHeader"
import Card from "@/components/design-system/Card"
import Button from "@/components/design-system/Button"

interface MediaFile {
  name: string
  url: string
  type: "image" | "video"
}

const PAGES = [
  { key: "hero", label: "Ana Sayfa (Hero)", icon: "🏠" },
  { key: "ask", label: "Aşk Sayfası", icon: "❤️" },
  { key: "hatira", label: "Hatıra Sayfası", icon: "📷" },
  { key: "cocuk", label: "Çocuk Sayfası", icon: "👶" },
] as const

type PageKey = (typeof PAGES)[number]["key"]

function PageMediaSection({ pageKey, label, icon }: { pageKey: PageKey; label: string; icon: string }) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/page-images?page=${pageKey}`)
      const data = await res.json()
      setFiles(data[pageKey] || [])
    } catch {
      setFiles([])
    }
  }, [pageKey])

  useEffect(() => { fetchFiles() }, [fetchFiles])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    setMessage("")
    for (const file of acceptedFiles) {
      try {
        const formData = new FormData()
        formData.append("page", pageKey)
        formData.append("file", file)
        const res = await fetch("/api/admin/page-images", { method: "POST", body: formData })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || `Yükleme başarısız (HTTP ${res.status})`)
        setMessage(`${file.name} yüklendi: ${data.url}`)
      } catch (e: any) {
        setMessage(e.message || "Yükleme hatası")
      }
    }
    setUploading(false)
    fetchFiles()
  }, [pageKey, fetchFiles])

  const handleDelete = async (filename: string) => {
    if (!confirm(`${filename} silinsin mi?`)) return
    try {
      const res = await fetch("/api/admin/page-images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pageKey, filename }),
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

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xl font-serif text-[var(--fg)]">{label}</h3>
        <span className="ml-auto text-sm text-[var(--muted)]">{files.length} dosya</span>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mb-4 ${
          isDragActive
            ? "border-[var(--accent)] bg-[var(--card)]"
            : "border-[var(--border)] hover:border-[var(--accent)]"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-[var(--fg)]">
          {uploading ? "Yükleniyor..." : isDragActive ? "Bırakın..." : "Sürükle-bırak veya tıklayın"}
        </p>
        <p className="text-xs text-[var(--muted)] mt-1">JPG, PNG, WebP, MP4, WebM</p>
      </div>

      {message && <p className="text-xs text-[var(--accent)] mb-3">{message}</p>}

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {files.map((f) => (
            <div key={f.name} className="relative group">
              {f.type === "video" ? (
                <video
                  src={f.url}
                  className="w-full aspect-video object-cover rounded-lg border border-[var(--border)]"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={f.url}
                  alt={f.name}
                  className="w-full aspect-video object-cover rounded-lg border border-[var(--border)]"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  onClick={() => handleDelete(f.name)}
                  className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium"
                >
                  Sil
                </button>
              </div>
              <p className="text-xs text-[var(--muted)] mt-1 truncate">{f.name}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default function AdminPageImagesPage() {
  return (
    <Section>
      <Container>
        <div className="pt-32 pb-16 max-w-4xl mx-auto">
          <SectionHeader
            title="Sayfa Görselleri"
            description="Her sayfanın hero bölümünde gösterilecek görsel veya videoyu ayrı ayrı yükleyin."
          />

          <div className="space-y-8">
            {PAGES.map((p) => (
              <PageMediaSection key={p.key} pageKey={p.key} label={p.label} icon={p.icon} />
            ))}
          </div>

          <div className="mt-8">
            <Button variant="outline" href="/admin">
              Admin Panele Dön
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
