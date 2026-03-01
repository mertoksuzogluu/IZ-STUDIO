# =============================================================
# iz-studio FULL DEPLOY — Kaynak dosyalari sunucuya gonderir,
# sunucuda build alir ve PM2 restart eder.
# Kullanım:  cd C:\Users\merto\iz-studio
#            .\scripts\deploy-full.ps1
# =============================================================

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path $PSScriptRoot -Parent

# --- Sunucu bilgileri ---
$ConfigPath = Join-Path $PSScriptRoot ".sunucu-config"
if (-not (Test-Path $ConfigPath)) {
    Write-Host "HATA: .sunucu-config bulunamadi." -ForegroundColor Red
    exit 1
}
$cfg = @{}
foreach ($line in (Get-Content $ConfigPath)) {
    if ($line -match "^\s*([^=]+)=(.*)$") { $cfg[$matches[1].Trim()] = $matches[2].Trim().Trim('"') }
}
$REMOTE_HOST = $cfg["REMOTE_HOST"]
$REMOTE_USER = $cfg["REMOTE_USER"]
$REMOTE_PATH = $cfg["REMOTE_PATH"]
$SSH_TARGET = "$REMOTE_USER@$REMOTE_HOST"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FEEL STUDIO - FULL DEPLOY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sunucu : $SSH_TARGET" -ForegroundColor Gray
Write-Host "  Yol    : $REMOTE_PATH" -ForegroundColor Gray
Write-Host ""

# --- 1. Deploy paketi olustur (sadece kaynak, .next ve node_modules HARIC) ---
Write-Host "[1/3] Deploy paketi hazirlaniyor..." -ForegroundColor Yellow

$deployItems = @(
    "app",
    "components",
    "lib",
    "middleware.ts",
    "prisma",
    "public",
    "package.json",
    "package-lock.json",
    "ecosystem.config.cjs",
    "next.config.mjs",
    "next.config.js",
    "tsconfig.json",
    "tailwind.config.ts",
    "tailwind.config.js",
    "postcss.config.mjs",
    "postcss.config.js",
    "scripts"
)

$tempDir = Join-Path $env:TEMP "iz-studio-deploy-src"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

$count = 0
foreach ($item in $deployItems) {
    $src = Join-Path $ProjectRoot $item
    if (Test-Path $src) {
        $dest = Join-Path $tempDir $item
        $destParent = Split-Path $dest -Parent
        if (-not (Test-Path $destParent)) { New-Item -ItemType Directory -Path $destParent -Force | Out-Null }
        Copy-Item $src $dest -Recurse -Force
        $count++
    }
}
Write-Host "  $count oge kopyalandi." -ForegroundColor Green

$tarPath = Join-Path $ProjectRoot "scripts\deploy-src-pack.tar.gz"
if (Test-Path $tarPath) { Remove-Item $tarPath -Force }

# tar.exe Windows 10+ ile birlikte gelir
Push-Location $tempDir
tar -czf $tarPath *
Pop-Location
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

$sizeMB = [math]::Round((Get-Item $tarPath).Length / 1MB, 1)
Write-Host "  Paket: $sizeMB MB" -ForegroundColor Green

# --- 2. Sunucuya gonder ---
Write-Host ""
Write-Host "[2/3] Sunucuya gonderiliyor (SCP)..." -ForegroundColor Yellow
Write-Host "  Sunucu sifresi sorulabilir, girin." -ForegroundColor Gray
scp -o StrictHostKeyChecking=accept-new $tarPath "${SSH_TARGET}:${REMOTE_PATH}/deploy-src-pack.tar.gz"
if ($LASTEXITCODE -ne 0) {
    Write-Host "SCP basarisiz!" -ForegroundColor Red
    Remove-Item $tarPath -Force -ErrorAction SilentlyContinue
    exit 1
}
Remove-Item $tarPath -Force -ErrorAction SilentlyContinue
Write-Host "  Gonderildi." -ForegroundColor Green

# --- 3. Sunucuda: tar ac + env fix + npm install + build + restart ---
Write-Host ""
Write-Host "[3/3] Sunucuda install + build + restart..." -ForegroundColor Yellow
Write-Host "  (2-4 dakika surebilir, sunucu sifresi tekrar sorulabilir)" -ForegroundColor Gray

ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "set -e; cd $REMOTE_PATH; echo '--- Arsiv aciliyor ---'; tar -xzf deploy-src-pack.tar.gz; rm -f deploy-src-pack.tar.gz; echo '--- .env.local kontrol (localhost kaldirilir, mevcut degerler korunur) ---'; sed -i 's|NEXTAUTH_URL=.*localhost.*|NEXTAUTH_URL=https://feelcreativestudio.com|' .env.local 2>/dev/null; grep -q NEXT_PUBLIC_SITE_URL .env.local 2>/dev/null || echo 'NEXT_PUBLIC_SITE_URL=https://feelcreativestudio.com' >> .env.local; echo '--- .env.local icerigi ---'; grep -E 'NEXTAUTH_URL|NEXT_PUBLIC_SITE_URL|DATABASE_URL|NEXTAUTH_SECRET' .env.local; echo '--- npm install ---'; npm install 2>&1 | tail -5; echo '--- prisma generate ---'; npx prisma generate 2>&1 | tail -2; echo '--- npm run build ---'; npm run build 2>&1 | tail -8; echo '--- pm2 restart ---'; pm2 restart feelstudio 2>&1 || pm2 start ecosystem.config.cjs 2>&1; echo ''; echo '=== DEPLOY TAMAMLANDI ==='; pm2 status"
$exitCode = $LASTEXITCODE

Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  DEPLOY BASARILI!" -ForegroundColor Green
    Write-Host "  https://feelcreativestudio.com" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host "DEPLOY BASARISIZ! Cikis kodu: $exitCode" -ForegroundColor Red
    Write-Host "  Sunucuda kontrol edin: ssh $SSH_TARGET" -ForegroundColor Yellow
    exit $exitCode
}
