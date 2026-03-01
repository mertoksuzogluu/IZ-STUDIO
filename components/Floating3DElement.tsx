'use client'

import { useEffect, useRef, useState } from 'react'

interface Floating3DElementProps {
  children: React.ReactNode
  intensity?: number
  className?: string
}

export default function Floating3DElement({
  children,
  intensity = 15,
  className = '',
}: Floating3DElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const isReduced = mediaQuery.matches
    setReducedMotion(isReduced)

    if (isReduced || !elementRef.current) return

    const element = elementRef.current
    let animationFrame: number
    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0
    let floatOffset = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      mouseX = ((e.clientX - centerX) / rect.width) * 2
      mouseY = ((e.clientY - centerY) / rect.height) * 2
    }

    const animate = () => {
      currentX += (mouseX - currentX) * 0.1
      currentY += (mouseY - currentY) * 0.1
      floatOffset += 0.01

      const rotateX = currentY * intensity
      const rotateY = currentX * intensity
      const floatY = Math.sin(floatOffset) * 5

      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${floatY}px) translateZ(0)`

      animationFrame = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [intensity])

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}

