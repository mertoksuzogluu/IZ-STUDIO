# Sunucuda domain kurulumu (DNS yapıldıktan sonra)

## Tek komut (sunucuda)

Proje sunucuda **/var/www/feelstudio** içindeyse, SSH ile bağlanıp:

```bash
cd /var/www/feelstudio && bash deploy/setup-domain.sh
```

Certbot e-posta soracak; yazıp sözleşmeyi kabul et. Bitti.

---

## Proje sunucuda başka yerdeyse

```bash
cd /yol/proje  # örn. /root/feelstudio
PROJECT_DIR=$(pwd) bash deploy/setup-domain.sh
```

---

## E-posta vermek istemiyorsan (sorunsuz çalıştır)

```bash
cd /var/www/feelstudio
CERTBOT_EMAIL=sen@email.com bash deploy/setup-domain.sh
```

---

## deploy klasörü sunucuda yoksa

Bilgisayarından güncel projeyi (veya sadece `deploy` klasörünü) sunucuya at:

```powershell
scp -r C:\Users\merto\iz-studio\deploy root@38.242.143.93:/var/www/feelstudio/
```

Sonra sunucuda:

```bash
cd /var/www/feelstudio && bash deploy/setup-domain.sh
```

---

## Canlıda .env ve PM2 (her şeyi ayarla)

Sunucuda NEXTAUTH_URL / NEXT_PUBLIC_SITE_URL’i https://feelcreativestudio.com yapıp uygulamayı yeniden başlat:

```bash
cd /var/www/feelstudio && bash deploy/set-env-production.sh
```

---

## Certbot’a e-posta ekle (sertifika bitmeden hatırlatma)

Certbot ilk kurulumda e-posta sormadıysa, sonradan eklemek için (varsayılan: mertoksuzogluu@gmail.com):

```bash
sudo bash deploy/certbot-add-email.sh
```

Farklı e-posta: `CERTBOT_EMAIL=baska@email.com sudo bash deploy/certbot-add-email.sh`
