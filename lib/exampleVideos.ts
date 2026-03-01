import { prisma } from "@/lib/prisma"

const EXAMPLE_VIDEOS_KEY = "example_videos"

export type ExampleVideoItem = {
  id: string
  title: string
  thumbnail: string
  mp4Src?: string
  webmSrc?: string
}

// 1x1 şeffaf PNG – placeholder görseller 404 vermesin diye (gerçek dosya yoksa kullanılır)
const PLACEHOLDER_IMAGE_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="

const DEFAULT_EXAMPLE_VIDEOS: ExampleVideoItem[] = [
  { id: "1", title: "Aşk Hikayesi", thumbnail: PLACEHOLDER_IMAGE_DATA_URL },
  { id: "2", title: "Hatıra Kutusu", thumbnail: PLACEHOLDER_IMAGE_DATA_URL },
  { id: "3", title: "Çocukluk Anıları", thumbnail: PLACEHOLDER_IMAGE_DATA_URL },
  { id: "4", title: "Düğün Öncesi", thumbnail: PLACEHOLDER_IMAGE_DATA_URL },
  { id: "5", title: "Yıldönümü", thumbnail: PLACEHOLDER_IMAGE_DATA_URL },
  { id: "6", title: "Aile Toplantısı", thumbnail: PLACEHOLDER_IMAGE_DATA_URL },
]

export async function getExampleVideos(): Promise<ExampleVideoItem[]> {
  try {
    const row = await prisma.siteSetting.findUnique({
      where: { key: EXAMPLE_VIDEOS_KEY },
    })
    if (!row?.value) return DEFAULT_EXAMPLE_VIDEOS
    const parsed = JSON.parse(row.value) as unknown
    if (!Array.isArray(parsed)) return DEFAULT_EXAMPLE_VIDEOS
    const items = parsed.map(normalizeItem).filter((x): x is ExampleVideoItem => x != null)
    return items.length ? items : DEFAULT_EXAMPLE_VIDEOS
  } catch {
    return DEFAULT_EXAMPLE_VIDEOS
  }
}

const OLD_PLACEHOLDER_PATTERN = /^\/placeholder-video-\d\.jpg$/i

function fixUploadUrl(url: string | undefined): string | undefined {
  if (!url || typeof url !== "string") return undefined
  if (url.startsWith("/uploads/") && !url.startsWith("/api/uploads/")) {
    return `/api${url}`
  }
  return url
}

function normalizeItem(x: unknown): ExampleVideoItem | null {
  if (!x || typeof x !== "object") return null
  const o = x as Record<string, unknown>
  if (typeof o.id !== "string") return null
  const title = o.title != null ? String(o.title) : ""
  let thumbnail = o.thumbnail != null ? String(o.thumbnail) : ""
  if (OLD_PLACEHOLDER_PATTERN.test(thumbnail)) thumbnail = PLACEHOLDER_IMAGE_DATA_URL
  thumbnail = fixUploadUrl(thumbnail) || thumbnail
  return {
    id: o.id,
    title,
    thumbnail,
    mp4Src: fixUploadUrl(typeof o.mp4Src === "string" && o.mp4Src ? o.mp4Src : undefined),
    webmSrc: fixUploadUrl(typeof o.webmSrc === "string" && o.webmSrc ? o.webmSrc : undefined),
  }
}

export async function setExampleVideos(
  items: ExampleVideoItem[]
): Promise<ExampleVideoItem[]> {
  const normalized = items.map((x) => normalizeItem(x)).filter((x): x is ExampleVideoItem => x != null)
  const valueStr = JSON.stringify(normalized)
  await prisma.siteSetting.upsert({
    where: { key: EXAMPLE_VIDEOS_KEY },
    create: { key: EXAMPLE_VIDEOS_KEY, value: valueStr },
    update: { value: valueStr },
  })
  return normalized
}
