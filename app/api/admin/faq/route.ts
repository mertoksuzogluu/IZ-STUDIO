import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getAllFaq, setFaq, type FaqItem } from "@/lib/faq"
import { revalidatePath } from "next/cache"

const VALID_PAGES = ["genel", "ask", "hatira", "cocuk"] as const

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const data = await getAllFaq()
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

    const { page, items } = await req.json()
    if (!page || !VALID_PAGES.includes(page)) {
      return NextResponse.json({ error: "Geçersiz sayfa" }, { status: 400 })
    }
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "items array olmalı" }, { status: 400 })
    }

    const saved = await setFaq(page, items as FaqItem[])
    revalidatePath("/")
    revalidatePath(`/${page}`)
    revalidatePath("/sss")
    return NextResponse.json({ page, items: saved })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
