-- =========================================================================
-- APEX — Varun Beverages Consumer Engagement Platform
-- Supabase (PostgreSQL) schema
-- Run in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- =========================================================================

create extension if not exists "uuid-ossp";

-- -------------------------------------------------------------------------
-- USERS  (extends Supabase auth.users with app profile data)
-- -------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text unique,
  full_name text,
  avatar_url text,
  city text,
  tier text not null default 'bronze'
    check (tier in ('bronze','silver','gold','platinum')),
  lifetime_points integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- WALLETS  (1:1 with users — current spendable balance)
-- -------------------------------------------------------------------------
create table if not exists public.wallets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- GAMES  (catalog of the branded mini-games)
-- -------------------------------------------------------------------------
create table if not exists public.games (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,             -- e.g. 'spin-the-wheel'
  name text not null,                    -- e.g. 'Pepsi Spin the Wheel'
  brand text not null,                   -- Pepsi | Mirinda | 7UP | Mountain Dew | Sting | Aquafina
  description text,
  min_points integer not null default 10,
  max_points integer not null default 100,
  bonus_multiplier_chance numeric(4,3) not null default 0.15, -- 0..1
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- GAME_SESSIONS  (every play event — one row per play)
-- -------------------------------------------------------------------------
create table if not exists public.game_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete restrict,
  points_awarded integer not null default 0,
  was_bonus boolean not null default false,
  result_payload jsonb,                  -- game-specific outcome, e.g. {"segment":"20 pts"}
  played_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- REWARDS  (catalog of redeemable items — demo/catalogue only)
-- -------------------------------------------------------------------------
create table if not exists public.rewards (
  id uuid primary key default uuid_generate_v4(),
  name text not null,                    -- e.g. "Free 500ml Pepsi"
  brand text not null,
  description text,
  cost_points integer not null,
  stock integer,                         -- null = unlimited (demo default)
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- REDEMPTIONS  (user -> reward exchange events)
-- -------------------------------------------------------------------------
create table if not exists public.redemptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  reward_id uuid not null references public.rewards(id) on delete restrict,
  points_spent integer not null,
  status text not null default 'fulfilled'
    check (status in ('pending','fulfilled','cancelled')),
  redeemed_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- POINTS_TRANSACTIONS  (immutable audit trail of every point movement)
-- Defined after game_sessions/redemptions since it references both.
-- -------------------------------------------------------------------------
create table if not exists public.points_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  game_session_id uuid references public.game_sessions(id) on delete set null,
  redemption_id uuid references public.redemptions(id) on delete set null,
  amount integer not null,               -- positive = earn, negative = redeem/adjust
  type text not null
    check (type in ('game_reward','bonus_multiplier','redemption','manual_adjustment','signup_bonus')),
  description text,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------------------
-- CAMPAIGNS  (marketing/admin campaign control — e.g. "Double Points Weekend")
-- -------------------------------------------------------------------------
create table if not exists public.campaigns (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  brand text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  points_multiplier numeric(4,2) not null default 1.0,
  is_active boolean not null default true,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

-- =========================================================================
-- INDEXES
-- =========================================================================
create index if not exists idx_points_tx_user on public.points_transactions(user_id, created_at desc);
create index if not exists idx_sessions_user on public.game_sessions(user_id, played_at desc);
create index if not exists idx_sessions_game on public.game_sessions(game_id);
create index if not exists idx_redemptions_user on public.redemptions(user_id, redeemed_at desc);
create index if not exists idx_campaigns_active on public.campaigns(is_active, starts_at, ends_at);

-- =========================================================================
-- TRIGGERS: keep wallets.balance and users.lifetime_points in sync with
-- points_transactions automatically, so the ledger is always the source
-- of truth and the balance can never drift.
-- =========================================================================
create or replace function public.apply_points_transaction()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.wallets (user_id, balance)
  values (new.user_id, 0)
  on conflict (user_id) do nothing;

  update public.wallets
    set balance = balance + new.amount,
        updated_at = now()
    where user_id = new.user_id;

  if new.amount > 0 then
    update public.users
      set lifetime_points = lifetime_points + new.amount,
          tier = case
            when lifetime_points + new.amount >= 20000 then 'platinum'
            when lifetime_points + new.amount >= 8000  then 'gold'
            when lifetime_points + new.amount >= 2000  then 'silver'
            else 'bronze'
          end,
          updated_at = now()
      where id = new.user_id;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_apply_points_transaction on public.points_transactions;
create trigger trg_apply_points_transaction
  after insert on public.points_transactions
  for each row execute function public.apply_points_transaction();

-- =========================================================================
-- ROW LEVEL SECURITY
-- =========================================================================
alter table public.users enable row level security;
alter table public.wallets enable row level security;
alter table public.points_transactions enable row level security;
alter table public.game_sessions enable row level security;
alter table public.redemptions enable row level security;
alter table public.games enable row level security;
alter table public.rewards enable row level security;
alter table public.campaigns enable row level security;

-- Users can read/update only their own profile
create policy "users read own" on public.users for select using (auth.uid() = id);
create policy "users update own" on public.users for update using (auth.uid() = id);

-- Wallet, transactions, sessions, redemptions: read-only to the owner
create policy "wallet read own" on public.wallets for select using (auth.uid() = user_id);
create policy "tx read own" on public.points_transactions for select using (auth.uid() = user_id);
create policy "sessions read own" on public.game_sessions for select using (auth.uid() = user_id);
create policy "sessions insert own" on public.game_sessions for insert with check (auth.uid() = user_id);
create policy "redemptions read own" on public.redemptions for select using (auth.uid() = user_id);
create policy "redemptions insert own" on public.redemptions for insert with check (auth.uid() = user_id);

-- Catalog tables (games, rewards, campaigns): public read, admin-only write.
-- NOTE: swap the `true` below for a real admin check, e.g.
--   exists (select 1 from public.users u where u.id = auth.uid() and u.tier = 'platinum')
-- or, better, a dedicated `is_admin boolean` column / admins table.
create policy "games public read" on public.games for select using (true);
create policy "rewards public read" on public.rewards for select using (true);
create policy "campaigns public read" on public.campaigns for select using (true);

-- =========================================================================
-- SEED DATA — the six branded games + a starter reward catalogue
-- =========================================================================
insert into public.games (slug, name, brand, description, min_points, max_points, bonus_multiplier_chance, sort_order)
values
  ('spin-the-wheel',  'Pepsi Spin the Wheel',   'Pepsi',         'Spin the branded wheel for an instant points prize.', 10, 150, 0.18, 1),
  ('scratch-win',     'Scratch & Win Card',      'Mirinda',       'Scratch the card to reveal your instant reward.',      10, 120, 0.15, 2),
  ('bottle-drop',     'Bottle Drop Catch',       '7UP',           'Catch falling bottles to rack up points.',             10, 200, 0.12, 3),
  ('can-stack',       'Can Stack Challenge',     'Mountain Dew',  'Stack cans as high as you can without toppling.',      10, 200, 0.12, 4),
  ('memory-flip',     'Memory Flip Cards',       'Sting',         'Match pairs of Varun product cards from memory.',      10, 150, 0.15, 5),
  ('lucky-box',       'Lucky Box Picker',        'Aquafina',      'Pick a box for a surprise points prize.',              10, 130, 0.20, 6)
on conflict (slug) do nothing;

insert into public.rewards (name, brand, description, cost_points, stock)
values
  ('Free 500ml Pepsi',        'Pepsi',        'Redeemable at any partner outlet.', 500,  null),
  ('Free 500ml Mirinda',      'Mirinda',      'Redeemable at any partner outlet.', 500,  null),
  ('Free 500ml 7UP',          '7UP',          'Redeemable at any partner outlet.', 500,  null),
  ('Mountain Dew Cap',        'Mountain Dew', 'Limited-edition branded cap.',      1500, 200),
  ('Sting Gym Bag',           'Sting',        'Branded gym bag.',                  4000, 50),
  ('Aquafina Hamper (12pk)',  'Aquafina',     '12-pack hamper delivered monthly.', 8000, 20)
on conflict do nothing;
