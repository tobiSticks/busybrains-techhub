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
  -- 8. CASE RESPONSES (staff replies emailed to the client)
  -- ============================================================
  create table if not exists case_responses (
    id uuid primary key default gen_random_uuid(),
    consultation_request_id uuid not null references consultation_requests(id) on delete cascade,
    message text not null,
    sent_by uuid references auth.users(id),
    created_at timestamptz not null default now()
  );

  create index if not exists idx_case_responses_request on case_responses(consultation_request_id);

  alter table case_responses enable row level security;

  drop policy if exists "Staff can view case responses" on case_responses;
  create policy "Staff can view case responses"
    on case_responses for select
    using (auth.role() = 'authenticated');

  drop policy if exists "Staff can send case responses" on case_responses;
  create policy "Staff can send case responses"
    on case_responses for insert
    with check (auth.role() = 'authenticated');

  -- ============================================================
  -- 9. LIVE CHAT + UNIFIED TICKETING (Phase 1)
  -- ============================================================

  -- 9a. Internal-only category for chat tickets that haven't been
  -- triaged into a real business line yet. Deliberately NOT shown on
  -- the public site — see lib/services.ts (INTERNAL_CATEGORY_LABELS).
  insert into service_categories (id, name, prefix, sort_order) values
    ('general-inquiry', 'General Inquiry', 'GEN', 0)
  on conflict (id) do nothing;

  -- 9b. Evolve consultation_requests into the unified ticket pipeline:
  -- track where a ticket came from, and allow a chat-originated request type.
  alter table consultation_requests add column if not exists source text not null default 'web_form'
    check (source in ('web_form', 'chat'));

  alter table consultation_requests drop constraint if exists consultation_requests_request_type_check;
  alter table consultation_requests add constraint consultation_requests_request_type_check
    check (request_type in ('complaint', 'service_request', 'chat_inquiry'));

  create index if not exists idx_consultation_requests_source on consultation_requests(source);

  -- 9c. is_staff() — security-definer helper. Needed because Supabase
  -- anonymous-auth sessions (used for chat visitor identity below) still
  -- carry role = 'authenticated' in their JWT, so the old
  -- `auth.role() = 'authenticated'` check used throughout this file would
  -- start admitting anonymous chat visitors into every staff-only table.
  -- security definer + a pinned search_path avoids both that regression
  -- and RLS self-recursion when staff_profiles checks its own policy.
  create or replace function is_staff()
  returns boolean
  language sql
  stable
  security definer
  set search_path = public, pg_temp
  as $$
    select exists (select 1 from staff_profiles where id = auth.uid());
  $$;

  -- 9d. Re-point every existing staff-only policy at is_staff() instead
  -- of auth.role() = 'authenticated'.
  drop policy if exists "Staff can view all consultation requests" on consultation_requests;
  create policy "Staff can view all consultation requests"
    on consultation_requests for select
    using (is_staff());

  drop policy if exists "Staff can update consultation requests" on consultation_requests;
  create policy "Staff can update consultation requests"
    on consultation_requests for update
    using (is_staff());

  drop policy if exists "Staff can view all profiles" on staff_profiles;
  create policy "Staff can view all profiles"
    on staff_profiles for select
    using (is_staff());

  drop policy if exists "Staff can view testimonials" on testimonials;
  create policy "Staff can view testimonials"
    on testimonials for select
    using (is_staff());

  drop policy if exists "Staff can view newsletter subscribers" on newsletter_subscribers;
  create policy "Staff can view newsletter subscribers"
    on newsletter_subscribers for select
    using (is_staff());

  drop policy if exists "Staff can view case responses" on case_responses;
  create policy "Staff can view case responses"
    on case_responses for select
    using (is_staff());

  drop policy if exists "Staff can send case responses" on case_responses;
  create policy "Staff can send case responses"
    on case_responses for insert
    with check (is_staff());

  -- 9e. Chat visitors — thin profile shim keyed by the visitor's
  -- Supabase anonymous-auth user id, same pattern as staff_profiles.
  create table if not exists chat_visitors (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    email text,
    created_at timestamptz not null default now()
  );

  alter table chat_visitors enable row level security;

  drop policy if exists "Visitor can manage own profile" on chat_visitors;
  create policy "Visitor can manage own profile"
    on chat_visitors for all
    using (id = auth.uid())
    with check (id = auth.uid());

  drop policy if exists "Staff can view chat visitors" on chat_visitors;
  create policy "Staff can view chat visitors"
    on chat_visitors for select
    using (is_staff());

  -- 9f. Chat conversations.
  create table if not exists chat_conversations (
    id uuid primary key default gen_random_uuid(),
    visitor_id uuid not null references auth.users(id) on delete cascade,
    consultation_request_id uuid references consultation_requests(id),
    status text not null default 'queued' check (status in ('queued', 'active', 'closed')),
    assigned_to uuid references auth.users(id),
    last_message_at timestamptz,
    created_at timestamptz not null default now(),
    closed_at timestamptz
  );

  create index if not exists idx_chat_conversations_status on chat_conversations(status);
  create index if not exists idx_chat_conversations_visitor on chat_conversations(visitor_id);
  create index if not exists idx_chat_conversations_assigned on chat_conversations(assigned_to);

  alter table chat_conversations enable row level security;

  drop policy if exists "Visitor can view own conversations" on chat_conversations;
  create policy "Visitor can view own conversations"
    on chat_conversations for select
    using (visitor_id = auth.uid());

  drop policy if exists "Visitor can create own conversation" on chat_conversations;
  create policy "Visitor can create own conversation"
    on chat_conversations for insert
    with check (visitor_id = auth.uid());

  drop policy if exists "Staff can view all conversations" on chat_conversations;
  create policy "Staff can view all conversations"
    on chat_conversations for select
    using (is_staff());

  drop policy if exists "Staff can update conversations" on chat_conversations;
  create policy "Staff can update conversations"
    on chat_conversations for update
    using (is_staff());

  -- 9g. Chat messages.
  create table if not exists chat_messages (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null references chat_conversations(id) on delete cascade,
    sender_type text not null check (sender_type in ('visitor', 'agent', 'system')),
    sender_id uuid references auth.users(id),
    body text not null,
    attachment_url text,
    attachment_name text,
    attachment_type text,
    read_at timestamptz,
    created_at timestamptz not null default now()
  );

  create index if not exists idx_chat_messages_conversation_created
    on chat_messages(conversation_id, created_at);

  alter table chat_messages enable row level security;

  drop policy if exists "Participants can view conversation messages" on chat_messages;
  create policy "Participants can view conversation messages"
    on chat_messages for select
    using (
      is_staff()
      or exists (
        select 1 from chat_conversations c
        where c.id = chat_messages.conversation_id and c.visitor_id = auth.uid()
      )
    );

  drop policy if exists "Participants can send conversation messages" on chat_messages;
  create policy "Participants can send conversation messages"
    on chat_messages for insert
    with check (
      (sender_type = 'agent' and is_staff() and sender_id = auth.uid())
      or (
        sender_type = 'visitor'
        and sender_id = auth.uid()
        and exists (
          select 1 from chat_conversations c
          where c.id = chat_messages.conversation_id and c.visitor_id = auth.uid()
        )
      )
    );

  drop policy if exists "Participants can mark messages read" on chat_messages;
  create policy "Participants can mark messages read"
    on chat_messages for update
    using (
      is_staff()
      or exists (
        select 1 from chat_conversations c
        where c.id = chat_messages.conversation_id and c.visitor_id = auth.uid()
      )
    )
    with check (true);

  -- 9h. Realtime — both tables need to be in the publication for
  -- Postgres Changes subscriptions to receive INSERT/UPDATE events.
  do $$
  begin
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and tablename = 'chat_messages'
    ) then
      alter publication supabase_realtime add table chat_messages;
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and tablename = 'chat_conversations'
    ) then
      alter publication supabase_realtime add table chat_conversations;
    end if;
  end $$;

  -- 9i. Storage bucket for chat file/image attachments. Private bucket;
  -- objects are path-scoped as {conversation_id}/{filename} (NOT by
  -- uploader id) — an attachment belongs to the conversation, and both
  -- participants (the visitor and whichever agent replies) need to read
  -- it regardless of who uploaded it.
  insert into storage.buckets (id, name, public)
  values ('chat-attachments', 'chat-attachments', false)
  on conflict (id) do nothing;

  drop policy if exists "Participants can upload attachments" on storage.objects;
  create policy "Participants can upload attachments"
    on storage.objects for insert
    with check (
      bucket_id = 'chat-attachments'
      and (
        is_staff()
        or exists (
          select 1 from chat_conversations c
          where c.id::text = (storage.foldername(name))[1] and c.visitor_id = auth.uid()
        )
      )
    );

  drop policy if exists "Participants can read attachments" on storage.objects;
  create policy "Participants can read attachments"
    on storage.objects for select
    using (
      bucket_id = 'chat-attachments'
      and (
        is_staff()
        or exists (
          select 1 from chat_conversations c
          where c.id::text = (storage.foldername(name))[1] and c.visitor_id = auth.uid()
        )
      )
    );

  -- ============================================================
  -- 10. AI CHATBOT ASSISTANT (Phase 2)
  -- ============================================================

  -- 10a. New conversations start with the AI bot before reaching a human.
  -- chat_messages already allows a null sender_id (the bot has no auth.users
  -- row), so only the check constraints need widening.
  alter table chat_messages drop constraint if exists chat_messages_sender_type_check;
  alter table chat_messages add constraint chat_messages_sender_type_check
    check (sender_type in ('visitor', 'agent', 'system', 'bot'));

  alter table chat_conversations drop constraint if exists chat_conversations_status_check;
  alter table chat_conversations add constraint chat_conversations_status_check
    check (status in ('bot', 'queued', 'active', 'closed'));

  -- No new RLS policies needed: the existing "Participants can view
  -- conversation messages" / is_staff() policies already cover the new
  -- status/sender_type values for select, and every bot-side write goes
  -- through the service-role client (app/api/chat/bot-respond), same as
  -- the ticket-creation path in app/api/chat/start.

  -- ============================================================
  -- DONE. After running this:
  -- 1. Go to Authentication > Users in Supabase dashboard
  -- 2. Manually create 2 users (your email + admin's email) with passwords
  -- 3. Copy their UUIDs and run:
  --    insert into staff_profiles (id, display_name, role) values
  --      ('your-uuid-here', 'Tobi', 'employee'),
  --      ('admin-uuid-here', 'Possible', 'admin');
  -- 4. For live chat to work, go to Authentication > Sign In / Providers
  --    and enable "Anonymous sign-ins" — chat visitors are identified by
  --    an anonymous Supabase auth session, not a regular account.
  -- ============================================================
