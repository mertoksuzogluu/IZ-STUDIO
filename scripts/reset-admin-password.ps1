# Admin şifresini sunucuda sıfırlar
# Kullanım: .\scripts\reset-admin-password.ps1
# Sunucu şifresi sorulacak.

$ConfigPath = Join-Path $PSScriptRoot ".sunucu-config"
$cfg = @{}
foreach ($line in (Get-Content $ConfigPath)) {
    if ($line -match "^\s*([^=]+)=(.*)$") { $cfg[$matches[1].Trim()] = $matches[2].Trim().Trim('"') }
}
$SSH_TARGET = "$($cfg['REMOTE_USER'])@$($cfg['REMOTE_HOST'])"
$REMOTE_PATH = $cfg["REMOTE_PATH"]

Write-Host ""
Write-Host "Admin sifre sifirlama" -ForegroundColor Cyan
Write-Host "Sunucu: $SSH_TARGET" -ForegroundColor Gray
Write-Host ""

# Önce script dosyasını sunucuya kopyala
$scriptFile = Join-Path $PSScriptRoot "reset-admin-pw.js"
Write-Host "[1/2] Script sunucuya gonderiliyor..." -ForegroundColor Yellow
scp -o StrictHostKeyChecking=accept-new $scriptFile "${SSH_TARGET}:${REMOTE_PATH}/scripts/reset-admin-pw.js"
if ($LASTEXITCODE -ne 0) {
    Write-Host "SCP basarisiz!" -ForegroundColor Red
    exit 1
}

# Sunucuda çalıştır
Write-Host "[2/2] Sunucuda calistiriliyor..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "cd $REMOTE_PATH && node scripts/reset-admin-pw.js"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Basarili! Giris: admin@izstudio.com / admin123" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Hata olustu. Cikis kodu: $LASTEXITCODE" -ForegroundColor Red
}
