'use client'

import Link from 'next/link'
import { Phone } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/config'

export function Navbar() {
  const { business, branding } = SITE_CONFIG

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 min-w-0 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={branding.logo}
            alt={business.name}
            className="h-10 w-auto"
          />
          <span className="font-bold text-sm hidden sm:inline truncate">{business.name}</span>
        </Link>

        <a
          href={`tel:${business.phone}`}
          style={{ backgroundColor: branding.primaryColor, color: '#fff' }}
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors hover:opacity-90 shrink-0"
        >
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">{business.phoneDisplay}</span>
          <span className="sm:hidden">Sună</span>
        </a>
      </div>
    </header>
  )
}
