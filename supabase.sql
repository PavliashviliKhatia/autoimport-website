-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.
-- 1) Replace OWNER_EMAIL below with her login email (3 places).

create table if not exists cars (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  make text not null,
  model text not null,
  year int,
  price int default 0,
  miles int default 0,
  fuel text default 'Gasoline',
  trans text default 'Automatic',
  status text default 'available' check (status in ('available','transit','sold')),
  description text default '',
  images text[] default '{}'
);

alter table cars enable row level security;
create policy "public can read cars" on cars for select using (true);
create policy "owner can change cars" on cars for all to authenticated
  using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL')
  with check ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');

insert into storage.buckets (id, name, public) values ('cars', 'cars', true) on conflict do nothing;
create policy "public can see photos" on storage.objects for select using (bucket_id = 'cars');
create policy "owner can manage photos" on storage.objects for all to authenticated
  using (bucket_id = 'cars' and (auth.jwt() ->> 'email') = 'OWNER_EMAIL')
  with check (bucket_id = 'cars' and (auth.jwt() ->> 'email') = 'OWNER_EMAIL');

-- Customer requests ("notify me when a matching car appears")
create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  contact text not null,
  request text not null,
  max_total int
);
alter table alerts enable row level security;
create policy "anyone can send a request" on alerts for insert to anon, authenticated
  with check (char_length(contact) < 200 and char_length(request) < 1000);
create policy "owner reads requests" on alerts for select to authenticated
  using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');
create policy "owner deletes requests" on alerts for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');

-- Price Alert upgrade (run this too)
alter table cars add column if not exists auction text default '';
alter table cars add column if not exists damage text default '';
alter table alerts add column if not exists make_model text default '';
alter table alerts add column if not exists year_from int;
alter table alerts add column if not exists max_price int;
alter table alerts add column if not exists auction text default 'any';
alter table alerts add column if not exists damage text default '';
alter table alerts add column if not exists channel text default 'WhatsApp';

-- Verified Seller / trust system (run this too)
alter table cars add column if not exists vin text default '';
alter table cars add column if not exists real_photos boolean default false;
alter table cars add column if not exists vin_checked boolean default false;
alter table cars add column if not exists inspection boolean default false;

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  rating int not null check (rating between 1 and 5),
  text text not null,
  car text default '',
  approved boolean default false,
  verified_buyer boolean default false
);
alter table reviews enable row level security;
create policy "anyone can submit a review" on reviews for insert to anon, authenticated
  with check (approved = false and verified_buyer = false and char_length(name) < 80 and char_length(text) < 800);
create policy "public reads approved reviews" on reviews for select using (approved = true);
create policy "owner reads all reviews" on reviews for select to authenticated
  using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');
create policy "owner updates reviews" on reviews for update to authenticated
  using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL') with check ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');
create policy "owner deletes reviews" on reviews for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');

-- Car Market Radar (weekly snapshots written by the cron job with the service-role key)
create table if not exists radar (
  model text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);
alter table radar enable row level security;
create policy "public reads radar" on radar for select using (true);

-- Home page collections + listing details (run this too)
alter table cars add column if not exists old_price int;
alter table cars add column if not exists damage_level text default '';
alter table cars add column if not exists featured boolean default false;
alter table cars add column if not exists video_url text default '';
alter table cars add column if not exists history text default '';

-- ===== Platform directions: requests, order tracking, market, services, finance (run this too) =====
create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  type text not null,
  contact text not null,
  details text not null,
  extra text default '',
  handled boolean default false
);
alter table requests enable row level security;
create policy "anyone can send a request form" on requests for insert to anon, authenticated
  with check (type in ('lot','order','parts','dealer') and handled = false and char_length(contact) < 200 and char_length(details) < 1500 and char_length(extra) < 300);
create policy "owner reads request forms" on requests for select to authenticated using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');
create policy "owner updates request forms" on requests for update to authenticated using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL') with check ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');
create policy "owner deletes request forms" on requests for delete to authenticated using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  code text unique not null,
  customer text default '',
  car text not null,
  stage int default 0,
  notes text default '',
  stage_dates jsonb default '{}',
  updated_at timestamptz default now()
);
alter table orders enable row level security;
create policy "owner manages orders" on orders for all to authenticated
  using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL') with check ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');

create table if not exists market_listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  make text not null, model text not null, year int, price int, miles int,
  city text default '', description text default '', contact text not null,
  images text[] default '{}',
  approved boolean default false
);
alter table market_listings enable row level security;
create policy "anyone can submit a listing" on market_listings for insert to anon, authenticated
  with check (approved = false and char_length(contact) < 200 and char_length(description) < 1500);
create policy "public reads approved listings" on market_listings for select using (approved = true);
create policy "owner reads all listings" on market_listings for select to authenticated using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');
create policy "owner updates listings" on market_listings for update to authenticated using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL') with check ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');
create policy "owner deletes listings" on market_listings for delete to authenticated using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');

insert into storage.buckets (id, name, public) values ('market', 'market', true) on conflict do nothing;
create policy "public sees market photos" on storage.objects for select using (bucket_id = 'market');
create policy "anyone can upload market photos" on storage.objects for insert to anon, authenticated with check (bucket_id = 'market');
-- Tip: Supabase -> Storage -> market -> set "file size limit" to 1 MB and allow only image/jpeg.

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null, kind text not null, city text default '', phone text default '',
  address text default '', note text default '',
  approved boolean default true
);
alter table services enable row level security;
create policy "public reads services" on services for select using (approved = true);
create policy "owner manages services" on services for all to authenticated
  using ((auth.jwt() ->> 'email') = 'OWNER_EMAIL') with check ((auth.jwt() ->> 'email') = 'OWNER_EMAIL');

alter table cars add column if not exists cost_buy int;
alter table cars add column if not exists cost_ship int;
alter table cars add column if not exists cost_customs int;
alter table cars add column if not exists cost_repair int;

-- Order tracking: container / carrier / vessel (run this too)
alter table orders add column if not exists container text default '';
alter table orders add column if not exists carrier text default '';
alter table orders add column if not exists vessel text default '';
