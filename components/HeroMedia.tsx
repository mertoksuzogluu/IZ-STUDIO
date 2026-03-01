'use client'

import { useEffect, useRef, useState } from 'react'

interface HeroFile {
  name: string
  url: string
  type: 'image' | 'video'
}

interface HeroMediaProps {
  webmSrc?: string
  mp4Src?: string
  posterSrc?: string
  alt: string
  className?: string
  enableParallax?: boolean
  /** Sayfa anahtarı: "hero" | "ask" | "hatira" | "cocuk" — admin panelden yüklenen görseli çeker */
  pageKey?: string
}

export default function HeroMedia({
  webmSrc,
  mp4Src,
  posterSrc,
  alt,
  className = '',
  pageKey = 'hero',
}: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoError, setVideoError] = useState(false)
  const [heroFiles, setHeroFiles] = useState<HeroFile[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/page-images?page=${pageKey}`)
      .then((r) => r.json())
      .then((data) => setHeroFiles(data[pageKey] || []))
      .catch(() => {
        // Eski hero API'den de dene (geriye uyumluluk)
        if (pageKey === 'hero') {
          fetch('/api/admin/hero')
            .then((r) => r.json())
            .then((data) => setHeroFiles(data.files || []))
            .catch(() => {})
        }
      })
      .finally(() => setLoaded(true))
  }, [pageKey])

  const videos = heroFiles.filter((f) => f.type === 'video')
  const images = heroFiles.filter((f) => f.type === 'image')
  const mp4File = videos.find((f) => f.name.endsWith('.mp4'))
  const webmFile = videos.find((f) => f.name.endsWith('.webm'))
  const posterFile = images[0]

  const finalMp4 = mp4Src || mp4File?.url
  const finalWebm = webmSrc || webmFile?.url
  const finalPoster = posterSrc || posterFile?.url
  const hasVideo = (finalWebm && finalWebm.trim()) || (finalMp4 && finalMp4.trim())
  const hasImage = !!finalPoster

  if (!loaded) {
    return (
      <div className={`relative overflow-hidden bg-[var(--border)] animate-pulse ${className}`} style={{ borderRadius: '12px' }} />
    )
  }

  if ((!hasVideo || videoError) && hasImage) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={finalPoster}
          alt={alt}
          className="w-full h-full object-cover"
          style={{ borderRadius: '12px' }}
        />
      </div>
    )
  }

  if (!hasVideo && !hasImage) {
    return (
      <div
        className={`relative overflow-hidden bg-[var(--border)] flex items-center justify-center ${className}`}
        style={{ borderRadius: '12px' }}
        aria-label={alt}
      >
        <div className="text-[var(--muted)] text-sm text-center p-6">
          Admin panelden hero görsel veya video yükleyin.
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster={finalPoster || undefined}
        className="w-full h-full object-cover rounded-xl"
        style={{ borderRadius: '12px' }}
        aria-label={alt}
        onError={() => setVideoError(true)}
      >
        {finalWebm?.trim() && <source src={finalWebm} type="video/webm" />}
        {finalMp4?.trim() && <source src={finalMp4} type="video/mp4" />}
      </video>
    </div>
  )
}
