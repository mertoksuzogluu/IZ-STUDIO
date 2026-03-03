# =============================================================
# CANLI ÖDEME + SİPARİŞ TEMİZLİĞİ
# 1) Sunucuda ödemeyi canlıya alır (IYZICO_SANDBOX=false)
# 2) Tüm siparişleri siler (test siparişleri)
# 3) PM2 restart
#
# Kullanım:  cd C:\Users\merto\iz-studio
#            .\scripts\live-odeme-ve-temizlik.ps1
#
# Önce: scripts\.sunucu-config ve SSH erişimi gerekli.
# Canlı iyzico API key/secret'ı sunucudaki .env.local'de olmalı.
# =============================================================

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path $PSScriptRoot -Parent

$ConfigPath = Join-Path $PSScriptRoot ".sunucu-config"
if (-not (Test-Path $ConfigPath)) {
    Write-Host "HATA: scripts\.sunucu-config bulunamadi." -ForegroundColor Red
    exit 1
}
$cfg = @{}
foreach ($line in (Get-Content $ConfigPath)) {
    if ($line -match "^\s*([^=]+)=(.*)$") { $cfg[$matches[1].Trim()] = $matches[2].Trim().Trim('"') }
}
$REMOTE_HOST = $cfg["REMOTE_HOST"]
$REMOTE_USER = $cfg["REMOTE_USER"]
$REMOTE_PATH = $cfg["REMOTE_PATH"]
$SSH_TARGET = "$REMOTE_USER@$REMOTE_HOST"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CANLI ÖDEME + SİPARİŞ TEMİZLİĞİ" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sunucu : $SSH_TARGET" -ForegroundColor Gray
Write-Host "  Yol    : $REMOTE_PATH" -ForegroundColor Gray
Write-Host ""

# 1) clear-all-orders.cjs dosyasını sunucuya at
Write-Host "[1/4] clear-all-orders.cjs sunucuya gonderiliyor..." -ForegroundColor Yellow
$localScript = Join-Path $ProjectRoot "scripts\clear-all-orders.cjs"
if (-not (Test-Path $localScript)) {
    Write-Host "HATA: scripts\clear-all-orders.cjs bulunamadi." -ForegroundColor Red
    exit 1
}
scp -o StrictHostKeyChecking=accept-new $localScript "${SSH_TARGET}:${REMOTE_PATH}/scripts/clear-all-orders.cjs"
if ($LASTEXITCODE -ne 0) {
    Write-Host "SCP basarisiz!" -ForegroundColor Red
    exit 1
}
Write-Host "  Gonderildi." -ForegroundColor Green

# 2) Sunucuda: .env.local guncelle (canli odeme)
Write-Host ""
Write-Host "[2/4] .env.local canli odeme icin guncelleniyor..." -ForegroundColor Yellow
$envUpdate = "cd $REMOTE_PATH; if grep -q 'IYZICO_SANDBOX' .env.local 2>/dev/null; then sed -i 's/^IYZICO_SANDBOX=.*/IYZICO_SANDBOX=`"false`"/' .env.local; else echo 'IYZICO_SANDBOX=`"false`"' >> .env.local; fi; if grep -q 'PAYMENT_PROVIDER' .env.local 2>/dev/null; then sed -i 's/^PAYMENT_PROVIDER=.*/PAYMENT_PROVIDER=`"iyzico`"/' .env.local; else echo 'PAYMENT_PROVIDER=`"iyzico`"' >> .env.local; fi; echo '  Ayarlandi.'"
ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET $envUpdate
if ($LASTEXITCODE -ne 0) {
    Write-Host "Env guncelleme basarisiz!" -ForegroundColor Red
    exit 1
}
Write-Host "  Tamamlandi." -ForegroundColor Green

Write-Host ""
Write-Host "[3/4] Tum siparisler siliniyor..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "cd $REMOTE_PATH && node scripts/clear-all-orders.cjs"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Siparis temizligi basarisiz!" -ForegroundColor Red
    exit 1
}
Write-Host "  Tamamlandi." -ForegroundColor Green

Write-Host ""
Write-Host "[4/4] PM2 yeniden baslatiliyor..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "cd $REMOTE_PATH && pm2 restart feelstudio 2>/dev/null || pm2 start ecosystem.config.cjs"
if ($LASTEXITCODE -ne 0) {
    Write-Host "PM2 restart uyari verebilir; sunucuda pm2 status ile kontrol edin." -ForegroundColor Yellow
}
Write-Host "  Tamamlandi." -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ISLEM TAMAMLANDI" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "  - Odeme: Canli (IYZICO_SANDBOX=false)" -ForegroundColor Gray
Write-Host "  - Siparisler: Temizlendi" -ForegroundColor Gray
Write-Host "  - PM2: Restart edildi" -ForegroundColor Gray
Write-Host ""
Write-Host "  Sunucudaki .env.local icinde canli IYZICO_API_KEY ve IYZICO_SECRET_KEY" -ForegroundColor Yellow
Write-Host "  tanimli oldugundan emin olun (iyzico merchant panel -> Canli API anahtarlari)." -ForegroundColor Yellow
Write-Host ""
