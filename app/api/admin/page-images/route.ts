import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { randomBytes } from "crypto"
import { writeFile, mkdir, readdir, unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const VALID_PAGES = ["hero", "ask", "hatira", "cocuk"] as const
type PageKey = (typeof VALID_PAGES)[number]
const MAX_SIZE = 150 * 1024 * 1024
const ALLOWED_TYPES = [
  "image/jpeg", "image/jpg", "image/png", "image/webp",
  "video/mp4", "video/webm", "video/quicktime",
]

function getDir(page: PageKey) {
  return join(process.cwd(), "public", "page-media", page)
}

export async function GET(req: NextRequest) {
  try {
    const page = req.nextUrl.searchParams.get("page") as PageKey | null
    if (page && !VALID_PAGES.includes(page)) {
      return NextResponse.json({ error: "Gecersiz sayfa" }, { status: 400 })
    }
    const pages = page ? [page] : [...VALID_PAGES]
    const result: Record<string, any[]> = {}

    for (const p of pages) {
      const dir = getDir(p)
      if (!existsSync(dir)) { result[p] = []; continue }
      const entries = await readdir(dir)
      result[p] = entries.filter((f) => !f.startsWith(".")).map((f) => ({
        name: f,
        url: `/api/media/${p}/${f}`,
        type: /\.(mp4|webm|mov)$/i.test(f) ? "video" : "image",
      }))
    }
    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    console.log("[PageImages] POST - session:", session?.user?.email, session?.user?.role)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 401 })
    }

    const formData = await req.formData()
    const page = formData.get("page") as string | null
    const file = formData.get("file") as any

    console.log("[PageImages] page:", page, "file:", file?.name, "size:", file?.size, "type:", file?.type)

    if (!page || !VALID_PAGES.includes(page as PageKey)) {
      return NextResponse.json({ error: "Gecersiz sayfa: " + page }, { status: 400 })
    }
    if (!file || typeof file === "string" || !file.arrayBuffer) {
      return NextResponse.json({ error: "Dosya gonderilmedi veya gecersiz format" }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Dosya 150 MB sinirini asamaz" }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Desteklenmeyen dosya turu: " + file.type }, { status: 400 })
    }

    const dir = getDir(page as PageKey)
    console.log("[PageImages] dir:", dir, "exists:", existsSync(dir))
    if (!existsSync(dir)) await mkdir(dir, { recursive: true })

    const ext = (file.name.split(".").pop() || "bin").toLowerCase()
    const isVideo = file.type.startsWith("video/")
    const baseName = isVideo ? "landing" : `img-${randomBytes(4).toString("hex")}`
    const filename = `${baseName}.${ext}`
    const filePath = join(dir, filename)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log("[PageImages] writing", buffer.length, "bytes to", filePath)
    await writeFile(filePath, buffer)
    console.log("[PageImages] written OK, exists:", existsSync(filePath))

    return NextResponse.json({
      url: `/api/media/${page}/${filename}`,
      name: filename,
      type: isVideo ? "video" : "image",
      page,
    })
  } catch (e: any) {
    console.error("[PageImages] UPLOAD ERROR:", e.message, e.stack)
    return NextResponse.json({ error: "Yukleme hatasi: " + e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { page, filename } = await req.json()
    if (!page || !VALID_PAGES.includes(page) || !filename) {
      return NextResponse.json({ error: "Gecersiz parametre" }, { status: 400 })
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "")
    const filePath = join(getDir(page), safeName)
    if (existsSync(filePath)) await unlink(filePath)

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
