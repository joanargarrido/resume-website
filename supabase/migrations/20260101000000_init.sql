-- Resume site schema: content tables, admin allow-list, contact messages, RLS and storage.

create type public.dob_display as enum ('full', 'month_year', 'age', 'hidden');

-- Admin allow-list. Rows are added by hand from the SQL editor (see README).
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Single-row profile table.
create table public.profile (
  id smallint primary key default 1 check (id = 1),
  full_name text not null default '',
  photo_path text,
  date_of_birth date,
  dob_display public.dob_display not null default 'hidden',
  city text,
  headline text,
  bio text,
  linkedin_url text,
  github_url text,
  email_public text,
  cv_path text,
  updated_at timestamptz not null default now()
);

create table public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null,
  field text,
  start_date date not null,
  end_date date,
  description text,
  sort_order integer not null default 0
);

create table public.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  start_date date not null,
  end_date date,
  description text,
  company_url text,
  sort_order integer not null default 0
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  level smallint check (level between 1 and 5),
  sort_order integer not null default 0
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

-- Per-IP rate limiting for the contact form (hashed IPs, server-side only).
create table public.contact_rate_limits (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index contact_rate_limits_ip_idx on public.contact_rate_limits (ip_hash, created_at desc);

create or replace function public.touch_profile()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger profile_touch before update on public.profile
  for each row execute function public.touch_profile();

-- Row Level Security
alter table public.admins enable row level security;
alter table public.profile enable row level security;
alter table public.education enable row level security;
alter table public.experience enable row level security;
alter table public.skills enable row level security;
alter table public.contact_messages enable row level security;
alter table public.contact_rate_limits enable row level security;

-- admins: a user may only see their own row; nobody can write through the API.
create policy "admins read self" on public.admins
  for select using (user_id = auth.uid());

-- Content tables: public read, admin write.
create policy "profile public read" on public.profile for select using (true);
create policy "profile admin write" on public.profile
  for all using (public.is_admin()) with check (public.is_admin());

create policy "education public read" on public.education for select using (true);
create policy "education admin write" on public.education
  for all using (public.is_admin()) with check (public.is_admin());

create policy "experience public read" on public.experience for select using (true);
create policy "experience admin write" on public.experience
  for all using (public.is_admin()) with check (public.is_admin());

create policy "skills public read" on public.skills for select using (true);
create policy "skills admin write" on public.skills
  for all using (public.is_admin()) with check (public.is_admin());

-- Messages: no public access at all. Inserts use the service-role key (bypasses RLS).
create policy "messages admin select" on public.contact_messages
  for select using (public.is_admin());
create policy "messages admin update" on public.contact_messages
  for update using (public.is_admin()) with check (public.is_admin());
create policy "messages admin delete" on public.contact_messages
  for delete using (public.is_admin());

-- contact_rate_limits: RLS on with no policies = service role only.

-- Storage bucket for the photo and CV.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'public-assets', 'public-assets', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do nothing;

create policy "public-assets public read" on storage.objects
  for select using (bucket_id = 'public-assets');
create policy "public-assets admin insert" on storage.objects
  for insert with check (bucket_id = 'public-assets' and public.is_admin());
create policy "public-assets admin update" on storage.objects
  for update using (bucket_id = 'public-assets' and public.is_admin());
create policy "public-assets admin delete" on storage.objects
  for delete using (bucket_id = 'public-assets' and public.is_admin());
