"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface QRCodeImageProps {
  text: string
  size?: number
  className?: string
}

export default function QRCodeImage({ text, size = 200, className = "" }: QRCodeImageProps) {
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = `/api/qr/generate?text=${encodeURIComponent(text)}`
        setQrUrl(url)
        setIsLoading(false)
      } catch (error) {
        console.error("QR code error:", error)
        setIsLoading(false)
      }
    }

    generateQR()
  }, [text])

  if (isLoading) {
    return (
      <div
        className={`bg-gray-100 animate-pulse rounded ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  if (!qrUrl) {
    return null
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src={qrUrl}
        alt="QR Code"
        width={size}
        height={size}
        className="rounded-lg border border-[var(--border)]"
        unoptimized
      />
    </div>
  )
}

