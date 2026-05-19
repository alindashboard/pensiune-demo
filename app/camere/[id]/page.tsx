export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, Check } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { BookingForm } from '@/components/BookingForm'
import { ItemImageGallery } from '@/components/ItemImageGallery'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { SITE_CONFIG } from '@/lib/config'
import { S } from '@/lib/strings'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = createSupabaseAdminClient()
  const { data: item } = await supabase
    .from('items')
    .select('name, description, price, image_url')
    .eq('id', id)
    .single()
  if (!item) return {}

  const { business, url } = SITE_CONFIG
  const title = `${item.name} — ${business.name}`
  const description = item.description ?? `Rezervă ${item.name}. ${item.price} RON/noapte.`
  const pageUrl = `${url}/camere/${id}`

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'website',
      siteName: business.name,
      ...(item.image_url ? { images: [{ url: item.image_url, alt: item.name }] } : {}),
    },
  }
}

export default async function CameraPage({ params }: PageProps) {
  const { id } = await params
  const supabase = createSupabaseAdminClient()

  const [itemResult, reservationsResult, imagesResult] = await Promise.all([
    supabase.from('items').select('*').eq('id', id).single(),
    supabase
      .from('reservations')
      .select('start_date, end_date')
      .eq('item_id', id)
      .in('status', ['pending', 'approved']),
    supabase
      .from('item_images')
      .select('url')
      .eq('item_id', id)
      .order('position', { ascending: true }),
  ])

  if (itemResult.error || !itemResult.data) {
    notFound()
  }

  const item = itemResult.data
  const bookedRanges = reservationsResult.data ?? []
  const additionalImages = (imagesResult.data ?? []).map((r) => r.url)
  const allImages = [item.image_url, ...additionalImages].filter(Boolean) as string[]
  const { branding } = SITE_CONFIG

  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1">
        <Link
          href="/camere"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {S.rooms.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: room details */}
          <div>
            {allImages.length > 0 ? (
              <ItemImageGallery images={allImages} itemName={item.name} />
            ) : (
              <div className={`h-64 rounded-2xl ph-room-${(parseInt(id.slice(-1), 16) % 6) + 1} mb-6 flex items-end`}>
                <div className="p-5 w-full bg-gradient-to-t from-black/50 to-transparent rounded-b-2xl">
                  <p className="text-white font-bold text-xl">{item.name}</p>
                </div>
              </div>
            )}

            <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
            <div className="flex items-baseline gap-1.5 mb-6">
              <span className="text-3xl font-bold" style={{ color: branding.primaryColor }}>{item.price} RON</span>
              <span className="text-muted-foreground">/ {S.rooms.perNight.replace('/', '').trim()}</span>
            </div>

            {item.capacity && (
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Users className="h-5 w-5" />
                <span>
                  {item.capacity} {item.capacity === 1 ? S.rooms.person : S.rooms.persons}
                </span>
              </div>
            )}

            {item.features && item.features.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3">Dotări</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(item.features as string[]).map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 shrink-0" style={{ color: branding.primaryColor }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.description && (
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            )}
          </div>

          {/* Right: booking form */}
          <div className="border rounded-2xl p-6 bg-card shadow-sm h-fit lg:sticky lg:top-24">
            <h2 className="text-xl font-bold mb-6">{S.booking.title}</h2>
            <BookingForm item={item} bookedRanges={bookedRanges} />
          </div>
        </div>
      </main>

      <footer style={{ backgroundColor: '#0f1f06' }} className="text-white/60 py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between gap-4 text-sm">
          <div>
            <p className="text-white font-semibold mb-1">{SITE_CONFIG.business.name}</p>
            <p>{SITE_CONFIG.business.address}</p>
          </div>
          <div className="text-right">
            <a href={`tel:${SITE_CONFIG.business.phone}`} className="hover:text-white transition-colors block" style={{ color: branding.accentColor }}>
              {SITE_CONFIG.business.phoneDisplay}
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
