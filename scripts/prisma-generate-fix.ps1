# Prisma EPERM cozumu: node_modules'i RENAME et (silme), yeni kur, generate.
# 1) Cursor/VS Code'u TAMAMEN KAPAT (tum pencereler).
# 2) Gorev Yoneticisi'nde node.exe varsa sonlandir.
# 3) PowerShell'i Yonetici olarak ac, bu scripti calistir.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if (Test-Path "node_modules_backup") {
    Write-Host "Eski node_modules_backup siliniyor (deneniyor)..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules_backup" -ErrorAction SilentlyContinue
}

if (Test-Path "node_modules") {
    Write-Host "node_modules -> node_modules_backup olarak yeniden adlandiriliyor..." -ForegroundColor Yellow
    Rename-Item -Path "node_modules" -NewName "node_modules_backup"
}

Write-Host "npm install..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "prisma generate..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Tamamlandi. Eski klasoru silmek icin: Remove-Item -Recurse -Force node_modules_backup" -ForegroundColor Green
