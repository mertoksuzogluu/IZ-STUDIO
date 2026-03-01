# Certbot Bağlantı Hatası — Çözüm

Hata: `31.186.11.254: Timeout during connect (likely firewall problem)`

- **31.186.11.254** = Şu an domain’in işaret ettiği IP (Let’s Encrypt bunu gördü).
- **38.242.143.93** = Senin VPS’in (olması gereken).

Ya DNS yanlış IP’ye gidiyor, ya da sunucuda 80/443 kapalı. İkisini de yap.

---

## 1. DNS kontrolü

Bilgisayarında veya sunucuda:

```bash
nslookup feelcreativestudio.com
```

veya:

```bash
dig feelcreativestudio.com +short
```

**Görmek istediğin:** `38.242.143.93`  
**31.186.11.254 görüyorsan:** Domain hâlâ eski/yanlış IP’ye gidiyor.

### DNS 31.186.11.254 ise

- Domain panelinde (Contabo, GoDaddy, Cloudflare vb.) **A kaydını** kontrol et.
- **A** `@` → **38.242.143.93** olmalı (31.186.11.254 değil).
- Cloudflare kullanıyorsan: **Proxy kapalı** (gri bulut) olsun; yoksa IP değişir ve Certbot yine yanlış sunucuya gider.
- Kaydı düzelttikten sonra 5–15 dakika bekle, sonra tekrar `nslookup` / `dig` ile kontrol et.

---

## 2. Sunucuda firewall (80 ve 443 açık olsun)

SSH ile **kendi VPS’ine** bağlan (38.242.143.93):

```bash
ssh root@38.242.143.93
```

Portları aç ve durumu kontrol et:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
sudo ufw status
```

`nginx` çalışıyor mu:

```bash
sudo systemctl status nginx
curl -I http://127.0.0.1:80
```

Yerelde 80 cevap veriyorsa, dışarıdan da erişimi test et (kendi bilgisayarından):

```powershell
curl -I http://38.242.143.93
```

**200** veya **301/302** görmelisin. Timeout alıyorsan firewall veya hostinge bağlı ek kısıtlama var demektir.

---

## 3. DNS doğru + firewall açıkken Certbot’u tekrar çalıştır

Sunucuda:

```bash
cd /var/www/feelstudio
sudo certbot --nginx -d feelcreativestudio.com -d www.feelcreativestudio.com
```

E-posta ve sözleşme adımlarını geç. Bu sefer doğrulama geçmeli.

---

## Kısa özet

| Sorun | Ne yapmalı |
|-------|------------|
| Domain 31.186.11.254’e gidiyor | A kaydını 38.242.143.93 yap; Cloudflare’da proxy kapalı olsun. |
| 80/443 kapalı | `ufw allow 80/tcp`, `ufw allow 443/tcp`, `ufw enable`. |
| İkisi de doğru | `certbot --nginx -d feelcreativestudio.com -d www.feelcreativestudio.com` tekrar dene. |
