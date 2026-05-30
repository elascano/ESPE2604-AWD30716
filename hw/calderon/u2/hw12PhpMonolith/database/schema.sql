create table if not exists employee (
  id bigserial primary key,
  employee_id varchar(80) not null unique,
  name varchar(160) not null,
  address varchar(220) not null,
  cellphone varchar(40) not null,
  email varchar(180) not null,
  salary numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);
