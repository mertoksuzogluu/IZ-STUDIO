'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Button from './design-system/Button'
import Container from './design-system/Container'

export default function SiteHeader() {
  const pathname = usePathname()
  const [currentHash, setCurrentHash] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    setCurrentHash(window.location.hash)
    const handleHashChange = () => setCurrentHash(window.location.hash)
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: '/ask', label: 'Aşk' },
    { href: '/hatira', label: 'Hatıra' },
    { href: '/cocuk', label: 'Çocuk' },
    { href: '/#ornekler', label: 'Örnekler' },
    { href: '/#surec', label: 'Süreç' },
    { href: '/sss', label: 'SSS' },
  ]

  const isLinkActive = (href: string) => {
    if (href.startsWith('/#')) {
      return pathname === '/' && currentHash === href.replace('/', '')
    }
    return pathname === href
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[var(--border)]">
        <Container>
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link
              href="/"
              className="text-lg md:text-2xl font-serif text-[var(--fg)] hover:opacity-70 transition-opacity tracking-tight z-50"
            >
              Feel Studio
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-sans transition-colors relative ${
                    isLinkActive(link.href)
                      ? 'text-[var(--fg)]'
                      : 'text-[var(--muted)] hover:text-[var(--fg)]'
                  }`}
                >
                  {link.label}
                  {isLinkActive(link.href) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--fg)]" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              {/* Desktop buttons */}
              {status === "loading" ? (
                <div className="w-20 h-10 bg-[var(--border)] rounded animate-pulse hidden sm:block" />
              ) : session?.user ? (
                <div className="hidden md:flex items-center gap-3">
                  {session.user.role === "admin" && (
                    <Link href="/admin" className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">
                      Admin
                    </Link>
                  )}
                  <Link href="/dashboard">
                    <Button variant="outline" className="text-sm px-4 py-2">Dashboard</Button>
                  </Link>
                  <a href="/api/signout" className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">
                    Çıkış
                  </a>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link href="/products">
                    <Button variant="outline" className="text-sm px-4 py-2">Paketler</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="outline" className="text-sm px-4 py-2">Kayıt Ol</Button>
                  </Link>
                  <Link href="/auth/signin">
                    <Button variant="primary" className="text-sm px-4 py-2">Giriş Yap</Button>
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                type="button"
                className="md:hidden flex items-center justify-center w-11 h-11 -mr-2 rounded-lg active:bg-[var(--border)]/50 touch-manipulation"
                aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((v) => !v)}
              >
                <div className="w-5 h-4 flex flex-col justify-between relative">
                  <span className={`block h-0.5 w-full bg-[var(--fg)] rounded transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                  <span className={`block h-0.5 w-full bg-[var(--fg)] rounded transition-all duration-200 ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                  <span className={`block h-0.5 w-full bg-[var(--fg)] rounded transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile menu - full screen overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'visible' : 'invisible'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[85vw] max-w-[320px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Menu header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-[var(--border)] shrink-0">
            <span className="text-base font-serif text-[var(--fg)]">Menü</span>
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 -mr-2 rounded-lg hover:bg-[var(--border)]/50 active:bg-[var(--border)] touch-manipulation"
              aria-label="Menüyü kapat"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-[var(--fg)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-3.5 rounded-xl text-[15px] font-medium transition-colors touch-manipulation ${
                    isLinkActive(link.href)
                      ? 'bg-[var(--fg)] text-white'
                      : 'text-[var(--fg)] active:bg-[var(--border)]/60'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="h-px bg-[var(--border)] my-4 mx-2" />

            {/* Auth section */}
            {session?.user ? (
              <div className="space-y-0.5">
                {session.user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center px-4 py-3.5 rounded-xl text-[15px] text-[var(--muted)] active:bg-[var(--border)]/60 touch-manipulation"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center px-4 py-3.5 rounded-xl text-[15px] text-[var(--fg)] font-medium active:bg-[var(--border)]/60 touch-manipulation"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <a
                  href="/api/signout"
                  className="flex items-center px-4 py-3.5 rounded-xl text-[15px] text-red-500 active:bg-red-50 touch-manipulation"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Çıkış Yap
                </a>
              </div>
            ) : (
              <div className="space-y-2 px-2">
                <Link
                  href="/products"
                  className="flex items-center px-4 py-3.5 rounded-xl text-[15px] text-[var(--fg)] active:bg-[var(--border)]/60 touch-manipulation"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Paketler
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center px-4 py-3.5 rounded-xl text-[15px] text-[var(--fg)] active:bg-[var(--border)]/60 touch-manipulation"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kayıt Ol
                </Link>
                <Link
                  href="/auth/signin"
                  className="block mt-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="primary" className="w-full py-3.5 text-[15px]">
                    Giriş Yap
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Menu footer */}
          <div className="shrink-0 border-t border-[var(--border)] px-6 py-4">
            <p className="text-xs text-[var(--muted)] text-center">Feel Studio</p>
          </div>
        </div>
      </div>
    </>
  )
}
