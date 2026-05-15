create table if not exists public.properties (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    price text not null,
    location text not null,
    square_meters text not null,
    operation_type text not null check (operation_type in ('Venta', 'Alquiler')),
    whatsapp_url text not null,
    images jsonb not null default '[]'::jsonb,
    video_url text,
    is_featured boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.hero_content (
    id text primary key default 'main',
    title text not null,
    subtitle text not null,
    button_text text not null,
    background_url text not null,
    background_type text not null check (background_type in ('imagen', 'gif', 'video')),
    updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists set_properties_updated_at on public.properties;
create trigger set_properties_updated_at
before update on public.properties
for each row
execute function public.set_updated_at();

drop trigger if exists set_hero_content_updated_at on public.hero_content;
create trigger set_hero_content_updated_at
before update on public.hero_content
for each row
execute function public.set_updated_at();

alter table public.properties enable row level security;
alter table public.hero_content enable row level security;

drop policy if exists "Public can read properties" on public.properties;
create policy "Public can read properties"
on public.properties for select
using (true);

drop policy if exists "Authenticated admins can write properties" on public.properties;
create policy "Authenticated admins can write properties"
on public.properties for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read hero" on public.hero_content;
create policy "Public can read hero"
on public.hero_content for select
using (true);

drop policy if exists "Authenticated admins can write hero" on public.hero_content;
create policy "Authenticated admins can write hero"
on public.hero_content for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values
    ('property-images', 'property-images', true),
    ('property-videos', 'property-videos', true),
    ('hero-media', 'hero-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read media" on storage.objects;
create policy "Public can read media"
on storage.objects for select
using (bucket_id in ('property-images', 'property-videos', 'hero-media'));

drop policy if exists "Authenticated admins can upload media" on storage.objects;
create policy "Authenticated admins can upload media"
on storage.objects for insert
to authenticated
with check (bucket_id in ('property-images', 'property-videos', 'hero-media'));

drop policy if exists "Authenticated admins can update media" on storage.objects;
create policy "Authenticated admins can update media"
on storage.objects for update
to authenticated
using (bucket_id in ('property-images', 'property-videos', 'hero-media'))
with check (bucket_id in ('property-images', 'property-videos', 'hero-media'));

drop policy if exists "Authenticated admins can delete media" on storage.objects;
create policy "Authenticated admins can delete media"
on storage.objects for delete
to authenticated
using (bucket_id in ('property-images', 'property-videos', 'hero-media'));
