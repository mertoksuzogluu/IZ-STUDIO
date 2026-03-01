# Paketler listelenemiyor sorununu duzeltir: sunucuda migrate + seed + restart
# Kullanim: PowerShell'de  cd C:\Users\merto\iz-studio   sonra   .\deploy\fix-paketler-listelenemiyor.ps1

$ErrorActionPreference = "Stop"
$SERVER = "root@38.242.143.93"
$REMOTE = "/var/www/feelstudio"

# Proje kokunu bul
$root = if (Test-Path ".\package.json") { (Get-Location).Path } else { "C:\Users\merto\iz-studio" }
if (-not (Test-Path "$root\package.json")) {
    Write-Host "Hata: iz-studio proje klasorunde degilsin. Ornek: cd C:\Users\merto\iz-studio" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Paketler listelenemiyor - Duzeltme ===" -ForegroundColor Cyan
Write-Host "Sunucu: $SERVER" -ForegroundColor Gray
Write-Host "SSH sifre kullaniyorsaniz asagida 3 kez sifreniz sorulacak." -ForegroundColor Gray
Write-Host ""

# 1. Tablolari olustur/guncelle (migrations yoksa db push kullanir)
Write-Host "[1/3] Veritabani semasi uygulanıyor (prisma db push)..." -ForegroundColor Yellow
ssh $SERVER "cd $REMOTE && npx prisma db push"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Hata: db push basarisiz. Sunucuda .env DATABASE_URL dogru mu kontrol et." -ForegroundColor Red
    exit 1
}
Write-Host "      Db push tamamlandi." -ForegroundColor Green

# 3. Seed (paketlerin eklenmesi)
Write-Host ""
Write-Host "[2/3] Seed calistiriliyor (paketler veritabanina yaziliyor)..." -ForegroundColor Yellow
ssh $SERVER "cd $REMOTE && npx prisma db seed"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Hata: seed basarisiz. Sunucuda .env DATABASE_URL dogru mu kontrol et." -ForegroundColor Red
    exit 1
}
Write-Host "      Seed tamamlandi." -ForegroundColor Green

# 4. PM2 restart
Write-Host ""
Write-Host "[3/3] Uygulama yeniden baslatiliyor (pm2 restart)..." -ForegroundColor Yellow
ssh $SERVER "cd $REMOTE && pm2 restart feelstudio"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Uyari: pm2 restart hata verdi; sunucuda 'pm2 list' ile kontrol et." -ForegroundColor Yellow
}
Write-Host "      Restart tamamlandi." -ForegroundColor Green

Write-Host ""
Write-Host "Bitti. https://feelcreativestudio.com/products sayfasini yenile; paketler gorunmeli." -ForegroundColor Cyan
Write-Host ""
