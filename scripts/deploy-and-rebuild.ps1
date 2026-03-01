$ConfigPath = Join-Path $PSScriptRoot ".sunucu-config"
$cfg = @{}
foreach ($line in (Get-Content $ConfigPath)) {
    if ($line -match "^\s*([^=]+)=(.*)$") { $cfg[$matches[1].Trim()] = $matches[2].Trim().Trim('"') }
}
$SSH_TARGET = "$($cfg['REMOTE_USER'])@$($cfg['REMOTE_HOST'])"
$REMOTE_PATH = $cfg["REMOTE_PATH"]
$ProjectRoot = Split-Path $PSScriptRoot -Parent

Write-Host "=== TAM KAYNAK DEPLOY + TEMIZ BUILD ===" -ForegroundColor Cyan

# Kaynak dosyalari tar'la (node_modules, .next, .env.local HARIC)
$tempDir = Join-Path $env:TEMP "iz-deploy-src"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

$items = @("app","components","lib","middleware.ts","prisma","public","package.json","package-lock.json","ecosystem.config.cjs","next.config.js","tsconfig.json","tailwind.config.ts","tailwind.config.js","postcss.config.mjs","postcss.config.js","scripts")

foreach ($item in $items) {
    $src = Join-Path $ProjectRoot $item
    if (Test-Path $src) {
        $dest = Join-Path $tempDir $item
        $destParent = Split-Path $dest -Parent
        if (-not (Test-Path $destParent)) { New-Item -ItemType Directory -Path $destParent -Force | Out-Null }
        Copy-Item $src $dest -Recurse -Force
    }
}

$tarPath = Join-Path $ProjectRoot "scripts\deploy-src.tar.gz"
if (Test-Path $tarPath) { Remove-Item $tarPath -Force }
Push-Location $tempDir
tar -czf $tarPath *
Pop-Location
Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

$sizeMB = [math]::Round((Get-Item $tarPath).Length / 1MB, 1)
Write-Host "Paket: $sizeMB MB" -ForegroundColor Green

Write-Host "Sunucuya gonderiliyor..." -ForegroundColor Yellow
scp -o StrictHostKeyChecking=accept-new $tarPath "${SSH_TARGET}:${REMOTE_PATH}/deploy-src.tar.gz"
if ($LASTEXITCODE -ne 0) { Write-Host "SCP basarisiz!" -ForegroundColor Red; exit 1 }
Remove-Item $tarPath -Force -ErrorAction SilentlyContinue

Write-Host "Sunucuda: arsiv ac + temiz build + restart..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "cd $REMOTE_PATH && tar -xzf deploy-src.tar.gz && rm -f deploy-src.tar.gz && rm -rf .next && npm install 2>&1 | tail -3 && npx prisma generate 2>&1 | tail -2 && npm run build 2>&1 | tail -8 && pm2 restart feelstudio && echo '' && echo 'DEPLOY BASARILI'"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "BASARILI!" -ForegroundColor Green
} else {
    Write-Host "HATA! Kod: $LASTEXITCODE" -ForegroundColor Red
}
