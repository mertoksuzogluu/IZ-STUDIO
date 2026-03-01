# Domain Bağlama — feelcreativestudio.com

Site VPS’te çalışıyorsa (PM2 + port 3010) aşağıdaki sırayla domain’i bağlayıp HTTPS açabilirsin.

---

## 1. DNS (Domain sağlayıcında)

feelcreativestudio.com’u aldığın yerde (Contabo, GoDaddy, Cloudflare vb.):

| Tür  | Ad / Name | Değer / Value        |
|------|-----------|----------------------|
| **A**   | `@`       | `38.242.143.93` (VPS IP) |
| **A** veya **CNAME** | `www` | `feelcreativestudio.com` veya aynı IP `38.242.143.93` |

Kaydettikten sonra 5–30 dakika (bazen birkaç saat) bekle. Kontrol:  
`ping feelcreativestudio.com` → IP 38.242.143.93 görünmeli.

---

## 2. Sunucuda Nginx + site config

SSH ile bağlan:

```bash
ssh root@38.242.143.93
```

Nginx ve Certbot kur (yoksa):

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

Proje sunucuda `/var/www/feelstudio` ise config’i kopyala ve etkinleştir:

```bash
cd /var/www/feelstudio
sudo cp deploy/nginx-feelcreativestudio.conf /etc/nginx/sites-available/feelcreativestudio.com
sudo ln -sf /etc/nginx/sites-available/feelcreativestudio.com /etc/nginx/sites-enabled/
```

Varsayılan site 80’i kullanıyorsa kapat:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

Test ve yenile:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Tarayıcıda **http://feelcreativestudio.com** açılmalı (henüz HTTPS değil).

---

## 3. SSL (HTTPS)

```bash
sudo certbot --nginx -d feelcreativestudio.com -d www.feelcreativestudio.com
```

E-posta ver, sözleşmeyi kabul et. Certbot Nginx’i otomatik günceller.

Bittiğinde: **https://feelcreativestudio.com** çalışır.

---

## 4. .env kontrolü

Sunucuda proje klasöründe:

```bash
nano /var/www/feelstudio/.env
```

Şunlar doğru olsun:

```env
NEXTAUTH_URL="https://feelcreativestudio.com"
NEXT_PUBLIC_SITE_URL="https://feelcreativestudio.com"
```

Değiştirdiysen uygulamayı yeniden başlat:

```bash
pm2 restart feelstudio
```

---

## Özet

1. **DNS:** A kaydı `@` → `38.242.143.93`, `www` → aynı IP veya CNAME.
2. **Nginx:** Config kopyala, sites-enabled’a linkle, `nginx -t` ve `reload`.
3. **SSL:** `certbot --nginx -d feelcreativestudio.com -d www.feelcreativestudio.com`
4. **.env:** NEXTAUTH_URL ve NEXT_PUBLIC_SITE_URL = `https://feelcreativestudio.com`, gerekirse `pm2 restart feelstudio`.

Bu adımlarla site domain’e bağlı ve HTTPS ile kullanılır hale gelir.
