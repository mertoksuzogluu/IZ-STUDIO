# Sunucudaki DATABASE_URL portunu 5433 -> 5432 olarak duzeltir ve restart eder
$ConfigPath = Join-Path $PSScriptRoot ".sunucu-config"
$cfg = @{}
foreach ($line in (Get-Content $ConfigPath)) {
    if ($line -match "^\s*([^=]+)=(.*)$") { $cfg[$matches[1].Trim()] = $matches[2].Trim().Trim('"') }
}
$SSH_TARGET = "$($cfg['REMOTE_USER'])@$($cfg['REMOTE_HOST'])"
$REMOTE_PATH = $cfg["REMOTE_PATH"]

Write-Host "DB portu duzeltiliyor (5433 -> 5432)..." -ForegroundColor Cyan
ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "cd $REMOTE_PATH && sed -i 's|localhost:5433|localhost:5432|g' .env.local && sed -i 's|localhost:5433|localhost:5432|g' .env 2>/dev/null; echo '--- .env.local DATABASE_URL ---' && grep DATABASE_URL .env.local && echo '--- Rebuild + restart ---' && npm run build 2>&1 | tail -5 && pm2 restart feelstudio && echo 'OK - TAMAMLANDI'"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Duzeltildi! Simdi tekrar dene:" -ForegroundColor Green
    Write-Host "  https://feelcreativestudio.com/auth/signin" -ForegroundColor White
    Write-Host "  admin@izstudio.com / admin123" -ForegroundColor White
} else {
    Write-Host "Hata! Kod: $LASTEXITCODE" -ForegroundColor Red
}
