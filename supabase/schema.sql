-- ============================================================
-- Site Template — Generic Schema
-- Run in Supabase SQL Editor (copy-paste the whole file)
-- ============================================================

-- Items table (rename to match your domain: rooms, apartments, cars, etc.)
create table if not exists public.items (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  description   text,
  price         numeric(10, 2) not null,
  price_unit    text not null default 'zi' check (price_unit in ('zi', 'noapte', 'ora')),
  capacity      integer,
  features      text[],
  image_url     text,
  available     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Item images (gallery support)
create table if not exists public.item_images (
  id         uuid primary key default gen_random_uuid(),
  item_id    uuid not null references public.items(id) on delete cascade,
  url        text not null,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

-- Reservations
create table if not exists public.reservations (
  id             uuid primary key default gen_random_uuid(),
  item_id        uuid not null references public.items(id) on delete cascade,
  customer_name  text not null,
  customer_phone text not null,
  customer_email text,
  start_date     date not null,
  end_date       date not null,
  guests         integer,
  total_price    numeric(10, 2),
  status         text not null default 'pending'
                   check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  notes          text,
  created_at     timestamptz not null default now()
);

-- Contact requests
create table if not exists public.contact_requests (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  email      text,
  message    text not null,
  resolved   boolean not null default false,
  created_at timestamptz not null default now()
);

-- Key-value store for editable site settings
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================

create index if not exists reservations_item_id_idx  on public.reservations(item_id);
create index if not exists reservations_dates_idx    on public.reservations(start_date, end_date);
create index if not exists reservations_status_idx   on public.reservations(status);
create index if not exists item_images_item_id_idx   on public.item_images(item_id);
create index if not exists item_images_position_idx  on public.item_images(item_id, position);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.items enable row level security;
alter table public.item_images enable row level security;
alter table public.reservations enable row level security;
alter table public.contact_requests enable row level security;
alter table public.site_settings enable row level security;

-- Public can read available items
create policy "items_public_read" on public.items
  for select using (true);

-- Public can read item images
create policy "item_images_public_read" on public.item_images
  for select using (true);

-- Public can create a reservation
create policy "reservations_public_insert" on public.reservations
  for insert with check (true);

-- Public can create a contact request
create policy "contact_requests_public_insert" on public.contact_requests
  for insert with check (true);

-- Public can read site_settings (for frontend display)
create policy "site_settings_public_read" on public.site_settings
  for select using (true);

-- ============================================================
-- Default site_settings seed
-- ============================================================

insert into public.site_settings (key, value) values
  ('hero_title',    '"Titlul principal al site-ului"'),
  ('hero_subtitle', '"Subtitlul sau tagline-ul afacerii tale."'),
  ('benefits',      '["Beneficiu 1", "Beneficiu 2", "Beneficiu 3", "Beneficiu 4"]'),
  ('maps_embed',    'null')
on conflict (key) do nothing;

-- ============================================================
-- Pensiune Casa din Livadă — Demo seed data
-- Run this section after the schema above
-- ============================================================

insert into public.items (name, description, price, price_unit, capacity, features, available) values
(
  'Camera Dublă Standard',
  'Cameră confortabilă cu pat dublu și baie privată. Vedere la grădina înflorită. Ideală pentru cupluri sau călători solitari care doresc confort la un preț accesibil.',
  250, 'noapte', 2,
  ARRAY['Pat dublu', 'Baie privată', 'TV LED', 'WiFi gratuit', 'Vedere grădină', 'Aer condiționat'],
  true
),
(
  'Camera Dublă Deluxe',
  'Cameră premium cu pat king-size, cadă și balcon privat cu vedere la munți. Minibar, halate și papuci de baie incluși. Ideal pentru o escapadă romantică.',
  350, 'noapte', 2,
  ARRAY['Pat king-size', 'Cadă și duș', 'Balcon privat', 'Minibar', 'Vedere munți', 'WiFi gratuit', 'TV LED', 'Halate & papuci'],
  true
),
(
  'Camera Twin',
  'Cameră cu două paturi single, perfectă pentru prieteni sau colegi de călătorie. Baie privată modernă, spațiu generos.',
  250, 'noapte', 2,
  ARRAY['2 paturi single', 'Baie privată', 'WiFi gratuit', 'TV LED', 'Spațiu depozitare'],
  true
),
(
  'Camera Triplă',
  'Cameră spațioasă cu pat dublu și un pat single, potrivită pentru familii mici sau grupuri de 3. Vedere la livada de meri a pensiunii.',
  350, 'noapte', 3,
  ARRAY['Pat dublu + pat single', 'Baie privată', 'Vedere livadă', 'WiFi gratuit', 'TV LED', 'Masă și scaune'],
  true
),
(
  'Apartamentul Familial',
  'Apartament cu două camere separate, bucătărie complet utilată și terasă privată. Ideal pentru familii cu copii. Loc de joacă la 50 m distanță.',
  450, 'noapte', 4,
  ARRAY['2 camere separate', 'Bucătărie utilată', 'Terasă privată', 'WiFi gratuit', '2 băi', 'TV LED', 'Mașină de spălat', 'Loc de joacă'],
  true
),
(
  'Suite Panoramic',
  'Suita noastră de lux cu jacuzzi, living separat și balcon de 180° cu panoramă montană. Mic dejun servit în cameră inclus. Cea mai romantică alegere din pensiune.',
  500, 'noapte', 2,
  ARRAY['Pat king-size', 'Living separat', 'Jacuzzi', 'Balcon 180° panoramic', 'Mic dejun în cameră', 'WiFi gratuit', 'TV LED 55"', 'Minibar premium', 'Halate & papuci', 'Produse premium baie'],
  true
);
