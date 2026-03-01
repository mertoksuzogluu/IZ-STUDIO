$ConfigPath = Join-Path $PSScriptRoot ".sunucu-config"
$cfg = @{}
foreach ($line in (Get-Content $ConfigPath)) {
    if ($line -match "^\s*([^=]+)=(.*)$") { $cfg[$matches[1].Trim()] = $matches[2].Trim().Trim('"') }
}
$SSH_TARGET = "$($cfg['REMOTE_USER'])@$($cfg['REMOTE_HOST'])"
$REMOTE_PATH = $cfg["REMOTE_PATH"]

Write-Host "Sunucu .env.local duzeltiliyor + rebuild..." -ForegroundColor Cyan

$scriptFile = Join-Path $PSScriptRoot "fix-env-now.sh"
scp -o StrictHostKeyChecking=accept-new $scriptFile "${SSH_TARGET}:${REMOTE_PATH}/fix-env-now.sh"
if ($LASTEXITCODE -ne 0) { Write-Host "SCP basarisiz!" -ForegroundColor Red; exit 1 }

ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "chmod +x $REMOTE_PATH/fix-env-now.sh && bash $REMOTE_PATH/fix-env-now.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "BASARILI! Giris dene:" -ForegroundColor Green
    Write-Host "  https://feelcreativestudio.com/auth/signin" -ForegroundColor White
    Write-Host "  admin@izstudio.com / admin123" -ForegroundColor White
} else {
    Write-Host "Hata! Kod: $LASTEXITCODE" -ForegroundColor Red
}
