# Public Assets

Bu klasör statik dosyalarınızı içerir.

## Placeholder Görseller

Aşağıdaki placeholder görselleri eklemeniz gerekmektedir:

- `/placeholder-ask.jpg` - Aşk paketi kart görseli
- `/placeholder-hatira.jpg` - Hatıra paketi kart görseli
- `/placeholder-cocuk.jpg` - Çocuk paketi kart görseli
- `/placeholder-video-1.jpg` - Örnek video 1 thumbnail
- `/placeholder-video-2.jpg` - Örnek video 2 thumbnail
- `/placeholder-video-3.jpg` - Örnek video 3 thumbnail
- `/placeholder-video-4.jpg` - Örnek video 4 thumbnail
- `/placeholder-video-5.jpg` - Örnek video 5 thumbnail
- `/placeholder-video-6.jpg` - Örnek video 6 thumbnail

## Görsel Özellikleri

- **Format**: JPG veya WebP (önerilen)
- **Çözünürlük**: Minimum 1920x1080
- **Boyut**: Optimize edilmiş (mümkünse 500KB altı)
- **Aspect Ratio**: 
  - Kart görselleri: 16:9 (aspect-video)
  - Video thumbnails: 16:9

## Next.js Image Optimizasyonu

Next.js otomatik olarak görselleri optimize eder. `next/image` component'i kullanıldığı için görseller otomatik olarak WebP formatına dönüştürülür ve lazy loading uygulanır.


