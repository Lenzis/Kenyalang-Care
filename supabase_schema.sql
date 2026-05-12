-- ============================================================
-- Kenyalang Care — Supabase Database Schema
-- Run this in: Supabase Dashboard > SQL Editor > New query
-- Safe to re-run — uses IF NOT EXISTS and DROP IF EXISTS.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- FIX: Remove the default Supabase trigger that causes
-- "Database error saving new user" during auth.signUp().
-- It tries to INSERT into public.users which does not exist
-- in this project (we use public.citizens instead).
-- ============================================================
drop trigger   if exists on_auth_user_created on auth.users;
drop function  if exists public.handle_new_user() cascade;


-- ============================================================
-- TABLES
-- ============================================================

create table if not exists public.citizens (
  id                      text primary key,
  name                    text not null,
  ic                      text not null unique,
  username                text not null unique,
  password                text not null,
  race                    text,
  religion                text,
  gender                  text,
  mobile                  text,
  email                   text,
  security_name           text,
  permanent_address       text,
  correspondence_address  text,
  profile_image           text,
  image_scale             numeric default 1,
  created_at              timestamptz default now()
);

-- Adds image_scale safely if table already existed before this column was introduced
alter table public.citizens add column if not exists image_scale numeric default 1;

create table if not exists public.admins (
  id                      text primary key,
  name                    text not null,
  email                   text not null unique,
  password                text not null,
  security_name           text,
  mobile                  text,
  permanent_address       text,
  correspondence_address  text,
  created_at              timestamptz default now()
);

create table if not exists public.applications (
  id          text primary key,
  citizen_id  text not null references public.citizens(id) on delete cascade,
  name        text not null,
  status      text not null default 'Pending'
                check (status in ('Pending','Processing','Approved','Rejected')),
  date        text,
  created_at  timestamptz default now()
);

create table if not exists public.login_history (
  id           bigint generated always as identity primary key,
  user_id      text not null,
  user_type    text not null check (user_type in ('citizen','admin')),
  device       text,
  logged_in_at timestamptz default now()
);

create table if not exists public.bug_reports (
  id          bigint generated always as identity primary key,
  citizen_id  text references public.citizens(id) on delete set null,
  description text not null,
  screenshot  text,
  created_at  timestamptz default now()
);


-- ============================================================
-- GRANTS  (needed when tables are created via SQL Editor)
-- ============================================================
grant usage on schema public to anon, authenticated;
grant all on public.citizens      to anon, authenticated;
grant all on public.admins        to anon, authenticated;
grant all on public.applications  to anon, authenticated;
grant all on public.login_history to anon, authenticated;
grant all on public.bug_reports   to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.citizens      enable row level security;
alter table public.admins        enable row level security;
alter table public.applications  enable row level security;
alter table public.login_history enable row level security;
alter table public.bug_reports   enable row level security;

-- Drop existing policies first so re-running this script never errors
drop policy if exists "citizens: allow self-register"  on public.citizens;
drop policy if exists "citizens: read own row"         on public.citizens;
drop policy if exists "citizens: update own row"       on public.citizens;
drop policy if exists "applications: read own"         on public.applications;
drop policy if exists "applications: insert own"       on public.applications;
drop policy if exists "applications: update own"       on public.applications;
drop policy if exists "login_history: insert"          on public.login_history;
drop policy if exists "login_history: select"          on public.login_history;
drop policy if exists "bug_reports: insert"            on public.bug_reports;
drop policy if exists "bug_reports: select"            on public.bug_reports;
drop policy if exists "admins: read"                   on public.admins;

create policy "citizens: allow self-register" on public.citizens for insert with check (true);
create policy "citizens: read own row"        on public.citizens for select using (true);
create policy "citizens: update own row"      on public.citizens for update using (true);

create policy "applications: read own"   on public.applications for select using (true);
create policy "applications: insert own" on public.applications for insert with check (true);
create policy "applications: update own" on public.applications for update using (true);

create policy "login_history: insert" on public.login_history for insert with check (true);
create policy "login_history: select" on public.login_history for select using (true);

create policy "bug_reports: insert" on public.bug_reports for insert with check (true);
create policy "bug_reports: select" on public.bug_reports for select using (true);

create policy "admins: read" on public.admins for select using (true);


-- ============================================================
-- STORAGE BUCKET: profiles  (public bucket for profile pictures)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('profiles', 'profiles', true)
on conflict (id) do update set public = true;

drop policy if exists "profiles: public read" on storage.objects;
drop policy if exists "profiles: upload"      on storage.objects;
drop policy if exists "profiles: update"      on storage.objects;

create policy "profiles: public read" on storage.objects
  for select using (bucket_id = 'profiles');

create policy "profiles: upload" on storage.objects
  for insert with check (bucket_id = 'profiles');

create policy "profiles: update" on storage.objects
  for update using (bucket_id = 'profiles');


-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_citizens_ic          on public.citizens(ic);
create index if not exists idx_citizens_username    on public.citizens(username);
create index if not exists idx_applications_citizen on public.applications(citizen_id);
create index if not exists idx_login_history_user   on public.login_history(user_id);
create index if not exists idx_bug_reports_citizen  on public.bug_reports(citizen_id);


-- ============================================================
-- SEED DATA
-- ============================================================
insert into public.admins
  (id, name, email, password, security_name, mobile, permanent_address, correspondence_address)
values (
  '#KC130001', 'System Administrator', 'admin@sarawak.gov.my', '@Admin123!',
  'ROOT ACCESS', '0198765432',
  'WISMA BAPA MALAYSIA, KUCHING', 'WISMA BAPA MALAYSIA, KUCHING'
)
on conflict (id) do nothing;

insert into public.citizens
  (id, name, ic, username, password, race, religion, gender,
   mobile, email, security_name, permanent_address, correspondence_address)
values (
  'KC-980404135567', 'Elvin Owen', '980404-13-5567', 'elvin13', 'User123!',
  'Chinese', 'Christianity', 'Male', '123456789', 'elvin@example.com',
  'BLUE OCEAN', 'SIBU, SARAWAK', 'JALAN JALAN DI SIBU, SARAWAK'
)
on conflict (id) do nothing;

insert into public.applications (id, citizen_id, name, status, date)
values ('APP-001', 'KC-980404135567', 'Kenyalang Gold Card', 'Approved', '26 Apr 2026')
on conflict (id) do nothing;

insert into public.login_history (user_id, user_type, device, logged_in_at)
values ('KC-980404135567', 'citizen', 'Mac OS', '2026-04-26 14:30:00+08');

insert into public.bug_reports (citizen_id, description, created_at)
values ('KC-980404135567', 'Status not updating on mobile view.', '2026-04-26 00:00:00+08');
