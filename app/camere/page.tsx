export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { RoomCard } from '@/components/RoomCard'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { SITE_CONFIG } from '@/lib/config'
import { S } from '@/lib/strings'
import type { Item } from '@/types/database'

export const metadata: Metadata = {
  title: `${S.rooms.title} | ${SITE_CONFIG.business.name}`,
  description: `${S.rooms.subtitle} — ${SITE_CONFIG.business.description}`,
  alternates: { canonical: `${SITE_CONFIG.url}/camere` },
  openGraph: {
    title: `${S.rooms.title} | ${SITE_CONFIG.business.name}`,
    description: S.rooms.subtitle,
    url: `${SITE_CONFIG.url}/camere`,
  },
}

async function getRooms(): Promise<Item[]> {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('items')
    .select('*')
    .order('price', { ascending: true })
  return data ?? []
}

export default async function CamerePage() {
  const rooms = await getRooms()
  const available = rooms.filter((r) => r.available)
  const unavailable = rooms.filter((r) => !r.available)
  const { branding } = SITE_CONFIG

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Page header */}
        <section className="py-14 px-4" style={{ backgroundColor: branding.primaryColor }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{S.rooms.title}</h1>
            <p className="text-white/70 text-lg">{S.rooms.subtitle}</p>
          </div>
        </section>

        <section className="py-12 px-4 bg-background flex-1">
          <div className="max-w-6xl mx-auto">
            {rooms.length === 0 ? (
              <p className="text-muted-foreground text-center py-20">{S.rooms.noRooms}</p>
            ) : (
              <>
                {available.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                      {S.rooms.available} ({available.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {available.map((room, i) => (
                        <RoomCard key={room.id} room={room} gradientIndex={i} />
                      ))}
                    </div>
                  </div>
                )}
                {unavailable.length > 0 && (
                  <div className="opacity-70">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-400 inline-block" />
                      {S.rooms.unavailable}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {unavailable.map((room, i) => (
                        <RoomCard key={room.id} room={room} gradientIndex={available.length + i} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function Footer() {
  const { business, branding } = SITE_CONFIG
  return (
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
  )
}
