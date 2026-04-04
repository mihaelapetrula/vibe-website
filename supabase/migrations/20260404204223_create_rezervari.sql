-- Tabel rezervări Vibe Caffè
create table rezervari (
  id             bigint primary key generated always as identity,
  nume           text        not null,
  email          text        not null,
  telefon        text        not null,
  numar_persoane integer     not null default 2,
  data           date        not null,
  ora            time        not null,
  status         text        not null default 'în așteptare',
  created_at     timestamptz not null default now()
);

-- Activăm Row Level Security
alter table rezervari enable row level security;

-- Oricine poate citi rezervări
create policy "public can select" on rezervari
  for select using (true);

-- Oricine poate adăuga o rezervare
create policy "public can insert" on rezervari
  for insert with check (true);

-- Oricine poate modifica o rezervare
create policy "public can update" on rezervari
  for update using (true);

-- Oricine poate șterge o rezervare
create policy "public can delete" on rezervari
  for delete using (true);