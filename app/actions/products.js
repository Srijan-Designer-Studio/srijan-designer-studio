'use server'

import { createClient } from '@/lib/supabase/server'
// 1. Import the standard client
import { createClient as createPublicClient } from '@supabase/supabase-js'

// 2. Initialize a public, cookie-less client safe for caching
const publicSupabase = createPublicClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function getProducts() {
  // 3. Use publicSupabase instead of await createClient()
  const { data, error } = await publicSupabase
    .from('products')
    .select('*, product_variants(*), product_images(*)') // Adjust your select query as needed
    .eq('is_active', true)

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }
  return data
}

// NOTE: Leave your other functions (like addProduct) exactly as they are. 
// They SHOULD use `await createClient()` because admin actions need to read cookies to verify auth!