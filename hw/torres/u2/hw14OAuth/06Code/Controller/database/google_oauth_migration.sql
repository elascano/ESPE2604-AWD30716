-- Google OAuth migration for an existing American Latin Class Supabase database.
-- Run this instead of the full supabase_schema.sql when the database already exists.

alter table public.users add column if not exists google_sub text;
alter table public.users add column if not exists auth_provider text not null default 'password';

update public.users
set auth_provider = 'password'
where auth_provider is null;

alter table public.users drop constraint if exists users_auth_provider_check;
alter table public.users add constraint users_auth_provider_check
  check (auth_provider in ('password', 'google'));

create unique index if not exists users_google_sub_unique
  on public.users (google_sub)
  where google_sub is not null and google_sub <> '';
