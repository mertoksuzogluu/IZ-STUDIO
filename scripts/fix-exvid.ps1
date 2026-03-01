$ConfigPath = Join-Path $PSScriptRoot ".sunucu-config"
$cfg = @{}
foreach ($line in (Get-Content $ConfigPath)) {
    if ($line -match "^\s*([^=]+)=(.*)$") { $cfg[$matches[1].Trim()] = $matches[2].Trim().Trim('"') }
}
$SSH_TARGET = "$($cfg['REMOTE_USER'])@$($cfg['REMOTE_HOST'])"
$REMOTE_PATH = $cfg["REMOTE_PATH"]
$ProjectRoot = Split-Path $PSScriptRoot -Parent

Write-Host "=== EXAMPLE-VIDEOS UPLOAD FIX ===" -ForegroundColor Cyan

# Dosyayi direkt SCP ile gonder
$localFile = Join-Path $ProjectRoot "app\api\admin\example-videos\upload\route.ts"
Write-Host "Dosya gonderiliyor..." -ForegroundColor Yellow
scp -o StrictHostKeyChecking=accept-new $localFile "${SSH_TARGET}:${REMOTE_PATH}/app/api/admin/example-videos/upload/route.ts"

# uploads servis route
$uploadsRoute = Join-Path $ProjectRoot "app\api\uploads\[...path]\route.ts"
Write-Host "Uploads servis route gonderiliyor..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "mkdir -p '$REMOTE_PATH/app/api/uploads/[...path]'"
scp -o StrictHostKeyChecking=accept-new $uploadsRoute "${SSH_TARGET}:${REMOTE_PATH}/app/api/uploads/[...path]/route.ts"

# Kontrol
Write-Host "Kaynak kontrol..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "grep 'instanceof File' $REMOTE_PATH/app/api/admin/example-videos/upload/route.ts && echo 'HATA: hala eski!' || echo 'Kaynak OK'"

# Rebuild
Write-Host "Temiz build + restart..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "cd $REMOTE_PATH && rm -rf .next && npm run build 2>&1 | tail -5 && pm2 restart feelstudio && echo 'BASARILI'"

if ($LASTEXITCODE -eq 0) {
    Write-Host "TAMAMLANDI!" -ForegroundColor Green
} else {
    Write-Host "HATA! Kod: $LASTEXITCODE" -ForegroundColor Red
}
