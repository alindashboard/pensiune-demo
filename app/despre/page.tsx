import type { Metadata } from 'next'
import { Car, Trees, Flame, UtensilsCrossed, Baby, Wifi, Coffee, PawPrint } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { SITE_CONFIG } from '@/lib/config'
import { S } from '@/lib/strings'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `${S.about.pageTitle} | ${SITE_CONFIG.business.name}`,
  description: S.about.pageSubtitle,
  alternates: { canonical: `${SITE_CONFIG.url}/despre` },
}

const FACILITY_ICONS: Record<string, React.ReactNode> = {
  Car: <Car className="h-5 w-5" />,
  Trees: <Trees className="h-5 w-5" />,
  Flame: <Flame className="h-5 w-5" />,
  UtensilsCrossed: <UtensilsCrossed className="h-5 w-5" />,
  Baby: <Baby className="h-5 w-5" />,
  Wifi: <Wifi className="h-5 w-5" />,
  Coffee: <Coffee className="h-5 w-5" />,
  PawPrint: <PawPrint className="h-5 w-5" />,
}

export default function DesprePage() {
  const { branding, business } = SITE_CONFIG

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="py-16 px-4" style={{ backgroundColor: branding.primaryColor }}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{S.about.pageTitle}</h1>
            <p className="text-white/70 text-lg">{S.about.pageSubtitle}</p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 px-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">{S.about.title}</h2>
                <div className="space-y-5">
                  {S.about.story.map((paragraph, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden h-56 ph-nature flex items-end">
                  <div className="p-5 bg-gradient-to-t from-black/60 to-transparent w-full rounded-b-2xl">
                    <p className="text-white font-bold">{business.name}</p>
                    <p className="text-white/70 text-sm">{business.city}, {business.region}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl ph-warm h-32 flex items-center justify-center">
                    <span className="text-white font-bold text-sm text-center px-2">Mic dejun inclus</span>
                  </div>
                  <div className="rounded-2xl ph-room-3 h-32 flex items-center justify-center">
                    <span className="text-white font-bold text-sm text-center px-2">Grădină 2000 mp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section className="py-16 px-4" style={{ backgroundColor: 'oklch(0.97 0.008 88)' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">{S.about.facilities.title}</h2>
            <p className="text-muted-foreground text-center mb-10">Tot ce ai nevoie pentru un sejur plăcut</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {S.about.facilities.items.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-card border hover:shadow-sm transition-all"
                >
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    {FACILITY_ICONS[item.icon]}
                  </div>
                  <p className="text-sm font-medium text-center leading-tight">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 px-4 bg-background text-center">
          <h2 className="text-2xl font-bold mb-3">Pregătit să ne vizitezi?</h2>
          <p className="text-muted-foreground mb-8">Rezervă o cameră și bucură-te de experiența Casa din Livadă.</p>
          <Link
            href="/camere"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: branding.primaryColor }}
          >
            {S.rooms.viewAll}
          </Link>
        </section>
      </main>

      <footer style={{ backgroundColor: '#0f1f06' }} className="text-white/60 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between gap-4 text-sm">
          <div>
            <p className="text-white font-semibold mb-1">{business.name}</p>
            <p>{business.address}</p>
          </div>
          <div className="text-right">
            <a href={`tel:${business.phone}`} className="hover:text-white transition-colors block" style={{ color: branding.accentColor }}>
              {business.phoneDisplay}
            </a>
            <p className="text-xs mt-1">© {new Date().getFullYear()} {business.name}</p>
          </div>
        </div>
      </footer>
    </>
  )
}
