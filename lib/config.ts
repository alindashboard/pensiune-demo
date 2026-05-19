export const SITE_CONFIG = {
  url: 'https://pensiune-demo.vercel.app',
  business: {
    name: 'Casa din Livadă',
    legalName: 'CASA DIN LIVADĂ SRL',
    cui: 'RO12345678',
    phone: '+40742000000',
    phoneDisplay: '+40 742 000 000',
    whatsapp: 'https://wa.me/40742000000',
    address: 'Strada Principală 45, Moeciu de Sus',
    fullAddress: 'Strada Principală 45, Moeciu de Sus, Brașov, România',
    schedule: 'Recepție: zilnic 08:00 – 22:00',
    city: 'Moeciu de Sus',
    region: 'Brașov',
    country: 'RO',
    description: 'Pensiune de familie în Moeciu de Sus, la 5 minute de Castelul Bran. Camere confortabile, mic dejun inclus, grădină și terasă cu vedere la munți.',
    email: 'contact@casadinlivada.ro',
    lat: 45.4969,
    lng: 25.3453,
  },
  branding: {
    primaryColor: '#2D5016',
    accentColor: '#D4A843',
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
    keywords: [
      'pensiune Bran', 'cazare Moeciu', 'pensiune Moeciu de Sus',
      'cazare Bran Brașov', 'pensiune familie Bran', 'Casa din Livadă',
    ] as string[],
    schemaType: 'LodgingBusiness',
  },
} as const
