# Sunucuda e-posta (SMTP) ayarlarini .env'e ekler. Sifreyi parametre olarak verin.
# Kullanim: cd C:\Users\merto\iz-studio  sonra  .\deploy\set-email-env.ps1 '4L3kCqt_+tr*'
# (Sifreyi repoya yazmayin; sadece calistirirken girin.)

param(
    [Parameter(Mandatory = $true)]
    [string]$SmtpPassword
)

$ErrorActionPreference = "Stop"
$SERVER = "root@38.242.143.93"
$REMOTE = "/var/www/feelstudio"
$root = if (Test-Path ".\package.json") { (Get-Location).Path } else { "C:\Users\merto\iz-studio" }
$scriptPath = Join-Path $root "deploy\set-email-env.sh"
if (-not (Test-Path $scriptPath)) { Write-Host "Hata: deploy/set-email-env.sh bulunamadi." -ForegroundColor Red; exit 1 }

Write-Host "[1/2] set-email-env.sh sunucuya kopyalaniyor..." -ForegroundColor Yellow
scp $scriptPath "${SERVER}:${REMOTE}/deploy/set-email-env.sh"
Write-Host "[2/2] Sunucuda e-posta ayarlari .env'e yaziliyor..." -ForegroundColor Yellow
$escaped = $SmtpPassword -replace "'", "'\\''"
ssh $SERVER "cd $REMOTE && bash deploy/set-email-env.sh '$escaped'"
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Bitti. Gerekirse sunucuda: pm2 restart feelstudio" -ForegroundColor Green
} else {
    Write-Host "Hata olustu." -ForegroundColor Red
    exit 1
}
