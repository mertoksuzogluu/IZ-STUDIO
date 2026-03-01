# Sunucuya SSH ile baglanip SMTP env kontrolu yapar.
# Ilk calistirmada sunucu bilgilerini sorar ve saklar; sonraki calistirmalarda sormaz.
# Kullanim: cd C:\Users\merto\iz-studio  ->  .\scripts\sunucu-smtp-kontrol.ps1

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

function Save-Config($remoteHost, $remoteUser, $remotePath) {
  @"
REMOTE_HOST=$remoteHost
REMOTE_USER=$remoteUser
REMOTE_PATH=$remotePath
"@ | Set-Content $ConfigPath -Encoding UTF8
}

# Oncelik: ortam degiskenleri -> kaydedilmis config -> sor
$REMOTE_HOST = $env:REMOTE_HOST
$REMOTE_USER = $env:REMOTE_USER
$REMOTE_PATH = $env:REMOTE_PATH

if (-not $REMOTE_HOST -or -not $REMOTE_USER -or -not $REMOTE_PATH) {
  $saved = Get-SavedConfig
  if ($saved) {
    $REMOTE_HOST = $saved["REMOTE_HOST"]
    $REMOTE_USER = $saved["REMOTE_USER"]
    $REMOTE_PATH = $saved["REMOTE_PATH"]
  }
}

if (-not $REMOTE_HOST -or -not $REMOTE_USER -or -not $REMOTE_PATH) {
  Write-Host "Ilk calistirma: sunucu bilgileri bir kez sorulacak, sonra saklanacak." -ForegroundColor Cyan
  if (-not $REMOTE_HOST) { $REMOTE_HOST = Read-Host "Sunucu (IP veya domain) [feelcreativestudio.com]" ; if ([string]::IsNullOrWhiteSpace($REMOTE_HOST)) { $REMOTE_HOST = "feelcreativestudio.com" } }
  if (-not $REMOTE_USER) { $REMOTE_USER = Read-Host "SSH kullanici adi [root]" ; if ([string]::IsNullOrWhiteSpace($REMOTE_USER)) { $REMOTE_USER = "root" } }
  if (-not $REMOTE_PATH) { $REMOTE_PATH = Read-Host "Sunucuda proje klasoru (tam yol) [var/www/iz-studio icin /var/www/iz-studio yaz]" }
  if (-not $REMOTE_PATH) { $REMOTE_PATH = "/var/www/iz-studio" }
  Save-Config $REMOTE_HOST $REMOTE_USER $REMOTE_PATH
  Write-Host "Bilgiler kaydedildi: $ConfigPath" -ForegroundColor Green
}

# Sunucuya scripts klasoru ve gerekli .js dosyalarini kopyala
Write-Host ""
Write-Host "Sunucuya baglaniyor: $REMOTE_USER@$REMOTE_HOST" -ForegroundColor Cyan
Write-Host "Proje yolu: $REMOTE_PATH" -ForegroundColor Gray
ssh -o StrictHostKeyChecking=accept-new "${REMOTE_USER}@${REMOTE_HOST}" "mkdir -p `"$REMOTE_PATH/scripts`""
$scriptsToCopy = @("check-smtp-env.js", "test-email-send.js", "setup-smtp-env.js", "fix-smtp-env.js")
foreach ($f in $scriptsToCopy) {
  $localF = Join-Path $PSScriptRoot $f
  if (Test-Path $localF) {
    scp -o StrictHostKeyChecking=accept-new -q $localF "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/scripts/$f"
    if ($LASTEXITCODE -ne 0) { Write-Host "Uyari: $f kopyalanamadi." -ForegroundColor Yellow }
  }
}
Write-Host ""
$remoteCmd = "cd `"$REMOTE_PATH`" && node scripts/check-smtp-env.js"
$checkOutput = ssh -o StrictHostKeyChecking=accept-new "${REMOTE_USER}@${REMOTE_HOST}" $remoteCmd 2>&1
$checkOutput
$exitCode = $LASTEXITCODE
if ($checkOutput -match "SMTP_HOST, SMTP_USER, SMTP_PASS mutlaka") {
  Write-Host ""
  Write-Host "SMTP eksik. Sunucuda duzeltmek icin:" -ForegroundColor Yellow
  Write-Host "  ssh ${REMOTE_USER}@${REMOTE_HOST}" -ForegroundColor White
  Write-Host "  cd `"$REMOTE_PATH`"" -ForegroundColor White
  Write-Host "  node scripts/fix-smtp-env.js" -ForegroundColor White
  Write-Host "  (Sifre sorulacak; no-reply@feelcreativestudio.com mail sifresi)" -ForegroundColor Gray
  Write-Host "  node scripts/test-email-send.js" -ForegroundColor White
  Write-Host "  pm2 restart feelstudio" -ForegroundColor White
  Write-Host ""
}
if ($exitCode -ne 0) {
  Write-Host ""
  Write-Host "Hata: SSH veya uzak komut basarisiz (cikis: $exitCode)." -ForegroundColor Red
  if ($exitCode -eq 1) {
    Write-Host "Sunucuda bu klasor yok: $REMOTE_PATH" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Dogru proje yolunu bulmak icin:" -ForegroundColor Cyan
    Write-Host "  1. Sunucuya baglan:  ssh root@feelcreativestudio.com" -ForegroundColor White
    Write-Host "  2. Sunucuda calistir:  find / -type d -name iz-studio 2>/dev/null" -ForegroundColor White
    Write-Host "     veya:  ls /root  ve  ls /var/www  ile bak" -ForegroundColor White
    Write-Host "  3. Cikan yolu not al (ornegin /root/iz-studio)" -ForegroundColor White
    Write-Host "  4. Bu scriptte config'i sil:  del scripts\.sunucu-config" -ForegroundColor White
    Write-Host "  5. Scripti tekrar calistir, proje yolu sorulunca az once not aldigin yolu yaz" -ForegroundColor White
  }
  Write-Host ""
  Write-Host "Config'i silmek icin:  del scripts\.sunucu-config" -ForegroundColor Gray
  exit $exitCode
}
