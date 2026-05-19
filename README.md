# Site Template — Next.js 16 + Supabase + Resend

Template generic pentru site-uri cu sistem de rezervări, galerie de produse/servicii și panou de administrare.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · shadcn/ui · Supabase · Resend · Vercel

---

## Pornire rapidă

### 1. Clonează și instalează dependențele

```bash
git clone https://github.com/alindashboard/site-template.git my-project
cd my-project
npm install
```

### 2. Configurează variabilele de mediu

```bash
cp .env.local.example .env.local
```

Completează `.env.local` cu valorile din Supabase Dashboard și Resend.

### 3. Crează baza de date în Supabase

1. Intră în [supabase.com](https://supabase.com) și creează un proiect nou
2. Mergi la **SQL Editor**
3. Copiază conținutul din `supabase/schema.sql` și rulează-l

### 4. Crează bucket de stocare în Supabase

1. Mergi la **Storage** → **New bucket**
2. Denumește-l `items`
3. Bifează **Public bucket**

### 5. Configurează contul de admin

1. Mergi la **Authentication** → **Users** → **Add user**
2. Adaugă email + parolă pentru adminul tău

### 6. Personalizează site-ul

Editează `lib/config.ts`:

```ts
export const SITE_CONFIG = {
  url: 'https://domeniultau.ro',
  business: {
    name: 'Numele Afacerii',
    phone: '+40700000000',
    // ...
  },
  itemLabel: {
    singular: 'cameră',   // sau 'mașină', 'apartament', 'birou'
    plural: 'camere',
    priceUnit: 'noapte',  // sau 'zi', 'ora'
  },
  // ...
}
```

### 7. Pornește local

```bash
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000).

---

## Structura principală

```
app/
  page.tsx                  # Landing page (hero, listing, contact)
  items/[id]/               # Pagina detaliu item + formular rezervare
  rezervare-confirmata/     # Pagina de confirmare după rezervare
  admin/
    dashboard/              # Tabel rezervări (approve/reject/cancel)
    items/                  # CRUD items cu upload imagini
    contact/                # Formulare contact primite

components/
  Navbar.tsx                # Header sticky cu logo și telefon
  ItemCard.tsx              # Card pentru un item în listing
  ItemGrid.tsx              # Grid cu filtre
  ItemImageGallery.tsx      # Galerie imagini cu thumbnails
  BookingForm.tsx           # Formular rezervare cu calendar
  ContactForm.tsx           # Formular contact

lib/
  config.ts                 # ← EDITEAZĂ ASTA PRIMUL
  email.ts                  # Template-uri email (Resend)
  supabase.ts               # Clienți Supabase (browser + admin)
  supabase-server.ts        # Client server (SSR)

supabase/
  schema.sql                # Schema completă + RLS policies
```

---

## Cum adaugi un item nou

1. Accesează `/admin/items` (după autentificare)
2. Click **Adaugă** → completează formularul
3. Adaugă fotografii (principal + suplimentare)
4. Item-ul apare imediat pe pagina principală

---

## Cum gestionezi rezervările

- `/admin/dashboard` — toate rezervările, filtrate pe status
- **Pending** → poți aproba sau respinge
- **Approved** → poți respinge sau anula
- Clienții primesc email automat la rezervare (necesită domeniu verificat în Resend)

---

## Deploy pe Vercel

```bash
npm install -g vercel
vercel
```

Adaugă variabilele din `.env.local` în **Vercel → Settings → Environment Variables**.

---

## Personalizare avansată

### Schimbă culorile

În `lib/config.ts`:
```ts
branding: {
  primaryColor: '#2563eb',  // albastru implicit
  accentColor: '#16a34a',
}
```

### Dezactivează funcționalități

```ts
features: {
  reservations: true,   // pune false dacă nu vrei sistem de rezervări
  contactForm: true,
  gallery: true,
  whatsapp: false,      // ascunde butonul WhatsApp
}
```

### SEO local business

Editează `app/page.tsx` — blocul `localBusinessJsonLd` — cu coordonatele și tipul afacerii tale.
