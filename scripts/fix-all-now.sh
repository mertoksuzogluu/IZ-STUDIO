#!/bin/bash
cd /var/www/feelstudio

echo "=== 1. iyzipay type tanimlama ==="
mkdir -p types
cat > types/iyzipay.d.ts << 'TYPEDEF'
declare module "iyzipay" {
  class Iyzipay {
    constructor(config: { apiKey: string; secretKey: string; uri: string })
    checkoutFormInitialize: { create(request: any, callback: (err: any, result: any) => void): void }
    checkoutForm: { retrieve(request: any, callback: (err: any, result: any) => void): void }
    payment: { create(request: any, callback: (err: any, result: any) => void): void }
    static LOCALE: { TR: string; EN: string }
    static CURRENCY: { TRY: string; USD: string; EUR: string; GBP: string }
    static PAYMENT_GROUP: { PRODUCT: string; LISTING: string; SUBSCRIPTION: string }
    static BASKET_ITEM_TYPE: { PHYSICAL: string; VIRTUAL: string }
  }
  export = Iyzipay
}
TYPEDEF
echo "Type dosyasi olusturuldu"

echo ""
echo "=== 2. .env.local iyzico kontrol ==="
grep PAYMENT_PROVIDER .env.local
grep IYZICO .env.local | sed 's/SECRET.*/SECRET=***/'
echo ""

# PAYMENT_PROVIDER iyzico degilse duzelt
if ! grep -q 'PAYMENT_PROVIDER="iyzico"' .env.local 2>/dev/null; then
  echo "PAYMENT_PROVIDER iyzico olarak ayarlaniyor..."
  sed -i 's/PAYMENT_PROVIDER=.*/PAYMENT_PROVIDER="iyzico"/' .env.local
fi

# IYZICO key yoksa ekle
if ! grep -q 'IYZICO_API_KEY' .env.local 2>/dev/null; then
  echo "iyzico keyleri ekleniyor..."
  echo 'IYZICO_API_KEY="sandbox-jNMbkT4sshXEU3YlCf6nb6AuAZs57efm"' >> .env.local
  echo 'IYZICO_SECRET_KEY="sandbox-FWzb4nAQdbByCXVgU7S4D94kc1Ww6ad8"' >> .env.local
  echo 'IYZICO_SANDBOX="true"' >> .env.local
fi

echo ""
echo "=== 3. uploads route kontrol ==="
if [ ! -f "app/api/uploads/[...path]/route.ts" ]; then
  echo "uploads route YOK, olusturuluyor..."
  mkdir -p "app/api/uploads/[...path]"
  cat > "app/api/uploads/[...path]/route.ts" << 'ROUTEEOF'
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
ROUTEEOF
  echo "uploads route olusturuldu"
else
  echo "uploads route mevcut"
fi

echo ""
echo "=== 4. media route kontrol ==="
if [ ! -f "app/api/media/[...path]/route.ts" ]; then
  echo "media route YOK, olusturuluyor..."
  mkdir -p "app/api/media/[...path]"
  cat > "app/api/media/[...path]/route.ts" << 'MEDIAEOF'
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
    const filePath = join(process.cwd(), "public", "page-media", ...safeParts)
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
MEDIAEOF
  echo "media route olusturuldu"
else
  echo "media route mevcut"
fi

echo ""
echo "=== 5. Son env durumu ==="
grep -E "PAYMENT|IYZICO" .env.local

echo ""
echo "=== 6. Build ==="
rm -rf .next
npm install 2>&1 | tail -3
npm run build 2>&1 | tail -8

echo ""
echo "=== 7. PM2 hard restart ==="
pm2 stop feelstudio 2>/dev/null
pm2 delete feelstudio 2>/dev/null
pm2 start ecosystem.config.cjs
pm2 save

echo ""
echo "=== 8. Test ==="
sleep 2
curl -s -o /dev/null -w "Uploads route: HTTP %{http_code}\n" http://localhost:3010/api/uploads/example-videos/ 2>/dev/null
curl -s -o /dev/null -w "Media route: HTTP %{http_code}\n" http://localhost:3010/api/media/hero/ 2>/dev/null

echo ""
echo "=== TAMAMLANDI ==="
