import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { randomBytes } from "crypto"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const UPLOAD_DIR = "example-videos"
const MAX_SIZE = 150 * 1024 * 1024
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"]

async function saveUpload(file: any): Promise<string> {
  const uploadsDir = join(process.cwd(), "public", "uploads", UPLOAD_DIR)
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true })
  }
  const fileId = randomBytes(8).toString("hex")
  const ext = (file.name.split(".").pop() || "").toLowerCase() || "bin"
  const filename = `${fileId}.${ext}`
  const filePath = join(uploadsDir, filename)
  const bytes = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(bytes))
  return `/api/uploads/${UPLOAD_DIR}/${filename}`
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as any
    if (!file || typeof file === "string" || !file.arrayBuffer) {
      return NextResponse.json(
        { error: "Dosya gönderilmedi" },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Dosya boyutu 150 MB sınırını aşamaz" },
        { status: 400 }
      )
    }

    const isImage = IMAGE_TYPES.includes(file.type)
    const isVideo = VIDEO_TYPES.includes(file.type)
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Sadece resim (JPG, PNG, WebP) veya video (MP4, WebM) yükleyebilirsiniz." },
        { status: 400 }
      )
    }

    const url = await saveUpload(file)
    return NextResponse.json({ url })
  } catch (e: any) {
    console.error("Example videos upload:", e)
    return NextResponse.json(
      { error: "Yükleme hatası: " + (e.message || "bilinmeyen") },
      { status: 500 }
    )
  }
}
