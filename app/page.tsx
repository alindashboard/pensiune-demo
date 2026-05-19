import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone, CheckCircle2, MapPin, Navigation, MessageCircle } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { ItemGrid } from '@/components/ItemGrid'
import { ContactForm } from '@/components/ContactForm'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { SITE_CONFIG } from '@/lib/config'
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

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': SITE_CONFIG.seo.schemaType,
  name: SITE_CONFIG.business.name,
  description: SITE_CONFIG.business.description,
  url: SITE_CONFIG.url,
  telephone: SITE_CONFIG.business.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE_CONFIG.business.address,
    addressLocality: SITE_CONFIG.business.city,
    addressRegion: SITE_CONFIG.business.region,
    addressCountry: SITE_CONFIG.business.country,
  },
}

async function getItems(): Promise<Item[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const items = await getItems()
  const { business, itemLabel, branding, features } = SITE_CONFIG

  const benefits = [
    'Beneficiu 1',
    'Beneficiu 2',
    'Beneficiu 3',
    'Beneficiu 4',
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Navbar />

      {/* Hero */}
      <section className="bg-slate-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-medium mb-3 tracking-wide uppercase text-sm" style={{ color: branding.primaryColor }}>
            {business.city}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {business.name}
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
            {business.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#items"
              style={{ backgroundColor: branding.primaryColor, color: '#fff', border: '1px solid transparent' }}
              className="inline-flex items-center justify-center w-full sm:w-[260px] text-base font-medium px-8 py-3 rounded-lg transition-transform hover:scale-[1.03]"
            >
              Vezi {itemLabel.plural} disponibile
            </a>
            <a
              href={`tel:${business.phone}`}
              style={{ border: '1px solid rgba(255,255,255,0.35)', color: '#fff', backgroundColor: 'transparent' }}
              className="inline-flex items-center justify-center w-full sm:w-[260px] text-base font-medium px-8 py-3 rounded-lg transition-transform hover:scale-[1.03] hover:bg-white/10"
            >
              <Phone className="h-4 w-4 mr-2" />
              {business.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* Benefits bar */}
      <section className="border-b bg-blue-50 py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 justify-center text-sm font-medium text-blue-900">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              {benefit}
            </div>
          ))}
        </div>
      </section>

      {/* Items listing */}
      <section id="items" className="py-16 px-4 flex-1">
        <div className="max-w-6xl mx-auto">
          {items.length === 0 ? (
            <>
              <h2 className="text-3xl font-bold mb-2">
                {itemLabel.plural.charAt(0).toUpperCase() + itemLabel.plural.slice(1)} disponibile
              </h2>
              <p className="text-muted-foreground mb-10">
                Alege {itemLabel.singular + 'a'} potrivit{itemLabel.priceUnit === 'noapte' ? 'ă' : 'ă'} pentru tine.
              </p>
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg">
                  Nu există {itemLabel.plural} disponibile momentan.
                </p>
                <p className="mt-2">
                  Contactați-ne la{' '}
                  <a href={`tel:${business.phone}`} className="text-primary font-medium">
                    {business.phoneDisplay}
                  </a>{' '}
                  pentru mai multe informații.
                </p>
              </div>
            </>
          ) : (
            <ItemGrid
              items={items}
              title={`${itemLabel.plural.charAt(0).toUpperCase() + itemLabel.plural.slice(1)} disponibile`}
              subtitle={`Alege ${itemLabel.singular + 'a'} potrivit${itemLabel.priceUnit === 'noapte' ? 'ă' : 'ă'} și selectează intervalul de timp.`}
            />
          )}
        </div>
      </section>

      {/* Location */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Unde ne găsești</h2>
          <p className="text-muted-foreground mb-8">{business.address}</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="space-y-5">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Adresă</p>
                  <p className="text-muted-foreground text-sm">{business.fullAddress}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Telefon</p>
                  <a href={`tel:${business.phone}`} className="text-sm text-primary hover:underline">
                    {business.phoneDisplay}
                  </a>
                </div>
              </div>
              {/* Uncomment and set href after you have a Google Maps link */}
              {/* <a
                href="https://maps.app.goo.gl/YOUR_LINK"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <Navigation className="h-4 w-4" />
                Obține direcții
              </a> */}
            </div>
            {/* Uncomment after you have a Google Maps embed URL */}
            {/* <div className="lg:col-span-2 rounded-xl overflow-hidden border shadow-sm h-64 lg:h-80">
              <iframe
                src="https://www.google.com/maps?q=YOUR_BUSINESS_NAME&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={business.name}
              />
            </div> */}
          </div>
        </div>
      </section>

      {/* Contact */}
      {features.contactForm && (
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-bold mb-2">Contactează-ne</h2>
                <p className="text-muted-foreground mb-8">
                  Ai întrebări? Scrie-ne sau sună direct.
                </p>
                <div className="space-y-4">
                  <a
                    href={`tel:${business.phone}`}
                    className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:border-blue-300 transition-colors group"
                  >
                    <div className="h-11 w-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Telefon</p>
                      <p className="text-blue-600 font-medium">{business.phoneDisplay}</p>
                    </div>
                  </a>
                  {features.whatsapp && (
                    <a
                      href={business.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-white border rounded-xl hover:border-green-300 transition-colors group"
                    >
                      <div className="h-11 w-11 rounded-full bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">WhatsApp</p>
                        <p className="text-green-600 font-medium">Trimite mesaj</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Trimite un mesaj</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="text-white font-semibold text-lg mb-1">{business.name}</p>
            <p>{business.address}</p>
            <a
              href={`tel:${business.phone}`}
              className="hover:text-blue-300 transition-colors"
              style={{ color: branding.primaryColor }}
            >
              {business.phoneDisplay}
            </a>
          </div>
          <div className="text-sm">
            <p>© {new Date().getFullYear()} {business.name}. Toate drepturile rezervate.</p>
            <Link href="/admin/login" className="text-slate-600 hover:text-slate-400 text-xs mt-1 block">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
