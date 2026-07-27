import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  created_at: string
  name: string
  sku: string
  category: string
  price: number
  quantity: number
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
  image_url?: string
}

export type Sale = {
  id: string
  created_at: string
  product_id: string
  quantity: number
  total_price: number
  products?: Product // for joined queries
}

export type StoreSetting = {
  id: string
  store_name: string
  currency: string
}
