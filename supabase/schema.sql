-- BusyBrains Tech-Hub Corporate Services — Database Schema
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)

-- ============================================================
-- 1. SERVICE CATEGORIES (the 9 categories from the brief)
-- ============================================================
create table if not exists service_categories (
  id text primary key,           -- e.g. 'cybersecurity', 'ai-automation'
  name text not null,
  prefix text not null,          -- used in reference codes, e.g. 'CYB', 'AIA'
  sort_order int not null default 0
);

insert into service_categories (id, name, prefix, sort_order) values
  ('cybersecurity', 'Cybersecurity Services', 'CYB', 1),
  ('ai-automation', 'Artificial Intelligence & Automation', 'AIA', 2),
  ('software-it', 'Software & IT Solutions', 'SIT', 3),
  ('digital-marketing', 'Digital Marketing & Branding', 'DMB', 4),
  ('training-consultancy', 'Training & Consultancy', 'TRN', 5),
  ('government-contracts', 'Government Contract Services', 'GOV', 6),
  ('solar-energy', 'Solar Energy Solutions', 'SOL', 7),
  ('crypto-forex', 'Crypto & Forex Services', 'CRF', 8),
  ('business-corporate', 'Business & Corporate Services', 'BIZ', 9),
  ('agriculture', 'Agriculture & Agro-Allied Services', 'AGR', 10)
on conflict (id) do nothing;

-- ============================================================
-- 2. CONSULTATION REQUESTS (the core intake table)
-- ============================================================
create table if not exists consultation_requests (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,   -- e.g. 'REQ-CYB-0042'

  -- client info
  full_name text not null,
  email text not null,
  phone text,
  company_name text,

  -- request details
  service_category_id text not null references service_categories(id),
  request_type text not null check (request_type in ('complaint', 'service_request')),
  subject text not null,
  details text not null,
  preferred_approach text,
  urgency text not null default 'normal' check (urgency in ('low', 'normal', 'high', 'urgent')),

  -- pipeline
  status text not null default 'new' check (status in ('new', 'in_review', 'in_progress', 'completed')),
  assigned_to uuid references auth.users(id),
  internal_notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_consultation_requests_status on consultation_requests(status);
create index if not exists idx_consultation_requests_category on consultation_requests(service_category_id);
create index if not exists idx_consultation_requests_created on consultation_requests(created_at desc);

-- ============================================================
-- 3. REFERENCE CODE GENERATOR
-- Format: REQ-<PREFIX>-<sequential 4-digit number per category>
-- ============================================================
create table if not exists reference_counters (
  category_id text primary key references service_categories(id),
  last_number int not null default 0
);

create or replace function generate_reference_code(p_category_id text)
returns text
language plpgsql
as $$
declare
  v_prefix text;
  v_next int;
  v_code text;
begin
  select prefix into v_prefix from service_categories where id = p_category_id;

  insert into reference_counters (category_id, last_number)
  values (p_category_id, 1)
  on conflict (category_id)
  do update set last_number = reference_counters.last_number + 1
  returning last_number into v_next;

  v_code := 'REQ-' || v_prefix || '-' || lpad(v_next::text, 4, '0');
  return v_code;
end;
$$;

create or replace function before_insert_consultation_request()
returns trigger
language plpgsql
as $$
begin
  if new.reference_code is null or new.reference_code = '' then
    new.reference_code := generate_reference_code(new.service_category_id);
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_before_insert_consultation on consultation_requests;
create trigger trg_before_insert_consultation
  before insert on consultation_requests
  for each row execute function before_insert_consultation_request();

create or replace function before_update_consultation_request()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_before_update_consultation on consultation_requests;
create trigger trg_before_update_consultation
  before update on consultation_requests
  for each row execute function before_update_consultation_request();

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================
alter table consultation_requests enable row level security;
alter table service_categories enable row level security;

drop policy if exists "Public can view service categories" on service_categories;
create policy "Public can view service categories"
  on service_categories for select
  using (true);

drop policy if exists "Public can submit consultation requests" on consultation_requests;
create policy "Public can submit consultation requests"
  on consultation_requests for insert
  with check (true);

drop policy if exists "Staff can view all consultation requests" on consultation_requests;
create policy "Staff can view all consultation requests"
  on consultation_requests for select
  using (auth.role() = 'authenticated');

drop policy if exists "Staff can update consultation requests" on consultation_requests;
create policy "Staff can update consultation requests"
  on consultation_requests for update
  using (auth.role() = 'authenticated');

-- ============================================================
-- 5. STAFF PROFILES (optional — distinguishes you vs admin in UI)
-- ============================================================
create table if not exists staff_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'admin' check (role in ('employee', 'admin'))
);

alter table staff_profiles enable row level security;

drop policy if exists "Staff can view all profiles" on staff_profiles;
create policy "Staff can view all profiles"
  on staff_profiles for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- 6. TESTIMONIALS (public feedback form — separate from case tracking)
-- ============================================================
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text,
  company text,
  rating int not null check (rating between 1 and 5),
  message text not null,
  created_at timestamptz not null default now()
);

alter table testimonials enable row level security;

drop policy if exists "Public can submit testimonials" on testimonials;
create policy "Public can submit testimonials"
  on testimonials for insert
  with check (true);

drop policy if exists "Staff can view testimonials" on testimonials;
create policy "Staff can view testimonials"
  on testimonials for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- 7. NEWSLETTER SUBSCRIBERS
-- ============================================================
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

drop policy if exists "Public can subscribe to newsletter" on newsletter_subscribers;
create policy "Public can subscribe to newsletter"
  on newsletter_subscribers for insert
  with check (true);

drop policy if exists "Staff can view newsletter subscribers" on newsletter_subscribers;
create policy "Staff can view newsletter subscribers"
  on newsletter_subscribers for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- DONE. After running this:
-- 1. Go to Authentication > Users in Supabase dashboard
-- 2. Manually create 2 users (your email + admin's email) with passwords
-- 3. Copy their UUIDs and run:
--    insert into staff_profiles (id, display_name, role) values
--      ('your-uuid-here', 'Tobi', 'employee'),
--      ('admin-uuid-here', 'Possible', 'admin');
-- ============================================================
