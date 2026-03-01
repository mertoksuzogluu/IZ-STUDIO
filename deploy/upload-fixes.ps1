# Mixed content fix dosyalarini sunucuya atar.
# Kullanim: PowerShell'de: .\deploy\upload-fixes.ps1
# Sunucu IP ve yol degistirmek icin asagidaki degiskenleri duzenle.

$SERVER = "root@38.242.143.93"
$REMOTE_DIR = "/var/www/feelstudio"

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path $PSScriptRoot -Parent
if (-not (Test-Path "$ProjectRoot\package.json")) {
    $ProjectRoot = "C:\Users\merto\iz-studio"
}
Set-Location $ProjectRoot

Write-Host "Proje: $ProjectRoot"
Write-Host "Hedef: ${SERVER}:${REMOTE_DIR}"
Write-Host ""

$files = @(
    @{ local = "app\api\payment\callback\route.ts"; remote = "app/api/payment/callback/route.ts" },
    @{ local = "app\api\auth\error\route.ts"; remote = "app/api/auth/error/route.ts" },
    @{ local = "lib\qr.ts"; remote = "lib/qr.ts" },
    @{ local = "next.config.js"; remote = "next.config.js" },
    @{ local = "middleware.ts"; remote = "middleware.ts" }
)

foreach ($f in $files) {
    $lp = Join-Path $ProjectRoot $f.local
    if (Test-Path $lp) {
        Write-Host "Gonderiliyor: $($f.local)"
        scp $lp "${SERVER}:${REMOTE_DIR}/$($f.remote)"
    } else {
        Write-Host "Atlandi (bulunamadi): $($f.local)"
    }
}

Write-Host ""
Write-Host "Gonderim bitti. Sunucuda su komutu calistir:"
Write-Host "  ssh $SERVER"
Write-Host "  cd $REMOTE_DIR && bash deploy/server-build-restart.sh"
Write-Host ""
