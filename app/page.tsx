import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, MapPin, Navigation, Star, Wifi, Coffee, Trees, Mountain, Castle, Bike } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { RoomCard } from '@/components/RoomCard'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { SITE_CONFIG } from '@/lib/config'
import { S } from '@/lib/strings'
import type { Item } from '@/types/database'

export const metadata: Metadata = {
  title: SITE_CONFIG.business.name,
  description: SITE_CONFIG.business.description,
  alternates: { canonical: SITE_CONFIG.url },
  openGraph: {
    title: SITE_CONFIG.business.name,
    description: SITE_CONFIG.business.description,
    url: SITE_CONFIG.url,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': SITE_CONFIG.seo.schemaType,
  name: SITE_CONFIG.business.name,
  description: SITE_CONFIG.business.description,
  url: SITE_CONFIG.url,
  telephone: SITE_CONFIG.business.phone,
  email: SITE_CONFIG.business.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE_CONFIG.business.address,
    addressLocality: SITE_CONFIG.business.city,
    addressRegion: SITE_CONFIG.business.region,
    addressCountry: SITE_CONFIG.business.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: SITE_CONFIG.business.lat,
    longitude: SITE_CONFIG.business.lng,
  },
  priceRange: '$$',
  checkinTime: '14:00',
  checkoutTime: '12:00',
}

async function getRooms(): Promise<Item[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('available', true)
      .order('price', { ascending: true })
      .limit(3)
    if (error) throw error
    return data ?? []
  } catch {
    return []
  }
}

const WHY_US_ICONS: Record<string, React.ReactNode> = {
  MapPin: <MapPin className="h-6 w-6" />,
  Coffee: <Coffee className="h-6 w-6" />,
  Trees: <Trees className="h-6 w-6" />,
  Wifi: <Wifi className="h-6 w-6" />,
}

const EXPERIENCE_ICONS: Record<string, React.ReactNode> = {
  Mountain: <Mountain className="h-7 w-7" />,
  Castle: <Castle className="h-7 w-7" />,
  SkiingIcon: <Mountain className="h-7 w-7" />,
  Bike: <Bike className="h-7 w-7" />,
}

const EXPERIENCE_GRADIENTS = ['ph-room-1', 'ph-room-2', 'ph-room-3', 'ph-room-4']

export default async function HomePage() {
  const rooms = await getRooms()
  const { business, branding } = SITE_CONFIG

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image
            src="/pensiune-background.png"
            alt="Casa din Livadă — vedere panoramică"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-28 md:py-36 text-center">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: 'rgba(212,168,67,0.25)', color: '#f0c860', border: '1px solid rgba(212,168,67,0.4)' }}
          >
            {S.hero.badge}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white leading-tight drop-shadow-md">
            {S.hero.title}
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-4 text-amber-100">{S.hero.subtitle}</p>
          <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {S.hero.body}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              href="/camere"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-base font-semibold transition-all hover:scale-[1.03] active:scale-95"
              style={{ backgroundColor: branding.accentColor, color: '#1a1a1a' }}
            >
              {S.hero.ctaRooms}
            </Link>
            <a
              href={`tel:${business.phone}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold border border-white/40 text-white hover:bg-white/10 transition-all"
            >
              <Phone className="h-4 w-4" />
              {S.hero.ctaBook}
            </a>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-white/70 text-sm ml-2">4.9 · 120+ recenzii</span>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{S.whyUs.title}</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">{S.whyUs.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {S.whyUs.items.map((item) => (
              <div
                key={item.title}
                className="group p-6 rounded-2xl border bg-card hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 text-white"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  {WHY_US_ICONS[item.icon]}
                </div>
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Preview */}
      <section className="py-20 px-4" style={{ backgroundColor: 'oklch(0.97 0.008 88)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{S.rooms.title}</h2>
              <p className="text-muted-foreground">{S.rooms.subtitle}</p>
            </div>
            <Link
              href="/camere"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors hover:bg-primary hover:text-white"
              style={{ borderColor: branding.primaryColor, color: branding.primaryColor }}
            >
              {S.rooms.viewAll}
            </Link>
          </div>
          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room, i) => (
                <RoomCard key={room.id} room={room} gradientIndex={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0,1,2].map((i) => (
                <RoomCard key={i} room={null} gradientIndex={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Experiences */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{S.experiences.title}</h2>
            <p className="text-muted-foreground text-lg">{S.experiences.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {S.experiences.items.map((exp, i) => (
              <div key={exp.title} className="flex gap-5 p-6 rounded-2xl border bg-card hover:shadow-sm transition-all">
                <div className={`shrink-0 h-14 w-14 rounded-xl ${EXPERIENCE_GRADIENTS[i]} flex items-center justify-center text-white`}>
                  {EXPERIENCE_ICONS[exp.icon]}
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">{exp.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4" style={{ backgroundColor: branding.primaryColor }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">{S.testimonials.title}</h2>
            <p className="text-white/70 text-lg">{S.testimonials.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {S.testimonials.items.map((t) => (
              <div key={t.name} className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/20">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/60 text-xs">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{S.location.title}</h2>
            <p className="text-muted-foreground text-lg">{S.location.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: branding.primaryColor }}>
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold mb-0.5">{S.location.address}</p>
                  <p className="text-muted-foreground text-sm">{business.fullAddress}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: branding.primaryColor }}>
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold mb-0.5">{S.location.phone}</p>
                  <a href={`tel:${business.phone}`} className="text-sm hover:underline" style={{ color: branding.primaryColor }}>
                    {business.phoneDisplay}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: branding.primaryColor }}>
                  <Coffee className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold mb-0.5">{S.location.reception}</p>
                  <p className="text-muted-foreground text-sm">{business.schedule}</p>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${business.lat},${business.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: branding.primaryColor }}
              >
                <Navigation className="h-4 w-4" />
                {S.location.directions}
              </a>
            </div>
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border shadow-sm h-72 ph-nature flex items-center justify-center">
              <div className="text-center text-white/80">
                <MapPin className="h-10 w-10 mx-auto mb-2 opacity-60" />
                <p className="font-medium text-sm">{business.city}</p>
                <p className="text-xs opacity-60">{business.region}, România</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA strip */}
      <section className="py-14 px-4" style={{ backgroundColor: branding.accentColor }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#1a1a1a' }}>{S.contact.title}</h2>
          <p className="mb-8 text-sm md:text-base" style={{ color: 'rgba(26,26,26,0.75)' }}>{S.contact.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`tel:${business.phone}`}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <Phone className="h-4 w-4" />
              {business.phoneDisplay}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-sm font-semibold border-2 transition-all hover:scale-[1.02]"
              style={{ borderColor: branding.primaryColor, color: branding.primaryColor, backgroundColor: 'transparent' }}
            >
              Trimite mesaj
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

function Footer() {
  const { business, branding } = SITE_CONFIG
  const navLinks = [
    { href: '/', label: S.nav.home },
    { href: '/camere', label: S.nav.rooms },
    { href: '/despre', label: S.nav.about },
    { href: '/contact', label: S.nav.contact },
  ]
  return (
    <footer style={{ backgroundColor: '#0f1f06' }} className="text-white/60 py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: branding.primaryColor }}
            >
              C
            </div>
            <p className="text-white font-semibold">{business.name}</p>
          </div>
          <p className="text-sm leading-relaxed mb-3">{S.footer.tagline}</p>
          <p className="text-xs">{business.fullAddress}</p>
        </div>
        <div>
          <p className="text-white font-semibold mb-3 text-sm">{S.footer.quickLinks}</p>
          <ul className="space-y-2">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3 text-sm">{S.footer.contact}</p>
          <div className="space-y-2">
            <a href={`tel:${business.phone}`} className="block text-sm hover:text-white transition-colors">
              {business.phoneDisplay}
            </a>
            <a href={`mailto:${business.email}`} className="block text-sm hover:text-white transition-colors">
              {business.email}
            </a>
            <p className="text-xs mt-3">{business.schedule}</p>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs">
        <p>© {new Date().getFullYear()} {business.name}. {S.footer.copyright}</p>
        <div className="flex gap-4">
          <Link href="/admin/login" className="hover:text-white/40 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
