-- =====================================================================
--  Fehintola Onabanjo website – database
--  Run this in Supabase → SQL Editor → New query → Run.
--  Safe to run more than once. It does NOT touch any other tables:
--  every table for this website starts with "fo_".
-- =====================================================================

-- Text in 5 languages is stored as JSON:
--   {"en": "...", "yo": "...", "ig": "...", "ha": "...", "pcm": "..."}

-- ---------- Who is allowed to use the admin ----------
create table if not exists public.fo_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz default now()
);
-- role: 'admin' = full control incl. team; 'editor' = content only
alter table public.fo_admins
  add column if not exists role text not null default 'admin',
  add column if not exists name text,
  add column if not exists added_by text;
alter table public.fo_admins drop constraint if exists fo_admins_role_check;
alter table public.fo_admins add constraint fo_admins_role_check check (role in ('admin', 'editor'));

-- helper: is the logged-in user an admin of this website?
create or replace function public.fo_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.fo_admins where user_id = auth.uid());
$$;

-- helper: is the logged-in user a full 'admin' (can manage the team)?
create or replace function public.fo_is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.fo_admins where user_id = auth.uid() and role = 'admin');
$$;

-- ---------- Site settings (one row) ----------
create table if not exists public.fo_settings (
  id int primary key default 1 check (id = 1),
  tagline jsonb,
  bio jsonb,
  email text,
  phone text,
  audiomack_profile text,
  youtube_channel text,
  socials jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);
insert into public.fo_settings (id) values (1) on conflict (id) do nothing;

alter table public.fo_settings
  add column if not exists logo_url text,
  add column if not exists phone2 text,
  add column if not exists hero_image_1 text,
  add column if not exists hero_image_2 text,
  add column if not exists hero_image_3 text,
  add column if not exists stat_songs int,
  add column if not exists stat_albums int,
  add column if not exists stat_subscribers int,
  add column if not exists stat_views int,
  add column if not exists studio_address text,
  add column if not exists studio_phone text,
  add column if not exists studio_phone2 text,
  add column if not exists studio_whatsapp text,
  add column if not exists studio_hours text,
  add column if not exists studio_tiktok text,
  add column if not exists studio_image text,
  add column if not exists studio_map_url text;

-- ---------- Content ----------
create table if not exists public.fo_events (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  description jsonb,
  venue text,
  city text,
  starts_at timestamptz not null,
  ticket_url text,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists public.fo_awards (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  organization text,
  year int,
  description jsonb,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists public.fo_songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'single' check (type in ('single', 'album', 'ep')),
  cover_url text,
  audiomack_url text not null,
  release_date date,
  created_at timestamptz default now()
);

create table if not exists public.fo_videos (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  youtube_url text not null,
  published_at date,
  created_at timestamptz default now()
);

create table if not exists public.fo_gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption jsonb,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- ---------- Security ----------
-- Everyone can READ the website content.
-- Only users listed in fo_admins can ADD / EDIT / DELETE.
do $$
declare t text;
begin
  foreach t in array array['fo_settings','fo_events','fo_awards','fo_songs','fo_videos','fo_gallery']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "fo public read" on public.%I', t);
    execute format('drop policy if exists "fo admin write" on public.%I', t);
    execute format('create policy "fo public read" on public.%I for select using (true)', t);
    execute format(
      'create policy "fo admin write" on public.%I for all to authenticated using (public.fo_is_admin()) with check (public.fo_is_admin())', t);
  end loop;
end $$;

-- Team: every team member can see the team; only 'admin' role can add,
-- change or remove people (and never themselves).
alter table public.fo_admins enable row level security;
drop policy if exists "fo admins read self" on public.fo_admins;
drop policy if exists "fo team read" on public.fo_admins;
create policy "fo team read" on public.fo_admins
  for select to authenticated using (public.fo_is_admin());
drop policy if exists "fo team add" on public.fo_admins;
create policy "fo team add" on public.fo_admins
  for insert to authenticated with check (public.fo_is_owner());
drop policy if exists "fo team change" on public.fo_admins;
create policy "fo team change" on public.fo_admins
  for update to authenticated using (public.fo_is_owner() and user_id <> auth.uid());
drop policy if exists "fo team remove" on public.fo_admins;
create policy "fo team remove" on public.fo_admins
  for delete to authenticated using (public.fo_is_owner() and user_id <> auth.uid());

-- ---------- Activity log (footprints) ----------
create table if not exists public.fo_activity (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id uuid,
  email text,
  action text not null,      -- insert / update / delete
  entity text not null,      -- which table, e.g. fo_events
  entity_id text,
  label text,                -- title of the item
  changes jsonb              -- for updates: which fields changed
);
create index if not exists fo_activity_created_idx on public.fo_activity (created_at desc);

alter table public.fo_activity enable row level security;
drop policy if exists "fo activity read" on public.fo_activity;
create policy "fo activity read" on public.fo_activity
  for select to authenticated using (public.fo_is_admin());
-- nobody can edit or delete the log from the website

-- Writes a log line automatically whenever anything is added, edited or deleted
create or replace function public.fo_log_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  rec jsonb;
  prev jsonb;
  lbl text;
  changed jsonb;
begin
  rec  := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  prev := case when tg_op = 'UPDATE' then to_jsonb(old) else null end;

  lbl := case
    when tg_table_name = 'fo_settings' then 'Site settings'
    when tg_table_name = 'fo_admins' then coalesce(rec->>'email', '') || ' (' || coalesce(rec->>'role', '') || ')'
    else coalesce(
      rec->'title'->>'en',
      case when jsonb_typeof(rec->'title') = 'string' then rec->>'title' end,
      rec->'caption'->>'en',
      'Photo'
    )
  end;

  if tg_op = 'UPDATE' then
    select coalesce(jsonb_agg(k), '[]'::jsonb) into changed
    from jsonb_object_keys(rec) k
    where k not in ('updated_at') and (rec->k) is distinct from (prev->k);
    if changed = '[]'::jsonb then return null; end if;  -- nothing really changed
  end if;

  insert into public.fo_activity (user_id, email, action, entity, entity_id, label, changes)
  values (
    auth.uid(),
    coalesce(auth.jwt()->>'email', 'system'),
    lower(tg_op),
    tg_table_name,
    rec->>'id',
    left(lbl, 200),
    changed
  );
  return null;
end $$;

do $$
declare t text;
begin
  foreach t in array array['fo_settings','fo_events','fo_awards','fo_songs','fo_videos','fo_gallery','fo_admins']
  loop
    execute format('drop trigger if exists fo_log on public.%I', t);
    execute format('create trigger fo_log after insert or update or delete on public.%I for each row execute function public.fo_log_change()', t);
  end loop;
end $$;

-- =====================================================================
--  LAST STEP – make yourself an admin.
--  1. Authentication → Users → Add user (tick "Auto Confirm User").
--  2. Put that email below, remove the two dashes at the start, and Run
--     just this line (select it, then Run):
--
-- insert into public.fo_admins (user_id, email, role) select id, email, 'admin' from auth.users where email = 'YOUR-EMAIL@example.com' on conflict do nothing;
-- =====================================================================
