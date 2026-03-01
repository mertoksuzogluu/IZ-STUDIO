'use client'

import { useEffect, useRef } from 'react'

interface Animated3DIconProps {
  type: 'landing' | 'ask' | 'hatira' | 'cocuk'
  className?: string
}

export default function Animated3DIcon({ type, className = '' }: Animated3DIconProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) return

    const container = containerRef.current
    let animationFrame: number
    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }

    const animate = () => {
      currentX += (mouseX - currentX) * 0.1
      currentY += (mouseY - currentY) * 0.1

      const rotateX = currentY * 15
      const rotateY = currentX * 15

      container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

      animationFrame = requestAnimationFrame(animate)
    }

    container.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [])

  const renderIcon = () => {
    switch (type) {
      case 'landing':
        return (
          <div className="relative w-full h-full">
            {/* Film frame icon */}
            <div className="absolute inset-0 border-2 border-cream/30 rounded-sm" />
            <div className="absolute inset-2 border border-cream/20 rounded-sm" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 border-2 border-cream/40 rounded-full animate-pulse" />
            </div>
            <div className="absolute bottom-2 left-2 right-2 h-1 bg-cream/20 rounded" />
            <div className="absolute bottom-4 left-2 right-2 h-1 bg-cream/10 rounded" />
          </div>
        )
      case 'ask':
        return (
          <div className="relative w-full h-full">
            {/* Heart/connection icon */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M50,30 C50,30 35,20 30,30 C25,40 30,50 50,70 C70,50 75,40 70,30 C65,20 50,30 50,30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-cream/40"
              />
              <circle cx="40" cy="45" r="3" fill="currentColor" className="text-cream/60 animate-pulse" />
              <circle cx="60" cy="45" r="3" fill="currentColor" className="text-cream/60 animate-pulse" />
            </svg>
          </div>
        )
      case 'hatira':
        return (
          <div className="relative w-full h-full">
            {/* Photo frame with old photo effect */}
            <div className="absolute inset-0 border-2 border-cream/30 rounded-sm bg-cream/5" />
            <div className="absolute inset-2 border border-cream/20 rounded-sm" />
            <div className="absolute top-3 left-3 right-3 bottom-8 bg-gradient-to-br from-cream/10 to-cream/5 rounded-sm">
              <div className="absolute top-2 left-2 w-12 h-8 bg-cream/20 rounded-sm" />
              <div className="absolute bottom-2 left-2 right-2 h-1 bg-cream/10 rounded" />
              <div className="absolute bottom-4 left-2 right-2 h-1 bg-cream/10 rounded" />
            </div>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-cream/30 rounded" />
          </div>
        )
      case 'cocuk':
        return (
          <div className="relative w-full h-full">
            {/* Storybook/child icon */}
            <div className="absolute inset-0 border-2 border-cream/30 rounded-sm bg-cream/5" />
            <div className="absolute top-2 left-2 right-2 h-1 bg-cream/20 rounded" />
            <div className="absolute top-4 left-2 right-2 h-1 bg-cream/20 rounded" />
            <div className="absolute top-6 left-2 w-8 h-8 border border-cream/30 rounded-full" />
            <div className="absolute bottom-4 left-2 right-2">
              <div className="w-12 h-1 bg-cream/20 rounded mb-1" />
              <div className="w-8 h-1 bg-cream/10 rounded" />
            </div>
            <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-cream/40 rounded-full animate-pulse" />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {renderIcon()}
      </div>
    </div>
  )
}

