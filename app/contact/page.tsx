import type { Metadata } from 'next'
import { Phone, MapPin, Mail, Clock, MessageCircle } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { ContactForm } from '@/components/ContactForm'
import { SITE_CONFIG } from '@/lib/config'
import { S } from '@/lib/strings'

export const metadata: Metadata = {
  title: `${S.contact.pageTitle} | ${SITE_CONFIG.business.name}`,
  description: S.contact.pageSubtitle,
  alternates: { canonical: `${SITE_CONFIG.url}/contact` },
}

export default function ContactPage() {
  const { business, branding, features } = SITE_CONFIG

  const contactItems = [
    {
      icon: <Phone className="h-5 w-5" />,
      label: S.location.phone,
      value: business.phoneDisplay,
      href: `tel:${business.phone}`,
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email',
      value: business.email,
      href: `mailto:${business.email}`,
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: S.location.address,
      value: business.fullAddress,
      href: `https://www.google.com/maps/search/?api=1&query=${business.lat},${business.lng}`,
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: S.location.reception,
      value: business.schedule,
      href: null,
    },
  ]

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="py-16 px-4" style={{ backgroundColor: branding.primaryColor }}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{S.contact.pageTitle}</h1>
            <p className="text-white/70 text-lg">{S.contact.pageSubtitle}</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-4 bg-background">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">{S.contact.title}</h2>
              <div className="space-y-4 mb-8">
                {contactItems.map((item) =>
                  item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex gap-4 p-4 rounded-xl border bg-card hover:shadow-sm transition-all group"
                    >
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white"
                        style={{ backgroundColor: branding.primaryColor }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                          {item.label}
                        </p>
                        <p className="font-medium text-sm group-hover:underline">{item.value}</p>
                      </div>
                    </a>
                  ) : (
                    <div key={item.label} className="flex gap-4 p-4 rounded-xl border bg-card">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white"
                        style={{ backgroundColor: branding.primaryColor }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                          {item.label}
                        </p>
                        <p className="font-medium text-sm">{item.value}</p>
                      </div>
                    </div>
                  )
                )}
              </div>

              {features.whatsapp && (
                <a
                  href={business.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Scrie pe WhatsApp
                </a>
              )}
            </div>

            {/* Contact form */}
            <div className="bg-card border rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Trimite un mesaj</h2>
              <ContactForm />
            </div>
          </div>
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
