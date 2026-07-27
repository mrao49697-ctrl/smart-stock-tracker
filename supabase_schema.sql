-- Create the products table
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  sku text not null unique,
  category text not null,
  price numeric not null default 0,
  quantity integer not null default 0,
  status text not null default 'In Stock',
  image_url text default 'https://placehold.co/600x600/png'
);

-- Add column if table already existed without it
alter table products add column if not exists image_url text default 'https://placehold.co/600x600/png';

-- Create the sales table
create table if not exists sales (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  product_id uuid references products(id) on delete cascade not null,
  quantity integer not null default 1,
  total_price numeric not null default 0
);

-- Create settings table
create table if not exists settings (
  id text primary key default 'default',
  store_name text not null default 'StockSathi AI',
  currency text not null default '$'
);

-- Insert default settings if not exists
insert into settings (id, store_name, currency) values ('default', 'StockSathi AI', '$') on conflict (id) do nothing;

-- Set up Row Level Security (RLS)
alter table products enable row level security;
alter table sales enable row level security;
alter table settings enable row level security;

-- Policies for products
drop policy if exists "Allow public read access on products" on products;
drop policy if exists "Allow public insert access on products" on products;
drop policy if exists "Allow public update access on products" on products;
drop policy if exists "Allow public delete access on products" on products;

create policy "Allow public read access on products" on products for select using (true);
create policy "Allow public insert access on products" on products for insert with check (true);
create policy "Allow public update access on products" on products for update using (true) with check (true);
create policy "Allow public delete access on products" on products for delete using (true);

-- Policies for sales
drop policy if exists "Allow public read access on sales" on sales;
drop policy if exists "Allow public insert access on sales" on sales;
drop policy if exists "Allow public delete access on sales" on sales;

create policy "Allow public read access on sales" on sales for select using (true);
create policy "Allow public insert access on sales" on sales for insert with check (true);
create policy "Allow public delete access on sales" on sales for delete using (true);

-- Policies for settings
drop policy if exists "Allow public read access on settings" on settings;
drop policy if exists "Allow public update access on settings" on settings;

create policy "Allow public read access on settings" on settings for select using (true);
create policy "Allow public update access on settings" on settings for update using (true) with check (true);

-- ==============================================
-- DUMMY DATA FOR TESTING
-- ==============================================

-- Insert Sample Products
insert into products (name, sku, category, price, quantity, status, image_url) values 
('Wireless Noise-Cancelling Headphones', 'AUDIO-001', 'Electronics', 299.99, 45, 'In Stock', 'https://picsum.photos/seed/headphones/600/600'),
('Smart Watch Pro 4', 'WEAR-042', 'Wearables', 199.99, 12, 'In Stock', 'https://picsum.photos/seed/watch/600/600'),
('Ergonomic Office Chair', 'FURN-099', 'Furniture', 149.50, 8, 'Low Stock', 'https://picsum.photos/seed/chair/600/600'),
('Mechanical Gaming Keyboard', 'GAME-101', 'Gaming', 89.00, 30, 'In Stock', 'https://picsum.photos/seed/keyboard/600/600'),
('4K Ultra HD Monitor', 'DISP-4K', 'Displays', 349.99, 0, 'Out of Stock', 'https://picsum.photos/seed/monitor/600/600'),
('Bluetooth Speaker Mini', 'AUDIO-002', 'Electronics', 45.00, 120, 'In Stock', 'https://picsum.photos/seed/speaker/600/600')
on conflict (sku) do update set image_url = EXCLUDED.image_url;
