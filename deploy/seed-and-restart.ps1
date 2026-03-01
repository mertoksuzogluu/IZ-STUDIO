# Sunucuda Prisma migrate + seed + pm2 restart (paketlerin gorunmesi icin)
# Kullanim: PowerShell'de  cd C:\Users\merto\iz-studio   sonra   .\deploy\seed-and-restart.ps1

$SERVER = "root@38.242.143.93"
$REMOTE = "/var/www/feelstudio"

Write-Host "=== Sunucuda migrate + seed + restart ==="
ssh $SERVER "cd $REMOTE && npx prisma migrate deploy && npx prisma db seed && pm2 restart feelstudio"
Write-Host ""
Write-Host "Bitti. Paketler sayfasini yenile."
