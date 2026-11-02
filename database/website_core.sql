-- Yomi Onalaru website data, isolated from existing ONARU OS business tables.
create schema if not exists website;
revoke all on schema website from public;
grant usage on schema website to anon, authenticated, service_role;

create table if not exists website.staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','editor')),
  created_at timestamptz not null default now()
);
create table if not exists website.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text not null default '',
  featured_image text,
  category_id uuid,
  tags text[] not null default '{}',
  seo_title text,
  seo_description text,
  reading_time integer not null default 5 check(reading_time between 1 and 120),
  status text not null default 'draft' check (status in ('draft','scheduled','published','archived')),
  published_at timestamptz,
  featured boolean not null default false,
  author_id uuid references auth.users(id) on delete set null,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists website.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 255 and email ~* '^[^ @]+@[^ @]+\.[^ @]+$'),
  company text check (char_length(company) <= 160),
  phone text check (char_length(phone) <= 40),
  enquiry_type text not null check (char_length(enquiry_type) between 1 and 60),
  brand text not null default 'personal' check (char_length(brand) between 1 and 70),
  subject text check (char_length(subject) <= 200),
  message text not null check (char_length(message) between 10 and 4000),
  budget text check (char_length(budget) <= 120),
  timeline text check (char_length(timeline) <= 120),
  event_name text check (char_length(event_name) <= 200),
  event_date text check (char_length(event_date) <= 120),
  event_location text check (char_length(event_location) <= 200),
  audience_size text check (char_length(audience_size) <= 60),
  details jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new','reviewing','contacted','meeting','closed')),
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists website_enquiries_created_idx on website.enquiries(created_at desc);
create table if not exists website.enquiry_notes (
 id uuid primary key default gen_random_uuid(),
 enquiry_id uuid not null references website.enquiries(id) on delete cascade,
 author_id uuid references auth.users(id) on delete set null,
 body text not null check (char_length(body) between 1 and 4000),
 created_at timestamptz not null default now()
);
create table if not exists website.settings (
 key text primary key,
 value jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now()
);

alter table website.staff enable row level security;
alter table website.articles enable row level security;
alter table website.enquiries enable row level security;
alter table website.enquiry_notes enable row level security;
alter table website.settings enable row level security;

revoke all on all tables in schema website from anon, authenticated;
grant select on website.staff to authenticated;
grant select on website.articles to anon, authenticated;
grant select,insert,update,delete on website.articles to authenticated;
grant insert on website.enquiries to anon, authenticated;
grant select,update,delete on website.enquiries to authenticated;
grant select,insert on website.enquiry_notes to authenticated;
grant select on website.settings to anon, authenticated;
grant insert,update,delete on website.settings to authenticated;
grant all on all tables in schema website to service_role;

create policy staff_read_self on website.staff for select to authenticated
 using (user_id = (select auth.uid()));
create policy article_read_published on website.articles for select to anon, authenticated
 using (status = 'published' and published_at <= now());
create policy article_staff_read on website.articles for select to authenticated
 using (exists (select 1 from website.staff s where s.user_id = (select auth.uid())));
create policy article_staff_insert on website.articles for insert to authenticated
 with check (exists (select 1 from website.staff s where s.user_id = (select auth.uid()) and s.role in ('owner','admin','editor')));
create policy article_staff_update on website.articles for update to authenticated
 using (exists (select 1 from website.staff s where s.user_id = (select auth.uid()) and s.role in ('owner','admin','editor')))
 with check (exists (select 1 from website.staff s where s.user_id = (select auth.uid()) and s.role in ('owner','admin','editor')));
create policy article_staff_delete on website.articles for delete to authenticated
 using (exists (select 1 from website.staff s where s.user_id = (select auth.uid()) and s.role in ('owner','admin')));

create policy enquiries_public_insert on website.enquiries for insert to anon, authenticated
 with check (status = 'new' and char_length(message) between 10 and 4000 and jsonb_typeof(details) = 'object');
create policy enquiries_staff_read on website.enquiries for select to authenticated
 using (exists (select 1 from website.staff s where s.user_id = (select auth.uid())));
create policy enquiries_staff_update on website.enquiries for update to authenticated
 using (exists (select 1 from website.staff s where s.user_id = (select auth.uid()) and s.role in ('owner','admin')))
 with check (exists (select 1 from website.staff s where s.user_id = (select auth.uid()) and s.role in ('owner','admin')));
create policy enquiries_staff_delete on website.enquiries for delete to authenticated
 using (exists (select 1 from website.staff s where s.user_id = (select auth.uid()) and s.role = 'owner'));
create policy enquiry_notes_staff_read on website.enquiry_notes for select to authenticated
 using (exists (select 1 from website.staff s where s.user_id = (select auth.uid())));
create policy enquiry_notes_staff_insert on website.enquiry_notes for insert to authenticated
 with check (author_id = (select auth.uid()) and exists (select 1 from website.staff s where s.user_id = (select auth.uid())));

create policy website_public_settings on website.settings for select to anon,authenticated
 using (key in ('hero','biography','social','seo','footer','navigation','theme','contact'));
create policy website_staff_settings on website.settings for select to authenticated
 using (exists (select 1 from website.staff s where s.user_id = (select auth.uid())));
create policy website_staff_settings_insert on website.settings for insert to authenticated
 with check (exists (select 1 from website.staff s where s.user_id = (select auth.uid()) and s.role in ('owner','admin','editor')));
create policy website_staff_settings_update on website.settings for update to authenticated
 using (exists (select 1 from website.staff s where s.user_id = (select auth.uid()) and s.role in ('owner','admin','editor')))
 with check (exists (select 1 from website.staff s where s.user_id = (select auth.uid()) and s.role in ('owner','admin','editor')));
create policy website_staff_settings_delete on website.settings for delete to authenticated
 using (exists (select 1 from website.staff s where s.user_id = (select auth.uid()) and s.role = 'owner'));
