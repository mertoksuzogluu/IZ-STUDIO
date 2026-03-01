import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { randomBytes } from "crypto"
import { writeFile, mkdir, readdir, unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const HERO_DIR = join(process.cwd(), "public", "hero")
const MAX_SIZE = 150 * 1024 * 1024
const ALLOWED_TYPES = [
  "image/jpeg", "image/jpg", "image/png", "image/webp",
  "video/mp4", "video/webm", "video/quicktime",
]

export async function GET() {
  try {
    if (!existsSync(HERO_DIR)) return NextResponse.json({ files: [] })
    const entries = await readdir(HERO_DIR)
    const files = entries
      .filter((f) => !f.startsWith("."))
      .map((f) => ({
        name: f,
        url: `/hero/${f}`,
        type: /\.(mp4|webm|mov)$/i.test(f) ? "video" : "image",
      }))
    return NextResponse.json({ files })
  } catch {
    return NextResponse.json({ files: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!existsSync(HERO_DIR)) await mkdir(HERO_DIR, { recursive: true })

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file || typeof file === "string" || !file.arrayBuffer) {
      return NextResponse.json({ error: "Dosya gönderilmedi" }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Dosya 150 MB sınırını aşamaz" }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Desteklenmeyen dosya türü. JPG, PNG, WebP, MP4, WebM kabul edilir." }, { status: 400 })
    }

    const ext = (file.name.split(".").pop() || "bin").toLowerCase()
    const isVideo = file.type.startsWith("video/")
    const baseName = isVideo ? "landing" : `hero-${randomBytes(4).toString("hex")}`
    const filename = `${baseName}.${ext}`
    const filePath = join(HERO_DIR, filename)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    return NextResponse.json({
      url: `/hero/${filename}`,
      name: filename,
      type: isVideo ? "video" : "image",
    })
  } catch (e: any) {
    console.error("Hero upload error:", e)
    return NextResponse.json({ error: "Yükleme hatası" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { filename } = await req.json()
    if (!filename || typeof filename !== "string") {
      return NextResponse.json({ error: "Dosya adı gerekli" }, { status: 400 })
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "")
    const filePath = join(HERO_DIR, safeName)
    if (existsSync(filePath)) {
      await unlink(filePath)
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error("Hero delete error:", e)
    return NextResponse.json({ error: "Silme hatası" }, { status: 500 })
  }
}
