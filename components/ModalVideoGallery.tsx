'use client'

import { useState, useEffect } from 'react'

/** Gerçek kapak yok (boş veya 1x1 placeholder); videonun ilk karesi kullanılacak. */
function isPlaceholderThumbnail(url: string | undefined): boolean {
  if (!url || typeof url !== 'string') return true
  const t = url.trim()
  if (!t) return true
  if (t.startsWith('data:image/png;base64,iVBORw0KGgo')) return true
  if (t.startsWith('data:image') && t.length < 300) return true
  return false
}

interface VideoItem {
  id: string
  thumbnail: string
  webmSrc?: string
  mp4Src?: string
  title?: string
}

interface ModalVideoGalleryProps {
  items: VideoItem[]
}

export default function ModalVideoGallery({ items }: ModalVideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)

  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedVideo])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const videoSrc = item.mp4Src || item.webmSrc
          const hasRealCover = item.thumbnail?.trim() && !isPlaceholderThumbnail(item.thumbnail)
          return (
            <button
              key={item.id}
              onClick={() => setSelectedVideo(item)}
              className="relative w-full min-w-0 aspect-video overflow-hidden rounded-sm group cursor-pointer"
              aria-label={item.title || 'Video oynat'}
            >
              <div className="absolute inset-0 w-full h-full">
                {hasRealCover ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title || 'Video önizleme'}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                ) : videoSrc ? (
                  <video
                    key={`${item.id}-${videoSrc}`}
                    src={videoSrc}
                    preload="auto"
                    muted
                    playsInline
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    aria-hidden
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--border)]" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )
        })}
      </div>

      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Video oynatıcı"
        >
          <div
            className="relative max-w-4xl w-full aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
              aria-label="Kapat"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {(selectedVideo.webmSrc || selectedVideo.mp4Src) ? (
              <video
                key={selectedVideo.id + (selectedVideo.mp4Src || selectedVideo.webmSrc || '')}
                autoPlay
                playsInline
                controls
                className="w-full h-full object-contain bg-black"
                src={selectedVideo.mp4Src || selectedVideo.webmSrc}
              >
                {selectedVideo.webmSrc && <source src={selectedVideo.webmSrc} type="video/webm" />}
                {selectedVideo.mp4Src && <source src={selectedVideo.mp4Src} type="video/mp4" />}
              </video>
            ) : (
              <div className="w-full h-full bg-gray-100 border border-[var(--border)] flex items-center justify-center rounded-lg">
                <p className="text-[var(--muted)]">Video yakında eklenecek</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

