# Ödeme Sistemini Canlıya Alma (iyzico)

## Tek komutla: Canlı ödeme + sipariş temizliği + restart

Windows’ta (proje klasöründen):

```powershell
.\scripts\live-odeme-ve-temizlik.ps1
```

veya:

```powershell
npm run live:odeme-ve-temizlik
```

Bu script: sunucuda `IYZICO_SANDBOX=false` ve `PAYMENT_PROVIDER=iyzico` yapar, tüm siparişleri siler, PM2’yi yeniden başlatır. **Sunucudaki `.env.local` içinde canlı iyzico API key ve secret key’in tanımlı olması gerekir.**

---

## Manuel adımlar

Sitede gerçek ödeme almak için iyzico’yu **sandbox** yerine **canlı** modda kullanmanız gerekir.

## 1. iyzico panelden canlı anahtarları alın

1. [iyzico Merchant Panel](https://merchant.iyzipay.com) → Giriş
2. **Ayarlar** / **API Anahtarları** bölümünden **Canlı** API Key ve Secret Key’i kopyalayın (Sandbox değil).

## 2. Sunucudaki .env dosyasını güncelleyin

Canlı sunucuda (ör. `/var/www/feelstudio/.env.local`) şunları ayarlayın:

```env
PAYMENT_PROVIDER="iyzico"
IYZICO_SANDBOX="false"
IYZICO_API_KEY="canlı-api-key-buraya"
IYZICO_SECRET_KEY="canlı-secret-key-buraya"
```

- `IYZICO_SANDBOX="false"` → Ödeme **canlı** iyzico API’sine gider, gerçek tahsilat yapılır.
- `IYZICO_SANDBOX="true"` veya sandbox key kullanırsanız → Sadece test ortamı (para çekilmez).

## 3. Uygulamayı yeniden başlatın

Env değişince Next.js’in ortam değişkenleri okuması için restart gerekir:

```bash
pm2 restart feelstudio
```

## Özet

| Ortam   | IYZICO_SANDBOX | API Key / Secret   |
|--------|----------------|--------------------|
| Test   | `"true"`       | Sandbox (panelden) |
| Canlı  | `"false"`      | Canlı (panelden)   |

Canlıya geçmeden önce iyzico sözleşmenizin aktif ve mağaza bilgilerinin tam olduğundan emin olun.
