$ConfigPath = Join-Path $PSScriptRoot ".sunucu-config"
$cfg = @{}
foreach ($line in (Get-Content $ConfigPath)) {
    if ($line -match "^\s*([^=]+)=(.*)$") { $cfg[$matches[1].Trim()] = $matches[2].Trim().Trim('"') }
}
$SSH_TARGET = "$($cfg['REMOTE_USER'])@$($cfg['REMOTE_HOST'])"
$REMOTE_PATH = $cfg["REMOTE_PATH"]
$ProjectRoot = Split-Path $PSScriptRoot -Parent

Write-Host "=== DOSYA GONDER + TEMIZ BUILD ===" -ForegroundColor Cyan

# Degisen dosyalari gonder
$filesToSend = @(
    "app\api\admin\page-images\route.ts",
    "app\api\admin\hero\route.ts",
    "app\admin\page-images\page.tsx",
    "components\HeroMedia.tsx",
    "middleware.ts"
)

foreach ($f in $filesToSend) {
    $local = Join-Path $ProjectRoot $f
    $remote = $f -replace '\\', '/'
    if (Test-Path $local) {
        Write-Host "  Gonderiliyor: $f" -ForegroundColor Gray
        ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "mkdir -p $REMOTE_PATH/$(Split-Path $remote -Parent)"
        scp -o StrictHostKeyChecking=accept-new $local "${SSH_TARGET}:${REMOTE_PATH}/${remote}"
    }
}

Write-Host "Build + restart..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "cd $REMOTE_PATH && rm -rf .next && npm run build 2>&1 | tail -5 && pm2 restart feelstudio && echo 'BASARILI'"
