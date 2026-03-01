#!/bin/bash
cd /var/www/feelstudio

echo "=== KONTROL: instanceof File ==="
grep -rn "instanceof File" app/api/admin/example-videos/upload/route.ts 2>/dev/null || echo "(bulunamadi - zaten temiz)"

echo ""
echo "=== SED ILE DUZELT ==="
sed -i 's/!file || !(file instanceof File)/!file || typeof file === "string" || !file.arrayBuffer/g' app/api/admin/example-videos/upload/route.ts
sed -i 's/as File | null/as any/g' app/api/admin/example-videos/upload/route.ts
sed -i 's/async function saveUpload(file: File)/async function saveUpload(file: any)/g' app/api/admin/example-videos/upload/route.ts

echo "=== KONTROL SONRASI ==="
grep -n "instanceof File" app/api/admin/example-videos/upload/route.ts 2>/dev/null && echo "HALA VAR!" || echo "TEMIZ"
grep -n "as File" app/api/admin/example-videos/upload/route.ts 2>/dev/null && echo "as File HALA VAR!" || echo "as File TEMIZ"

echo ""
echo "=== UPLOADS ROUTE OLUSTUR ==="
mkdir -p "app/api/uploads/[...path]"
cat > "app/api/uploads/[...path]/route.ts" << 'ROUTE_EOF'
import { NextRequest, NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MIME: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp",
  gif: "image/gif", mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime",
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const safeParts = params.path.map((p) => p.replace(/\.\./g, ""))
    const filePath = join(process.cwd(), "public", "uploads", ...safeParts)
    if (!existsSync(filePath)) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const s = await stat(filePath)
    if (!s.isFile()) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const ext = filePath.split(".").pop()?.toLowerCase() || ""
    const buffer = await readFile(filePath)
    return new NextResponse(buffer, {
      headers: { "Content-Type": MIME[ext] || "application/octet-stream", "Content-Length": String(buffer.length), "Cache-Control": "public, max-age=31536000" },
    })
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }) }
}
ROUTE_EOF
echo "uploads route olusturuldu"

echo ""
echo ""
echo "=== route.ts son hali (ilk 40 satir) ==="
head -40 app/api/admin/example-videos/upload/route.ts

echo ""
echo "=== TEMIZ BUILD ==="
rm -rf .next
npm run build 2>&1 | tail -8

echo ""
echo "=== BUILD SONRASI KONTROL ==="
grep -o "instanceof File" .next/server/app/api/admin/example-videos/upload/route.js 2>/dev/null && echo "BUILD ESKI!" || echo "BUILD GUNCEL"

echo ""
echo "=== PM2 RESTART ==="
pm2 restart feelstudio
echo "TAMAMLANDI"
