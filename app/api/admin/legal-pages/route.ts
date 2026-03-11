import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getAllLegalPages, setLegalPage, type LegalPageKey } from "@/lib/legalPages"
import { revalidatePath } from "next/cache"

const VALID_PAGES: LegalPageKey[] = ["hakkimizda", "teslimat-iade", "mesafeli-satis", "gizlilik"]

const PATH_MAP: Record<LegalPageKey, string> = {
  hakkimizda: "/hakkimizda",
  "teslimat-iade": "/teslimat-iade",
  "mesafeli-satis": "/mesafeli-satis-sozlesmesi",
  gizlilik: "/gizlilik",
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const data = await getAllLegalPages()
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { page, data } = await req.json()
    if (!page || !VALID_PAGES.includes(page)) {
      return NextResponse.json({ error: "Geçersiz sayfa" }, { status: 400 })
    }
    if (!data?.title || !Array.isArray(data?.sections)) {
      return NextResponse.json({ error: "Geçersiz veri formatı" }, { status: 400 })
    }

    const saved = await setLegalPage(page, data)

    revalidatePath(PATH_MAP[page as LegalPageKey])
    revalidatePath("/")

    return NextResponse.json({ page, data: saved })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
