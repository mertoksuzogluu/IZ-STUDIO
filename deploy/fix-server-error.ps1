# Sayfa gecisinde server hatasi duzeltmesi: dosyalari atar, sunucuda build + restart yapar.
# Kullanim: PowerShell'de  cd C:\Users\merto\iz-studio   sonra   .\deploy\fix-server-error.ps1

$SERVER = "root@38.242.143.93"
$REMOTE = "/var/www/feelstudio"

$ErrorActionPreference = "Stop"
$root = if (Test-Path ".\package.json") { (Get-Location).Path } else { "C:\Users\merto\iz-studio" }
if (-not (Test-Path "$root\package.json")) {
    Write-Host "Hata: iz-studio proje klasorunde degilsin. cd C:\Users\merto\iz-studio"
    exit 1
}

Write-Host "=== 1. Dosyalar sunucuya gonderiliyor ==="
scp "$root\lib\settings.ts" "${SERVER}:${REMOTE}/lib/"
scp "$root\lib\siteCopy.ts" "${SERVER}:${REMOTE}/lib/"
scp "$root\app\error.tsx" "${SERVER}:${REMOTE}/app/"
scp "$root\app\products\page.tsx" "${SERVER}:${REMOTE}/app/products/"
scp "$root\app\products\`[slug`]\page.tsx" "${SERVER}:${REMOTE}/app/products/[slug]/"
scp "$root\app\cocuk\page.tsx" "${SERVER}:${REMOTE}/app/cocuk/"
scp "$root\app\hatira\page.tsx" "${SERVER}:${REMOTE}/app/hatira/"

Write-Host ""
Write-Host "=== 2. Sunucuda build ve pm2 restart ==="
ssh $SERVER "cd $REMOTE && npm run build && pm2 restart feelstudio"

Write-Host ""
Write-Host "Bitti. Siteyi tekrar dene."
