import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import {
  getExampleVideos,
  setExampleVideos,
  type ExampleVideoItem,
} from "@/lib/exampleVideos"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const items = await getExampleVideos()
    return NextResponse.json(items)
  } catch (e) {
    console.error("Admin example-videos GET:", e)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = (await req.json()) as ExampleVideoItem[]
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Body must be an array of video items" },
        { status: 400 }
      )
    }
    const items = body.filter(
      (x): x is ExampleVideoItem =>
        x != null &&
        typeof x === "object" &&
        typeof (x as ExampleVideoItem).id === "string" &&
        typeof (x as ExampleVideoItem).title === "string" &&
        typeof (x as ExampleVideoItem).thumbnail === "string"
    )
    const saved = await setExampleVideos(items)
    revalidatePath("/")
    return NextResponse.json(saved)
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal server error"
    console.error("Admin example-videos PATCH:", e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
