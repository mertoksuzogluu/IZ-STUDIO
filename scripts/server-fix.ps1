# Sunucudaki auth sorununu tespit edip duzeltir
# Kullanım: .\scripts\server-fix.ps1
# Sunucu sifresi 2 kez sorulacak (SCP + SSH)

$ConfigPath = Join-Path $PSScriptRoot ".sunucu-config"
$cfg = @{}
foreach ($line in (Get-Content $ConfigPath)) {
    if ($line -match "^\s*([^=]+)=(.*)$") { $cfg[$matches[1].Trim()] = $matches[2].Trim().Trim('"') }
}
$SSH_TARGET = "$($cfg['REMOTE_USER'])@$($cfg['REMOTE_HOST'])"
$REMOTE_PATH = $cfg["REMOTE_PATH"]

Write-Host ""
Write-Host "=== SUNUCU ONARIM ===" -ForegroundColor Cyan
Write-Host "Sunucu: $SSH_TARGET" -ForegroundColor Gray
Write-Host ""

# 1. Fix script'ini sunucuya gonder
$fixScript = Join-Path $PSScriptRoot "server-fix.sh"
Write-Host "[1/2] Onarim scripti gonderiliyor..." -ForegroundColor Yellow
scp -o StrictHostKeyChecking=accept-new $fixScript "${SSH_TARGET}:${REMOTE_PATH}/server-fix.sh"
if ($LASTEXITCODE -ne 0) {
    Write-Host "SCP basarisiz!" -ForegroundColor Red
    exit 1
}
Write-Host "  OK" -ForegroundColor Green

# 2. Sunucuda calistir
Write-Host "[2/2] Sunucuda calistiriliyor..." -ForegroundColor Yellow
Write-Host ""
ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "chmod +x $REMOTE_PATH/server-fix.sh && bash $REMOTE_PATH/server-fix.sh"
$exitCode = $LASTEXITCODE

Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "Onarim tamamlandi!" -ForegroundColor Green
    Write-Host "Simdi https://feelcreativestudio.com/auth/signin adresinden dene:" -ForegroundColor Green
    Write-Host "  Email: admin@izstudio.com" -ForegroundColor White
    Write-Host "  Sifre: admin123" -ForegroundColor White
} else {
    Write-Host "Hata olustu! Cikis kodu: $exitCode" -ForegroundColor Red
}
