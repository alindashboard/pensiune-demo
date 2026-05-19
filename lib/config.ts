export const SITE_CONFIG = {
  url: 'https://example.com',
  business: {
    name: 'Numele Afacerii',
    legalName: 'NUMELE AFACERII SRL',
    cui: 'RO00000000',
    phone: '+40700000000',
    phoneDisplay: '+40 700 000 000',
    whatsapp: 'https://wa.me/40700000000',
    address: 'Orașul tău',
    fullAddress: 'Str. Exemplu, Nr. 1, Orașul tău, România',
    schedule: 'Luni – Vineri · 09:00 – 18:00',
    city: 'Orașul tău',
    region: 'Județul tău',
    country: 'RO',
    description: 'Descrierea scurtă a afacerii tale. Editează în lib/config.ts.',
    email: 'contact@example.com',
  },
  branding: {
    primaryColor: '#2563eb',
    accentColor: '#16a34a',
    logo: '/logo.svg',
  },
  features: {
    reservations: true,
    contactForm: true,
    gallery: true,
    whatsapp: true,
  },
  itemLabel: {
    singular: 'cameră',
    plural: 'camere',
    priceUnit: 'noapte',
  },
  seo: {
    keywords: [] as string[],
    schemaType: 'LocalBusiness',
  },
} as const
