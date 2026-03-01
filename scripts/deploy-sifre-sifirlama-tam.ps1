# Tek script: Sifre sifirlama sayfalari + API + prisma db push + build + restart.
# Yeni terminal ac, yapistir, Enter. Sunucu sifresi sorulursa gir.
# Kullanim: cd C:\Users\merto\iz-studio
#          .\scripts\deploy-sifre-sifirlama-tam.ps1

$ConfigPath = Join-Path $PSScriptRoot ".sunucu-config"
$ProjectRoot = Join-Path $PSScriptRoot ".."

function Get-SavedConfig {
  if (-not (Test-Path $ConfigPath)) { return $null }
  $content = Get-Content $ConfigPath -Raw -ErrorAction SilentlyContinue
  if (-not $content) { return $null }
  $h = @{}
  foreach ($line in ($content -split "`n")) {
    if ($line -match "^\s*([^=]+)=(.*)$") { $h[$matches[1].Trim()] = $matches[2].Trim().Trim('"') }
  }
  if ($h["REMOTE_HOST"] -and $h["REMOTE_USER"] -and $h["REMOTE_PATH"]) { return $h }
  return $null
}

$saved = Get-SavedConfig
if (-not $saved) {
  Write-Host "HATA: Once sunucu bilgilerini kaydedin. .\scripts\sunucu-smtp-kontrol.ps1 ile bir kez calistirin." -ForegroundColor Red
  exit 1
}

$REMOTE_HOST = $saved["REMOTE_HOST"]
$REMOTE_USER = $saved["REMOTE_USER"]
$REMOTE_PATH = $saved["REMOTE_PATH"]

Write-Host ""
Write-Host "=== Sifre sifirlama tam deploy ===" -ForegroundColor Cyan
Write-Host "Sunucu: $REMOTE_USER@$REMOTE_HOST | Proje: $REMOTE_PATH" -ForegroundColor Gray
Write-Host ""

# 1) Dosyalari tek zip'te topla (sifre 1 kez: scp)
$files = @(
  "package.json",
  "package-lock.json",
  "lib/email.ts",
  "lib/auth.ts",
  "app/api/check-smtp/route.ts",
  "app/auth/forgot-password/page.tsx",
  "app/auth/reset-password/page.tsx",
  "app/auth/reset-password/ResetPasswordForm.tsx",
  "app/api/auth/forgot-password/route.ts",
  "app/api/auth/reset-password/route.ts"
)
$tempDir = Join-Path $env:TEMP "iz-studio-deploy"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
foreach ($f in $files) {
  $localPath = Join-Path $ProjectRoot $f
  if (Test-Path $localPath) {
    $dest = Join-Path $tempDir $f
    $destDir = Split-Path $dest -Parent
    if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
    Copy-Item $localPath $dest -Force
    Write-Host "  [OK] $f" -ForegroundColor Green
  }
}
$zipPath = Join-Path $ProjectRoot "scripts\deploy-pack.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
Write-Host ""
Write-Host "Sunucuya zip gonderiliyor (sifre 1. kez)..." -ForegroundColor Cyan
scp -o StrictHostKeyChecking=accept-new $zipPath "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/deploy-pack.zip"
if ($LASTEXITCODE -ne 0) { Write-Host "SCP basarisiz." -ForegroundColor Red; exit 1 }
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

# 2) Sunucuda ac + prisma + build + restart (sifre 2. kez - uzun surebilir, bekle)
Write-Host ""
Write-Host "Sunucuda dosyalar aciliyor, prisma, build, pm2 restart (sifre 2. kez - 1-2 dk bekle)..." -ForegroundColor Cyan
$remoteCmd = "cd `"$REMOTE_PATH`" && unzip -o -q deploy-pack.zip && rm -f deploy-pack.zip && npx prisma db push 2>/dev/null; npm install && npm run build && pm2 restart feelstudio"
ssh -o StrictHostKeyChecking=accept-new "${REMOTE_USER}@${REMOTE_HOST}" $remoteCmd
$exitCode = $LASTEXITCODE

Write-Host ""
if ($exitCode -eq 0) {
  Write-Host "Tamamlandi. Sifremi unuttum + sifre sifirlama linki calisir olmali." -ForegroundColor Green
} else {
  Write-Host "Build/restart basarisiz. Cikis kodu: $exitCode" -ForegroundColor Red
  exit $exitCode
}
