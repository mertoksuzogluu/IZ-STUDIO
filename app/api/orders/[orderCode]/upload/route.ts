import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// For MVP: Store files in public/uploads directory
async function saveFile(file: File, orderCode: string): Promise<{ publicUrl: string; filePath: string }> {
  const uploadsDir = join(process.cwd(), "public", "uploads", orderCode)
  
  // Create directory if it doesn't exist
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true })
  }

  const fileId = randomBytes(8).toString("hex")
  const fileExt = file.name.split(".").pop()
  const filename = `${fileId}.${fileExt}`
  const filePath = join(uploadsDir, filename)
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  await writeFile(filePath, buffer)
  
  const publicUrl = `/uploads/${orderCode}/${filename}`
  
  return { publicUrl, filePath }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderCode = params.orderCode

    const order = await prisma.order.findUnique({
      where: { orderCode },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if user owns the order (for logged-in users)
    // Guest orders can be accessed by anyone with the orderCode (it's a secret)
    if (order.userId && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 100MB limit" },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic", "video/mp4", "video/mov", "video/avi"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      )
    }

    // Determine media type
    let mediaType: "photo" | "video" | "audio" = "photo"
    if (file.type.startsWith("video/")) {
      mediaType = "video"
    } else if (file.type.startsWith("audio/")) {
      mediaType = "audio"
    }

    // Save file
    const { publicUrl } = await saveFile(file, orderCode)

    // Create media asset record
    const asset = await prisma.mediaAsset.create({
      data: {
        orderId: order.id,
        type: mediaType,
        url: publicUrl,
        filename: file.name,
        size: file.size,
      },
    })

    return NextResponse.json({
      success: true,
      asset: {
        id: asset.id,
        filename: asset.filename,
        size: asset.size,
        type: asset.type,
        url: asset.url,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Legacy GET endpoint for backward compatibility (returns mock URL)
export async function GET(
  req: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orderCode = params.orderCode
    const searchParams = req.nextUrl.searchParams
    const filename = searchParams.get("filename")
    const type = searchParams.get("type") as "photo" | "video" | "audio"
    const size = parseInt(searchParams.get("size") || "0")

    if (!filename || !type || !size) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { orderCode },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if user owns the order (for logged-in users)
    // Guest orders can be accessed by anyone with the orderCode (it's a secret)
    if (order.userId && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Return a placeholder - actual upload will happen via POST
    return NextResponse.json({
      uploadUrl: `/api/orders/${orderCode}/upload`,
      assetId: null,
      publicUrl: null,
    })
  } catch (error) {
    console.error("Upload URL error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
