-- Normalizes academic access users to the English-only convention used by the app.
-- Run this after supabase_schema.sql if production has Spanish alias users.
--
-- Official academic test credentials after this script:
-- teacher@americanlatinclass.com / ALC2026*
-- student@americanlatinclass.com / ALC2026*
-- director@americanlatinclass.com / ALC2026*

begin;

alter table public.students add column if not exists photo_url text;
alter table public.users add column if not exists avatar_url text;

do $$
declare
  v_student_id bigint;
  v_password_hash text := 'pbkdf2$sha256$100000$alc-academic-seed$d9f84c7012a4bfcb6b13b93e67a1125d744c2a78e84acd4eb96e404a8390efb3';
begin
  select u.student_id
    into v_student_id
  from public.users u
  where lower(u.email) in (
    'student@americanlatinclass.com',
    'alumno@americanlatinclass.com',
    'estudiante@americanlatinclass.com'
  )
    and u.student_id is not null
  order by case
    when lower(u.email) = 'student@americanlatinclass.com' then 1
    else 2
  end
  limit 1;

  if v_student_id is null then
    select s.id
      into v_student_id
    from public.students s
    where s.national_id = '1723456789'
    limit 1;
  end if;

  if v_student_id is null then
    insert into public.students (
      branch_id,
      national_id,
      full_name,
      email,
      phone,
      level,
      scholarship_percent,
      guardian_name,
      guardian_phone,
      status
    )
    values (
      3,
      '1723456789',
      'Valeria Paz',
      'student@americanlatinclass.com',
      '0990000000',
      'B2',
      100,
      'Luis Paz',
      '0991112222',
      'active'
    )
    returning id into v_student_id;
  end if;

  update public.students
  set
    email = 'student@americanlatinclass.com',
    full_name = 'Valeria Paz',
    level = 'B2',
    scholarship_percent = 100,
    status = 'active',
    updated_at = now()
  where id = v_student_id
    and not exists (
      select 1
      from public.students other
      where lower(other.email) = 'student@americanlatinclass.com'
        and other.id <> v_student_id
    );

  insert into public.users (email, password_hash, role, name, branch_id, student_id, is_active)
  values
    ('teacher@americanlatinclass.com', v_password_hash, 'teacher', 'Andrea Molina', 1, null, true),
    ('director@americanlatinclass.com', v_password_hash, 'director', 'Juan Pablo Hidalgo', 1, null, true),
    ('student@americanlatinclass.com', v_password_hash, 'student', 'Valeria Paz', 3, v_student_id, true)
  on conflict (email) do update set
    password_hash = excluded.password_hash,
    role = excluded.role,
    name = excluded.name,
    branch_id = excluded.branch_id,
    student_id = excluded.student_id,
    is_active = excluded.is_active,
    updated_at = now();

  if to_regclass('public.audit_logs') is not null then
    execute $sql$
      update public.audit_logs log
      set actor_user_id = target_user.id
      from public.users source_user
      cross join public.users target_user
      where log.actor_user_id = source_user.id
        and lower(source_user.email) in (
          'alumno@americanlatinclass.com',
          'estudiante@americanlatinclass.com'
        )
        and lower(target_user.email) = 'student@americanlatinclass.com'
    $sql$;

    execute $sql$
      update public.audit_logs log
      set actor_user_id = target_user.id
      from public.users source_user
      cross join public.users target_user
      where log.actor_user_id = source_user.id
        and lower(source_user.email) = 'profesor@americanlatinclass.com'
        and lower(target_user.email) = 'teacher@americanlatinclass.com'
    $sql$;
  end if;

  delete from public.users
  where lower(email) in (
    'alumno@americanlatinclass.com',
    'estudiante@americanlatinclass.com',
    'profesor@americanlatinclass.com'
  );
end $$;

commit;

select id, email, role, name, branch_id, student_id, is_active
from public.users
where lower(email) like '%@americanlatinclass.com'
order by role, email;
