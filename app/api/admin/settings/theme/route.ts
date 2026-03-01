import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { setActiveSpecialTheme, type SpecialThemeValue } from "@/lib/settings"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { getActiveSpecialTheme } = await import("@/lib/settings")
    const theme = await getActiveSpecialTheme()
    return NextResponse.json({ theme })
  } catch (error) {
    console.error("Get theme error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { theme } = await req.json()
    const value = theme as SpecialThemeValue
    if (!["default", "anneler_gunu", "babalar_gunu", "sevgililer_gunu"].includes(value)) {
      return NextResponse.json({ error: "Invalid theme" }, { status: 400 })
    }
    await setActiveSpecialTheme(value)
    revalidatePath("/", "layout")
    return NextResponse.json({ success: true, theme: value })
  } catch (error) {
    console.error("Set theme error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
