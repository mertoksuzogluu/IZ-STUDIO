# Sunucuda Prisma db push calistirir (verification_tokens vb. tablolari olusturur/gunceller).
# Sifremi unuttum "Bir hata oluştu" hatasi icin once bunu calistirin.
# Kullanim: cd C:\Users\merto\iz-studio  ->  .\scripts\sunucu-prisma-db-push.ps1

$ConfigPath = Join-Path $PSScriptRoot ".sunucu-config"

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
  Write-Host "HATA: Once .\scripts\sunucu-smtp-kontrol.ps1 ile sunucu bilgilerini kaydedin." -ForegroundColor Red
  exit 1
}

$REMOTE_HOST = $saved["REMOTE_HOST"]
$REMOTE_USER = $saved["REMOTE_USER"]
$REMOTE_PATH = $saved["REMOTE_PATH"]

Write-Host "Sunucuda prisma db push calistiriliyor: $REMOTE_USER@$REMOTE_HOST" -ForegroundColor Cyan
$cmd = "cd `"$REMOTE_PATH`" && npx prisma db push && pm2 restart feelstudio"
ssh -o StrictHostKeyChecking=accept-new "${REMOTE_USER}@${REMOTE_HOST}" $cmd
exit $LASTEXITCODE
