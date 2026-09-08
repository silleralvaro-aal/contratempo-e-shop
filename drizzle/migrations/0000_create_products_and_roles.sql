-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

create policy "Utenti vedono i propri ruoli"
on public.user_roles for select to authenticated
using (auth.uid() = user_id);

create policy "Amministratori gestiscono i ruoli"
on public.user_roles for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Bootstrap: the first signed-in user can claim admin when no admin exists yet
create or replace function public.claim_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    return false;
  end if;
  if exists (select 1 from public.user_roles where role = 'admin') then
    return false;
  end if;
  insert into public.user_roles (user_id, role) values (uid, 'admin')
  on conflict do nothing;
  return true;
end;
$$;

grant execute on function public.claim_admin() to authenticated;

create or replace function public.admin_exists()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where role = 'admin')
$$;

grant execute on function public.admin_exists() to authenticated, anon;

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  subtitle text not null default '',
  eyebrow text not null default '',
  description text not null default '',
  price numeric(10,2) not null default 0 check (price >= 0),
  images text[] not null default '{}',
  specs jsonb not null default '[]'::jsonb,
  available boolean not null default true,
  featured boolean not null default false,
  inventory integer not null default 0 check (inventory >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;

alter table public.products enable row level security;

create policy "Catalogo pubblico"
on public.products for select to anon, authenticated
using (true);

create policy "Amministratori gestiscono i prodotti"
on public.products for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_touch_updated_at
before update on public.products
for each row execute function public.touch_updated_at();

insert into public.products (slug, name, subtitle, eyebrow, description, price, specs, available, featured, inventory, sort_order) values
('venatura-radica','Venatura','Radica','Esemplare Unico — Pezzo Unico','La perfezione geometrica dell''argento incontra l''imperfezione sublime della natura. Ogni quadrante è intagliato da legno massello. La "Radica" con i suoi nodi naturali rende ogni orologio una creazione irripetibile. Nessuno sarà uguale al tuo.',4200,'[{"label":"Cassa (Case)","value":"Argento massiccio 925"},{"label":"Movimento","value":"ETA Svizzero Automatico"},{"label":"Quadrante (Dial)","value":"Legno Radica Naturale"},{"label":"Cinturino","value":"Pelle toscana marrone"}]'::jsonb,true,true,3,1),
('notturno-ardesia','Notturno','Ardesia','Edizione Limitata — 50 Esemplari','Il silenzio della notte milanese fissato in un quadrante di ardesia levigata a mano. Linee severe, luce discreta: un orologio che non chiede attenzione, la ottiene.',3650,'[{"label":"Cassa (Case)","value":"Acciaio spazzolato 316L"},{"label":"Movimento","value":"Automatico Svizzero 42h"},{"label":"Quadrante (Dial)","value":"Ardesia naturale"},{"label":"Cinturino","value":"Alligatore nero"}]'::jsonb,true,true,8,2),
('aurora-champagne','Aurora','Champagne','Collezione Permanente','Un quadrante guilloché color champagne che cattura la prima luce del mattino. Oro rosa e pelle cognac per chi misura il tempo in momenti, non in ore.',5100,'[{"label":"Cassa (Case)","value":"Oro rosa 18kt"},{"label":"Movimento","value":"Automatico manifattura"},{"label":"Quadrante (Dial)","value":"Guilloché champagne"},{"label":"Cinturino","value":"Pelle cognac cucita a mano"}]'::jsonb,true,true,5,3),
('meccanica-scheletro','Meccanica','Scheletro','Alta Complicazione','Nulla da nascondere: il movimento è esposto, ogni ruota è visibile. Duecento ore di finitura manuale per mostrare il cuore che batte contro il tempo.',7800,'[{"label":"Cassa (Case)","value":"Platino 950"},{"label":"Movimento","value":"Scheletrato a carica manuale"},{"label":"Quadrante (Dial)","value":"Aperto, ponti rodiati"},{"label":"Cinturino","value":"Pelle verde bosco"}]'::jsonb,true,false,2,4);
