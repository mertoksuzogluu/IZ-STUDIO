import { NextRequest, NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
}

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = join(process.cwd(), "public", "page-media", ...params.path)

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const fileStat = await stat(filePath)
    if (!fileStat.isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const ext = filePath.split(".").pop()?.toLowerCase() || ""
    const contentType = MIME_TYPES[ext] || "application/octet-stream"

    const buffer = await readFile(filePath)
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
