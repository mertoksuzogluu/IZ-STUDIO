# Sifremi unuttum ve sifre sifirlama sayfalarini sunucuya kopyalar, build alir, PM2 restart yapar.
# Boylece /auth/forgot-password ve /auth/reset-password 404 vermez.
# Kullanim: cd C:\Users\merto\iz-studio  ->  .\scripts\deploy-auth-pages.ps1

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

Write-Host "Auth sayfalari sunucuya gonderiliyor: $REMOTE_USER@$REMOTE_HOST" -ForegroundColor Cyan
Write-Host "Proje yolu: $REMOTE_PATH" -ForegroundColor Gray
Write-Host ""

# Sunucuda app/auth klasorlerini olustur
ssh -o StrictHostKeyChecking=accept-new "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p `"$REMOTE_PATH/app/auth/forgot-password`" `"$REMOTE_PATH/app/auth/reset-password`""

# Sayfa dosyalarini kopyala
$authPages = @(
  @{ local = "app/auth/forgot-password/page.tsx"; remote = "app/auth/forgot-password/page.tsx" },
  @{ local = "app/auth/reset-password/page.tsx"; remote = "app/auth/reset-password/page.tsx" },
  @{ local = "app/auth/reset-password/ResetPasswordForm.tsx"; remote = "app/auth/reset-password/ResetPasswordForm.tsx" }
)
foreach ($p in $authPages) {
  $localPath = Join-Path $ProjectRoot $p.local
  if (Test-Path $localPath) {
    scp -o StrictHostKeyChecking=accept-new -q $localPath "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/$($p.remote)"
    if ($LASTEXITCODE -eq 0) { Write-Host "  [OK] $($p.remote)" -ForegroundColor Green }
    else { Write-Host "  [HATA] $($p.remote)" -ForegroundColor Red }
  } else {
    Write-Host "  [ATLANDI] Yerelde yok: $($p.local)" -ForegroundColor Yellow
  }
}

Write-Host ""
Write-Host "Sunucuda build ve restart yapiliyor (biraz surebilir)..." -ForegroundColor Cyan
$buildCmd = "cd `"$REMOTE_PATH`" && npm run build && pm2 restart feelstudio"
ssh -o StrictHostKeyChecking=accept-new "${REMOTE_USER}@${REMOTE_HOST}" $buildCmd
$exitCode = $LASTEXITCODE

if ($exitCode -eq 0) {
  Write-Host ""
  Write-Host "Tamamlandi. /auth/forgot-password ve /auth/reset-password calisir olmali." -ForegroundColor Green
} else {
  Write-Host ""
  Write-Host "Build veya restart basarisiz. Sunucuda elle calistirin: cd $REMOTE_PATH && npm run build && pm2 restart feelstudio" -ForegroundColor Red
  exit $exitCode
}
