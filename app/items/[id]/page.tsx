export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { BookingForm } from '@/components/BookingForm'
import { ItemImageGallery } from '@/components/ItemImageGallery'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { SITE_CONFIG } from '@/lib/config'

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

  const { business, itemLabel, url } = SITE_CONFIG
  const title = `${item.name} — ${business.name}`
  const description =
    item.description ??
    `Rezervă ${item.name}. ${item.price} RON/${itemLabel.priceUnit}.`
  const pageUrl = `${url}/items/${id}`

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

export default async function ItemPage({ params }: PageProps) {
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

  const { itemLabel } = SITE_CONFIG

  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Înapoi la toate {itemLabel.plural}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: item details */}
          <div>
            <ItemImageGallery images={allImages} itemName={item.name} />

            <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-primary">{item.price} RON</span>
              <span className="text-muted-foreground">/ {itemLabel.priceUnit}</span>
            </div>

            {item.capacity && (
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Users className="h-5 w-5" />
                <span>Capacitate: {item.capacity} {item.capacity === 1 ? 'persoană' : 'persoane'}</span>
              </div>
            )}

            {item.features && item.features.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Dotări</p>
                <div className="flex flex-wrap gap-2">
                  {item.features.map((f: string) => (
                    <span key={f} className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.description && (
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            )}
          </div>

          {/* Right: booking form */}
          <div className="border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">
              Rezervă {itemLabel.singular === 'cameră' ? 'această cameră' : `acest${itemLabel.singular.endsWith('ă') ? 'ă' : ''} ${itemLabel.singular}`}
            </h2>
            <BookingForm item={item} bookedRanges={bookedRanges} />
          </div>
        </div>
      </main>
    </>
  )
}
