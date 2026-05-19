'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Menu, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/config'
import { S } from '@/lib/strings'

const NAV_LINKS = [
  { href: '/', label: S.nav.home },
  { href: '/camere', label: S.nav.rooms },
  { href: '/despre', label: S.nav.about },
  { href: '/contact', label: S.nav.contact },
]

export function Navbar() {
  const { business, branding } = SITE_CONFIG
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/97 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ backgroundColor: branding.primaryColor }}
          >
            C
          </div>
          <div className="hidden sm:block">
            <p className="font-semibold text-sm leading-tight" style={{ color: branding.primaryColor }}>
              {business.name}
            </p>
            <p className="text-xs text-muted-foreground leading-tight">Moeciu de Sus · Brașov</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-primary bg-primary/8 font-semibold'
                  : 'text-slate-700 hover:text-primary hover:bg-primary/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${business.phone}`}
            style={{ backgroundColor: branding.primaryColor, color: '#fff' }}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden lg:inline">{business.phoneDisplay}</span>
            <span className="lg:hidden">Sună</span>
          </a>

          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Meniu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-1 shadow-lg">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-primary bg-primary/8 font-semibold'
                  : 'text-slate-700 hover:text-primary hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${business.phone}`}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-white mt-2"
            style={{ backgroundColor: branding.primaryColor }}
          >
            <Phone className="h-4 w-4" />
            {business.phoneDisplay}
          </a>
        </div>
      )}
    </header>
  )
}
