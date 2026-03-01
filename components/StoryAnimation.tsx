'use client'

import { useEffect, useRef } from 'react'

interface StoryAnimationProps {
  type: 'ask' | 'hatira' | 'cocuk'
  className?: string
}

export default function StoryAnimation({ type, className = '' }: StoryAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) return
  }, [])

  const renderAnimation = () => {
    switch (type) {
      case 'ask':
        // Romantic cartoon characters - two lovers embracing
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-full h-full" style={{ maxWidth: '320px' }}>
              <defs>
                <linearGradient id="romanticBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.08" />
                  <stop offset="50%" stopColor="var(--bg)" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.08" />
                </linearGradient>
                <radialGradient id="romanticGlow">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="skinGradient">
                  <stop offset="0%" stopColor="var(--card)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="var(--card)" stopOpacity="0.7" />
                </radialGradient>
              </defs>
              
              {/* Romantic soft background with glow */}
              <circle cx="200" cy="200" r="160" fill="url(#romanticBg)" className="animate-pulse-slow" />
              <circle cx="200" cy="200" r="140" fill="url(#romanticGlow)" className="animate-pulse-slow" />
              
              {/* Two cartoon lovers */}
              <g className="animate-romantic-float">
                {/* Person 1 (Left) - Female character */}
                <g className="animate-romantic-left">
                  {/* Hair */}
                  <path
                    d="M 120 80 Q 110 60 120 50 Q 130 45 140 50 Q 150 55 150 65 Q 150 75 145 80 L 145 90 Q 140 95 135 90 Q 130 85 125 90 Q 120 95 120 90 Z"
                    fill="#F3EEE6"
                    opacity="0.5"
                  />
                  {/* Head */}
                  <circle cx="135" cy="100" r="28" fill="url(#skinGradient)" />
                  {/* Eyes */}
                  <ellipse cx="128" cy="98" rx="4" ry="6" fill="#0B0B0D" opacity="0.6" />
                  <ellipse cx="142" cy="98" rx="4" ry="6" fill="#0B0B0D" opacity="0.6" />
                  {/* Smile */}
                  <path
                    d="M 125 108 Q 135 112 145 108"
                    stroke="#0B0B0D"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.4"
                    strokeLinecap="round"
                  />
                  {/* Blush */}
                  <ellipse cx="120" cy="105" rx="3" ry="2" fill="var(--accent)" opacity="0.2" />
                  <ellipse cx="150" cy="105" rx="3" ry="2" fill="var(--accent)" opacity="0.2" />
                  
                  {/* Body/Dress */}
                  <path
                    d="M 110 130 Q 135 180 110 230 Q 105 235 110 240 L 160 240 Q 165 235 160 230 Q 135 180 160 130"
                    fill="var(--card)"
                    opacity="0.4"
                    stroke="var(--border)"
                    strokeWidth="1"
                  />
                  
                  {/* Arms - hugging */}
                  <path
                    d="M 160 150 Q 180 140 200 155 Q 195 165 185 160"
                    stroke="var(--card)"
                    strokeWidth="6"
                    fill="none"
                    opacity="0.5"
                    strokeLinecap="round"
                    className="animate-romantic-arm"
                  />
                  <ellipse cx="200" cy="155" rx="8" ry="10" fill="url(#skinGradient)" opacity="0.5" />
                </g>
                
                {/* Person 2 (Right) - Male character */}
                <g className="animate-romantic-right">
                  {/* Hair */}
                  <path
                    d="M 250 80 Q 240 60 250 50 Q 260 45 270 50 Q 280 55 280 65 Q 280 75 275 80 L 275 90 Q 270 95 265 90 Q 260 85 255 90 Q 250 95 250 90 Z"
                    fill="#F3EEE6"
                    opacity="0.4"
                  />
                  {/* Head */}
                  <circle cx="265" cy="100" r="28" fill="url(#skinGradient)" />
                  {/* Eyes */}
                  <ellipse cx="258" cy="98" rx="4" ry="6" fill="#0B0B0D" opacity="0.6" />
                  <ellipse cx="272" cy="98" rx="4" ry="6" fill="#0B0B0D" opacity="0.6" />
                  {/* Smile */}
                  <path
                    d="M 255 108 Q 265 112 275 108"
                    stroke="#0B0B0D"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.4"
                    strokeLinecap="round"
                  />
                  {/* Blush */}
                  <ellipse cx="250" cy="105" rx="3" ry="2" fill="var(--accent)" opacity="0.2" />
                  <ellipse cx="280" cy="105" rx="3" ry="2" fill="var(--accent)" opacity="0.2" />
                  
                  {/* Body/Shirt */}
                  <path
                    d="M 240 130 Q 240 180 240 230 Q 235 235 240 240 L 290 240 Q 295 235 290 230 Q 290 180 290 130 Q 285 125 275 130 Q 265 125 255 130 Q 245 125 240 130"
                    fill="var(--card)"
                    opacity="0.4"
                    stroke="var(--border)"
                    strokeWidth="1"
                  />
                  
                  {/* Arms - hugging */}
                  <path
                    d="M 240 150 Q 220 140 200 155 Q 205 165 215 160"
                    stroke="var(--card)"
                    strokeWidth="6"
                    fill="none"
                    opacity="0.5"
                    strokeLinecap="round"
                    className="animate-romantic-arm"
                  />
                  <ellipse cx="200" cy="155" rx="8" ry="10" fill="url(#skinGradient)" opacity="0.5" />
                </g>
                
                {/* Heart between them */}
                <g className="animate-heart-particles">
                  <path
                    d="M 200,140 C 200,140 185,125 180,130 C 175,135 180,145 200,165 C 220,145 225,135 220,130 C 215,125 200,140 200,140 Z"
                    fill="var(--accent)"
                    opacity="0.3"
                    className="animate-heart-float-1"
                  />
                  <circle cx="180" cy="150" r="3" fill="var(--accent)" opacity="0.25" className="animate-heart-float-2" />
                  <circle cx="220" cy="150" r="3" fill="var(--accent)" opacity="0.25" className="animate-heart-float-3" />
                </g>
              </g>
            </svg>
          </div>
        )

      case 'hatira':
        // Vintage cartoon character - elderly person emerging from photo
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-full h-full" style={{ maxWidth: '320px' }}>
              <defs>
                <linearGradient id="vintageBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="var(--bg)" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.1" />
                </linearGradient>
                <radialGradient id="vintageGlow">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </radialGradient>
                <pattern id="photoTexture" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                  <rect width="30" height="30" fill="var(--fg)" opacity="0.3"/>
                  <circle cx="15" cy="15" r="1.5" fill="var(--muted)" opacity="0.2"/>
                </pattern>
                <radialGradient id="elderlySkin">
                  <stop offset="0%" stopColor="var(--card)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="var(--card)" stopOpacity="0.6" />
                </radialGradient>
              </defs>
              
              {/* Nostalgic vintage background */}
              <circle cx="200" cy="200" r="160" fill="url(#vintageBg)" className="animate-pulse-slow" />
              <circle cx="200" cy="200" r="150" fill="url(#vintageGlow)" className="animate-pulse-slow" />
              
              {/* Vintage photo frame */}
              <g className="animate-photo-frame">
                {/* Outer frame */}
                <rect x="80" y="80" width="240" height="240" fill="var(--muted)" opacity="0.15" rx="12" stroke="var(--border)" strokeWidth="2" />
                {/* Inner frame */}
                <rect x="100" y="100" width="200" height="200" fill="url(#photoTexture)" rx="6" />
                {/* Vintage corners */}
                <path d="M 100 100 L 120 100 L 120 120 L 100 120 Z" fill="var(--accent)" opacity="0.2" />
                <path d="M 300 100 L 280 100 L 280 120 L 300 120 Z" fill="var(--accent)" opacity="0.2" />
                <path d="M 100 300 L 120 300 L 120 280 L 100 280 Z" fill="var(--accent)" opacity="0.2" />
                <path d="M 300 300 L 280 300 L 280 280 L 300 280 Z" fill="var(--accent)" opacity="0.2" />
              </g>
              
              {/* Person in photo (static, faded) */}
              <g className="photo-person-static" opacity="0.25">
                <circle cx="200" cy="160" r="35" fill="url(#elderlySkin)" />
                {/* Simple features */}
                <ellipse cx="190" cy="155" rx="5" ry="7" fill="var(--fg)" opacity="0.3" />
                <ellipse cx="210" cy="155" rx="5" ry="7" fill="var(--fg)" opacity="0.3" />
                <path d="M 195 170 Q 200 175 205 170" stroke="var(--fg)" strokeWidth="2" fill="none" opacity="0.25" />
                <ellipse cx="200" cy="210" rx="25" ry="40" fill="var(--card)" opacity="0.25" />
              </g>
              
              {/* Elderly person emerging - cartoon style */}
              <g className="animate-emerge-realistic">
                {/* Head emerging */}
                <g className="animate-head-emerge">
                  <circle cx="200" cy="140" r="40" fill="url(#elderlySkin)" opacity="0.75" />
                  {/* Wrinkles/age lines */}
                  <path d="M 175 130 Q 200 125 225 130" stroke="var(--muted)" strokeWidth="1" fill="none" opacity="0.3" />
                  <path d="M 180 145 Q 200 140 220 145" stroke="var(--muted)" strokeWidth="1" fill="none" opacity="0.3" />
                  {/* Eyes - kind, wise */}
                  <ellipse cx="188" cy="145" rx="6" ry="8" fill="var(--fg)" opacity="0.6" />
                  <ellipse cx="212" cy="145" rx="6" ry="8" fill="var(--fg)" opacity="0.6" />
                  {/* Eye highlights */}
                  <ellipse cx="190" cy="143" rx="2" ry="3" fill="var(--card)" opacity="0.7" />
                  <ellipse cx="214" cy="143" rx="2" ry="3" fill="var(--card)" opacity="0.7" />
                  {/* Eyebrows */}
                  <path d="M 182 138 Q 188 135 194 138" stroke="var(--muted)" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
                  <path d="M 206 138 Q 212 135 218 138" stroke="var(--muted)" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
                  {/* Warm smile */}
                  <path
                    d="M 185 160 Q 200 170 215 160"
                    stroke="var(--fg)"
                    strokeWidth="2.5"
                    fill="none"
                    opacity="0.5"
                    strokeLinecap="round"
                  />
                  {/* White hair/beard */}
                  <path
                    d="M 160 120 Q 150 100 160 90 Q 170 85 180 90 Q 190 95 200 100 Q 210 95 220 90 Q 230 85 240 90 Q 250 100 240 120"
                    fill="var(--card)"
                    opacity="0.5"
                  />
                  <path
                    d="M 175 170 Q 200 180 225 170 Q 220 190 200 195 Q 180 190 175 170"
                    fill="var(--card)"
                    opacity="0.4"
                  />
                </g>
                
                {/* Body emerging */}
                <g className="animate-body-emerge">
                  {/* Vintage clothing */}
                  <path
                    d="M 170 180 Q 200 220 170 280 Q 165 285 170 290 L 230 290 Q 235 285 230 280 Q 200 220 230 180 Q 225 175 215 180 Q 205 175 195 180 Q 185 175 175 180"
                    fill="var(--muted)"
                    opacity="0.4"
                    stroke="var(--border)"
                    strokeWidth="1"
                  />
                  {/* Vest/waistcoat details */}
                  <path d="M 200 200 L 200 250" stroke="var(--card)" strokeWidth="2" opacity="0.25" />
                </g>
                
                {/* Outstretched hand - reaching out */}
                <g className="animate-hand-reach">
                  <ellipse cx="250" cy="200" rx="15" ry="25" fill="url(#elderlySkin)" opacity="0.6" />
                  <ellipse cx="260" cy="195" rx="8" ry="12" fill="url(#elderlySkin)" opacity="0.5" />
                  {/* Fingers */}
                  <ellipse cx="265" cy="185" rx="3" ry="8" fill="url(#elderlySkin)" opacity="0.5" />
                  <ellipse cx="270" cy="188" rx="3" ry="8" fill="url(#elderlySkin)" opacity="0.5" />
                </g>
                
                {/* Magical sparkles */}
                <g className="animate-sparkles">
                  <circle cx="150" cy="120" r="3" fill="var(--accent)" opacity="0.4" className="animate-sparkle-1" />
                  <circle cx="250" cy="120" r="3" fill="var(--accent)" opacity="0.4" className="animate-sparkle-2" />
                  <circle cx="140" cy="180" r="2" fill="var(--accent)" opacity="0.35" className="animate-sparkle-3" />
                  <circle cx="260" cy="180" r="2" fill="var(--accent)" opacity="0.35" className="animate-sparkle-4" />
                </g>
              </g>
              
              {/* Vintage light rays */}
              <g className="animate-light-rays" opacity="0.15">
                <line x1="200" y1="80" x2="200" y2="100" stroke="var(--accent)" strokeWidth="2" />
                <line x1="170" y1="90" x2="180" y2="110" stroke="var(--accent)" strokeWidth="1.5" />
                <line x1="230" y1="90" x2="220" y2="110" stroke="var(--accent)" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        )

      case 'cocuk':
        // Playful cartoon characters - mother and child playing
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-full h-full" style={{ maxWidth: '320px' }}>
              <defs>
                <linearGradient id="playfulBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.1" />
                  <stop offset="30%" stopColor="var(--bg)" stopOpacity="0.06" />
                  <stop offset="70%" stopColor="var(--bg)" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.1" />
                </linearGradient>
                <radialGradient id="playfulGlow1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="playfulGlow2">
                  <stop offset="0%" stopColor="var(--card)" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="var(--card)" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="sunGradient">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="childSkin">
                  <stop offset="0%" stopColor="var(--card)" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="var(--card)" stopOpacity="0.75" />
                </radialGradient>
              </defs>
              
              {/* Playful cheerful background */}
              <circle cx="200" cy="200" r="170" fill="url(#playfulBg)" className="animate-pulse-slow" />
              <circle cx="150" cy="150" r="100" fill="url(#playfulGlow1)" className="animate-pulse-slow" />
              <circle cx="250" cy="250" r="100" fill="url(#playfulGlow2)" className="animate-pulse-slow" />
              
              {/* Bright sun */}
              <circle cx="300" cy="100" r="40" fill="url(#sunGradient)" className="animate-sun-glow" />
              <circle cx="300" cy="100" r="25" fill="var(--accent)" opacity="0.2" />
              
              {/* Ground */}
              <path
                d="M 50 280 Q 100 275 150 280 Q 200 275 250 280 Q 300 275 350 280"
                stroke="var(--card)"
                strokeWidth="3"
                fill="none"
                opacity="0.15"
                className="animate-ground-line"
              />
              
              {/* Mother and child - cartoon style */}
              <g className="animate-playful-walk">
                {/* Mother (Left) */}
                <g className="animate-mother-walk">
                  {/* Hair */}
                  <path
                    d="M 120 120 Q 110 100 120 90 Q 130 85 140 90 Q 150 95 155 105 Q 155 115 150 120 L 150 130 Q 145 135 140 130 Q 135 125 130 130 Q 125 135 120 130 Z"
                    fill="var(--card)"
                    opacity="0.5"
                  />
                  {/* Head */}
                  <circle cx="135" cy="140" r="32" fill="url(#childSkin)" />
                  {/* Eyes */}
                  <ellipse cx="128" cy="138" rx="5" ry="7" fill="var(--fg)" opacity="0.6" />
                  <ellipse cx="142" cy="138" rx="5" ry="7" fill="var(--fg)" opacity="0.6" />
                  <ellipse cx="130" cy="136" rx="2" ry="3" fill="var(--card)" opacity="0.8" />
                  <ellipse cx="144" cy="136" rx="2" ry="3" fill="var(--card)" opacity="0.8" />
                  {/* Smile */}
                  <path
                    d="M 125 150 Q 135 156 145 150"
                    stroke="var(--fg)"
                    strokeWidth="2.5"
                    fill="none"
                    opacity="0.4"
                    strokeLinecap="round"
                  />
                  
                  {/* Body (dress) */}
                  <path
                    d="M 110 175 Q 135 240 110 300 Q 105 305 110 310 L 160 310 Q 165 305 160 300 Q 135 240 160 175"
                    fill="var(--card)"
                    opacity="0.5"
                    stroke="var(--border)"
                    strokeWidth="1"
                  />
                  
                  {/* Arms */}
                  <path
                    d="M 160 200 Q 180 190 200 210 Q 195 220 185 215"
                    stroke="var(--card)"
                    strokeWidth="8"
                    fill="none"
                    opacity="0.6"
                    strokeLinecap="round"
                    className="animate-arm-swing"
                  />
                  <ellipse cx="200" cy="210" rx="10" ry="12" fill="url(#childSkin)" opacity="0.6" />
                  
                  <path
                    d="M 110 200 Q 90 210 80 220"
                    stroke="var(--card)"
                    strokeWidth="8"
                    fill="none"
                    opacity="0.5"
                    strokeLinecap="round"
                    className="animate-arm-swing-delay"
                  />
                  
                  {/* Legs */}
                  <line x1="125" y1="300" x2="115" y2="330" stroke="var(--card)" strokeWidth="8" opacity="0.6" strokeLinecap="round" className="animate-leg-walk-left" />
                  <line x1="145" y1="300" x2="155" y2="330" stroke="var(--card)" strokeWidth="8" opacity="0.6" strokeLinecap="round" className="animate-leg-walk-right" />
                </g>
                
                {/* Child (Right, smaller) */}
                <g className="animate-child-walk">
                  {/* Hair - messy, playful */}
                  <path
                    d="M 200 160 Q 195 145 200 135 Q 205 130 210 135 Q 215 140 220 150 Q 220 160 215 165 Q 210 170 205 165 Q 200 170 195 165 Q 190 170 185 165 Q 180 160 185 150"
                    fill="var(--card)"
                    opacity="0.5"
                  />
                  {/* Head */}
                  <circle cx="205" cy="170" r="22" fill="url(#childSkin)" />
                  {/* Big eyes - excited */}
                  <ellipse cx="200" cy="168" rx="6" ry="8" fill="var(--fg)" opacity="0.7" />
                  <ellipse cx="210" cy="168" rx="6" ry="8" fill="var(--fg)" opacity="0.7" />
                  <ellipse cx="202" cy="166" rx="2.5" ry="4" fill="var(--card)" opacity="0.8" />
                  <ellipse cx="212" cy="166" rx="2.5" ry="4" fill="var(--card)" opacity="0.8" />
                  {/* Big smile */}
                  <path
                    d="M 195 178 Q 205 185 215 178"
                    stroke="var(--fg)"
                    strokeWidth="2.5"
                    fill="none"
                    opacity="0.5"
                    strokeLinecap="round"
                  />
                  
                  {/* Body */}
                  <ellipse cx="205" cy="210" rx="18" ry="30" fill="var(--card)" opacity="0.55" stroke="var(--border)" strokeWidth="1" />
                  
                  {/* Arms */}
                  <path
                    d="M 185 200 Q 165 190 150 205 Q 155 215 165 210"
                    stroke="var(--card)"
                    strokeWidth="6"
                    fill="none"
                    opacity="0.6"
                    strokeLinecap="round"
                    className="animate-arm-swing"
                  />
                  <ellipse cx="150" cy="205" rx="8" ry="10" fill="url(#childSkin)" opacity="0.6" />
                  
                  <path
                    d="M 225 200 Q 240 195 250 200"
                    stroke="var(--card)"
                    strokeWidth="6"
                    fill="none"
                    opacity="0.5"
                    strokeLinecap="round"
                    className="animate-arm-swing-delay"
                  />
                  
                  {/* Legs - bouncy */}
                  <line x1="198" y1="240" x2="190" y2="270" stroke="var(--card)" strokeWidth="5" opacity="0.6" strokeLinecap="round" className="animate-leg-walk-left" />
                  <line x1="212" y1="240" x2="220" y2="270" stroke="var(--card)" strokeWidth="5" opacity="0.6" strokeLinecap="round" className="animate-leg-walk-right" />
                </g>
                
                {/* Connected hands - heart */}
                <circle cx="175" cy="212" r="6" fill="var(--accent)" opacity="0.4" className="animate-heart-connection" />
                
                {/* Playful elements */}
                <g className="animate-playful-elements">
                  {/* Butterflies */}
                  <g className="animate-butterfly-1">
                    <ellipse cx="80" cy="200" rx="8" ry="12" fill="var(--accent)" opacity="0.3" />
                    <ellipse cx="75" cy="195" rx="6" ry="8" fill="var(--accent)" opacity="0.25" />
                    <ellipse cx="85" cy="195" rx="6" ry="8" fill="var(--accent)" opacity="0.25" />
                  </g>
                  <g className="animate-butterfly-2">
                    <ellipse cx="320" cy="180" rx="8" ry="12" fill="var(--accent)" opacity="0.3" />
                    <ellipse cx="315" cy="175" rx="6" ry="8" fill="var(--accent)" opacity="0.25" />
                    <ellipse cx="325" cy="175" rx="6" ry="8" fill="var(--accent)" opacity="0.25" />
                  </g>
                  {/* Stars */}
                  <path d="M 60 240 L 65 250 L 55 250 Z" fill="var(--accent)" opacity="0.4" className="animate-star-1" />
                  <path d="M 340 220 L 345 230 L 335 230 Z" fill="var(--accent)" opacity="0.4" className="animate-star-2" />
                </g>
              </g>
            </svg>
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
      }}
    >
      {renderAnimation()}
    </div>
  )
}
