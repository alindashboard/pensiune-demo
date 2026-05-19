# SETUP — Pensiune Casa din Livadă

Ghid de deploy pentru site-ul demo pensiune, construit pe `alindashboard/site-template`.

---

## 1. Cerințe prealabile

- Node.js 18+
- Cont [Supabase](https://supabase.com) (gratuit)
- Cont [Vercel](https://vercel.com) (gratuit)
- Cont [Resend](https://resend.com) (gratuit, 3000 emailuri/lună)

---

## 2. Configurare Supabase

### 2.1 Creează proiectul

1. Mergi la [supabase.com](https://supabase.com) → New Project
2. Alege un nume și o regiune apropiată (ex: `eu-central-1`)
3. Salvează parola BD — nu o vei mai vedea

### 2.2 Rulează schema

1. În Supabase Dashboard → **SQL Editor**
2. Copiază întregul conținut din `supabase/schema.sql`
3. Apasă **Run** — creează tabelele, politicile RLS și datele seed (6 camere demo)

### 2.3 Bucket pentru imagini (opțional)

Dacă vrei să încarci imagini reale din panoul admin:

1. **Storage** → New Bucket → Nume: `items` → Public: **ON**
2. Merge cu imaginile uploadate prin `/admin/items`

### 2.4 Colectează cheile

Din **Project Settings → API**:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` (secret!) → `SUPABASE_SERVICE_ROLE_KEY`

---

## 3. Configurare Resend (emailuri)

1. [resend.com](https://resend.com) → Create API Key
2. Verifică un domeniu sau folosește sandbox (`onboarding@resend.dev`) pentru teste
3. Salvează cheia → `RESEND_API_KEY`

---

## 4. Variabile de mediu

Creează fișierul `.env.local` în rădăcina proiectului:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
ADMIN_EMAIL=admin@casadinlivada.ro
```

> **Atenție:** Nu comite `.env.local` în Git. Este deja în `.gitignore`.

---

## 5. Rulare locală

```bash
npm install
npm run dev
```

Site disponibil la [http://localhost:3000](http://localhost:3000)

---

## 6. Deploy pe Vercel

### 6.1 Import proiect

1. [vercel.com](https://vercel.com) → New Project → Import Git Repository
2. Selectează `alindashboard/pensiune-demo`
3. Framework: **Next.js** (detectat automat)

### 6.2 Environment Variables

În Vercel → Settings → Environment Variables, adaugă toate cele 5 variabile din `.env.local`.

### 6.3 Deploy

Apasă **Deploy**. Primul build durează ~2 minute.

---

## 7. Configurare admin

### 7.1 Creează utilizator admin în Supabase

1. **Authentication → Users → Add User**
2. Email + parolă sigură
3. Marchează **Email Confirmed**

### 7.2 Accesează panoul

Mergi la `https://pensiune-demo.vercel.app/admin/login` și autentifică-te cu credențialele de mai sus.

---

## 8. Personalizare

### Informații pensiune

Editează `lib/config.ts` — toate datele de contact, coordonate, culori:

```ts
export const SITE_CONFIG = {
  url: 'https://domeniul-tau.ro',
  business: {
    name: 'Numele Pensiunii',
    phone: '+40700000000',
    email: 'contact@pensiune.ro',
    address: 'Strada, Număr, Localitate',
    lat: 45.0000,
    lng: 25.0000,
    ...
  },
  branding: {
    primaryColor: '#2D5016',   // verde forest
    accentColor: '#D4A843',    // auriu cald
  },
}
```

### Texte UI

Toate textele site-ului se află în `lib/strings.ts`. Editează acolo fără să umbli prin componente.

### Camere

Adaugă/editează camerele direct din `/admin/items` sau prin SQL în Supabase.

### Imagini

Încarcă imagini reale din `/admin/items` → edit cameră → Upload imagine principală / galerie.

---

## 9. Structura proiectului

```
pensiune-demo/
├── app/
│   ├── page.tsx              # Homepage
│   ├── camere/
│   │   ├── page.tsx          # Listă camere
│   │   └── [id]/
│   │       ├── page.tsx      # Detaliu cameră + formular rezervare
│   │       └── actions.ts    # Server action: submitReservation
│   ├── despre/page.tsx       # Pagina "Despre noi"
│   ├── contact/page.tsx      # Pagina Contact
│   ├── confirmare/page.tsx   # Confirmare rezervare
│   └── admin/                # Panou administrare (protejat auth)
├── components/
│   ├── Navbar.tsx
│   ├── RoomCard.tsx
│   ├── BookingForm.tsx
│   ├── ContactForm.tsx
│   └── ...
├── lib/
│   ├── config.ts             # Configurare site
│   ├── strings.ts            # Texte UI (RO)
│   ├── supabase.ts           # Clienți Supabase
│   └── email.ts              # Șabloane email Resend
├── supabase/
│   └── schema.sql            # Schema BD + seed 6 camere
└── proxy.ts                  # Auth middleware (Next.js 16)
```

---

## 10. Domeniu custom (opțional)

1. Vercel → Project → Settings → Domains → Add
2. Configurează DNS conform instrucțiunilor Vercel
3. Actualizează `SITE_CONFIG.url` în `lib/config.ts` și redeploy
