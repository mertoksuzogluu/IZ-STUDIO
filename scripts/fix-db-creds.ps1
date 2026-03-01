# Sunucudaki gercek DB bilgilerini bulur
$ConfigPath = Join-Path $PSScriptRoot ".sunucu-config"
$cfg = @{}
foreach ($line in (Get-Content $ConfigPath)) {
    if ($line -match "^\s*([^=]+)=(.*)$") { $cfg[$matches[1].Trim()] = $matches[2].Trim().Trim('"') }
}
$SSH_TARGET = "$($cfg['REMOTE_USER'])@$($cfg['REMOTE_HOST'])"
$REMOTE_PATH = $cfg["REMOTE_PATH"]

Write-Host "Sunucudaki DB bilgileri kontrol ediliyor..." -ForegroundColor Cyan

$scriptFile = Join-Path $PSScriptRoot "fix-db-creds.sh"
scp -o StrictHostKeyChecking=accept-new $scriptFile "${SSH_TARGET}:${REMOTE_PATH}/fix-db-creds.sh"
if ($LASTEXITCODE -ne 0) { Write-Host "SCP basarisiz!" -ForegroundColor Red; exit 1 }

ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "chmod +x $REMOTE_PATH/fix-db-creds.sh && bash $REMOTE_PATH/fix-db-creds.sh"
