"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import Card from "@/components/design-system/Card"
import Button from "@/components/design-system/Button"
import type { ExampleVideoItem } from "@/lib/exampleVideos"

function newId(): string {
  return `v-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

type UploadType = "thumbnail" | "video"

function DropZone({
  accept,
  label,
  value,
  onUpload,
  disabled,
}: {
  accept: Record<string, string[]>
  label: string
  value: string
  onUpload: (url: string) => void
  disabled?: boolean
}) {
  const [uploading, setUploading] = useState(false)
  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0]
      if (!file) return
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch("/api/admin/example-videos/upload", {
          method: "POST",
          body: formData,
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || "Yükleme başarısız")
        }
        const { url } = await res.json()
        onUpload(url)
      } catch (e) {
        alert(e instanceof Error ? e.message : "Yükleme başarısız")
      } finally {
        setUploading(false)
      }
    },
    [onUpload]
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled: disabled || uploading,
  })
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--fg)] mb-1">
        {label}
      </label>
      <div
        {...getRootProps()}
        className={`rounded-lg border-2 border-dashed p-4 text-center cursor-pointer transition-colors min-h-[100px] flex flex-col items-center justify-center ${
          isDragActive
            ? "border-[var(--accent)] bg-[var(--accent)]/5"
            : "border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--card)]"
        } ${disabled || uploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="relative w-full aspect-video rounded overflow-hidden bg-[var(--border)] [&>img]:object-cover [&>img]:object-center">
            {value.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i) ? (
              <Image
                src={value}
                alt="Küçük resim (16:9)"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-sm text-[var(--muted)]">
                Video yüklendi
              </span>
            )}
          </div>
        ) : uploading ? (
          <span className="text-sm text-[var(--muted)]">Yükleniyor…</span>
        ) : (
          <span className="text-sm text-[var(--muted)]">
            {isDragActive ? "Buraya bırakın" : "Sürükleyip bırakın veya tıklayın"}
          </span>
        )}
      </div>
    </div>
  )
}

export default function AdminExampleVideosForm() {
  const router = useRouter()
  const [items, setItems] = useState<ExampleVideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<"ok" | "err" | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/api/admin/example-videos")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setItems(data)
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const updateItem = (index: number, patch: Partial<ExampleVideoItem>) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it))
    )
  }

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: newId(),
        title: "",
        thumbnail: "",
      },
    ])
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveMessage(null)
    try {
      console.log("[ExampleVideos] Kaydet - gonderilen:", JSON.stringify(items, null, 2))
      const res = await fetch("/api/admin/example-videos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      })
      console.log("[ExampleVideos] Yanit status:", res.status)
      const data = await res.json().catch(() => ({}))
      console.log("[ExampleVideos] Yanit data:", JSON.stringify(data))
      if (!res.ok) {
        setSaveMessage("err")
        alert("Kaydetme hatası: " + (data.error || `HTTP ${res.status}`))
        return
      }
      setItems(Array.isArray(data) ? data : items)
      setSaveMessage("ok")
      alert("Kaydedildi!")
      router.refresh()
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (err: any) {
      setSaveMessage("err")
      alert("Kaydetme hatası: " + (err.message || "Bilinmeyen hata"))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <p className="text-[var(--muted)]">Örnek videolar yükleniyor…</p>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {items.map((item, index) => (
          <Card key={item.id} className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-[var(--muted)]">
                  Video {index + 1}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeItem(index)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Kaldır
                </Button>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--fg)] mb-1">
                  Başlık
                </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(index, { title: e.target.value })}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--fg)]"
                  placeholder="Örn. Aşk Hikayesi"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DropZone
                  accept={{
                    "image/*": [".jpg", ".jpeg", ".png", ".webp"],
                  }}
                  label="Küçük resim (sürükle-bırak)"
                  value={item.thumbnail}
                  onUpload={(url) => updateItem(index, { thumbnail: url })}
                  disabled={saving}
                />
                <DropZone
                  accept={{
                    "video/*": [".mp4", ".webm", ".mov"],
                  }}
                  label="Video (sürükle-bırak)"
                  value={item.mp4Src || item.webmSrc || ""}
                  onUpload={(url) => {
                    const u = url.toLowerCase()
                    if (u.endsWith(".webm")) {
                      updateItem(index, { webmSrc: url })
                    } else {
                      updateItem(index, { mp4Src: url })
                    }
                  }}
                  disabled={saving}
                />
              </div>
              <p className="text-xs text-[var(--muted)]">
                Videoyu veya küçük resmi yükledikten sonra mutlaka <strong>Kaydet</strong> butonuna basın; aksi halde ana sayfada görünmez.
              </p>
              <p className="text-xs text-[var(--muted)]">
                İsterseniz aşağıdan URL de yapıştırabilirsiniz.
              </p>
              <div>
                <label className="block text-sm font-medium text-[var(--fg)] mb-1">
                  Küçük resim URL
                </label>
                <input
                  type="text"
                  value={item.thumbnail}
                  onChange={(e) =>
                    updateItem(index, { thumbnail: e.target.value })
                  }
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--fg)] text-sm"
                  placeholder="/api/uploads/… veya https://…"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--fg)] mb-1">
                    Video URL (MP4)
                  </label>
                  <input
                    type="text"
                    value={item.mp4Src ?? ""}
                    onChange={(e) =>
                      updateItem(index, {
                        mp4Src: e.target.value || undefined,
                      })
                    }
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--fg)] text-sm"
                    placeholder="Opsiyonel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--fg)] mb-1">
                    Video URL (WebM)
                  </label>
                  <input
                    type="text"
                    value={item.webmSrc ?? ""}
                    onChange={(e) =>
                      updateItem(index, {
                        webmSrc: e.target.value || undefined,
                      })
                    }
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--fg)] text-sm"
                    placeholder="Opsiyonel"
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}

        <Button type="button" variant="outline" onClick={addItem}>
          + Yeni örnek video ekle
        </Button>
      </div>

      {saveMessage === "ok" && (
        <p className="mt-4 text-sm text-green-600 font-medium">Kaydedildi.</p>
      )}
      {saveMessage === "err" && (
        <p className="mt-4 text-sm text-red-600 font-medium">Kaydetme başarısız. Sayfayı yenileyip tekrar deneyin.</p>
      )}
      <div className="mt-8 flex gap-4">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin")}
        >
          Geri
        </Button>
      </div>
    </form>
  )
}
