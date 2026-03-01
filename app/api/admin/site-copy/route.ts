import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { getSiteCopy, setSiteCopy, type SiteCopy } from "@/lib/siteCopy"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const copy = await getSiteCopy()
    return NextResponse.json(copy)
  } catch (e) {
    console.error("Admin site-copy GET:", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = (await req.json()) as Partial<SiteCopy>
    const copy = await setSiteCopy(body)
    // Metinler layout ve tüm sayfalarda kullanıldığı için önbelleği temizle
    revalidatePath("/", "layout")
    return NextResponse.json(copy)
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error"
    console.error("Admin site-copy PATCH:", e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
