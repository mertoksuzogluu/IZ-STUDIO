# Bir kere calistir: Sunucuya sifresiz giris icin SSH key ekler.
# Sonra deploy script'i sifre sormadan calisir.
# Kullanim: .\scripts\ssh-key-kur.ps1

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
  if ($h["REMOTE_HOST"] -and $h["REMOTE_USER"]) { return $h }
  return $null
}

$saved = Get-SavedConfig
$REMOTE_HOST = $saved["REMOTE_HOST"]
$REMOTE_USER = $saved["REMOTE_USER"]
if (-not $REMOTE_HOST -or -not $REMOTE_USER) {
  Write-Host "HATA: Once .\scripts\sunucu-smtp-kontrol.ps1 ile sunucu bilgisini kaydedin." -ForegroundColor Red
  exit 1
}

$keyPath = "$env:USERPROFILE\.ssh\id_ed25519"
$keyPathPub = "$keyPath.pub"
if (-not (Test-Path $keyPath)) {
  Write-Host "SSH anahtari olusturuluyor (sifre bos birakilabilir)..." -ForegroundColor Cyan
  ssh-keygen -t ed25519 -f $keyPath -N '""'
  if ($LASTEXITCODE -ne 0) { Write-Host "Anahtar olusturulamadi." -ForegroundColor Red; exit 1 }
}
Write-Host ""
Write-Host "Sunucuya anahtar ekleniyor. Bu sefer sunucu sifresini girmen gerekecek (sadece 1 kez):" -ForegroundColor Yellow
Get-Content $keyPathPub -Raw | ssh -o StrictHostKeyChecking=accept-new "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p ~/.ssh; cat >> ~/.ssh/authorized_keys; echo OK"
if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "Tamam. Bundan sonra deploy script'i sifre sormadan calisacak." -ForegroundColor Green
  Write-Host "Dene: .\scripts\deploy-sifre-sifirlama-tam.ps1" -ForegroundColor Cyan
} else {
  Write-Host ""
  Write-Host "Anahtar eklenemedi. Sunucu sifresini dogru yazip Enter'a bastin mi?" -ForegroundColor Red
  exit 1
}
