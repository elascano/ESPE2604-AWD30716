import { Hono } from 'https://deno.land/x/hono@v3.4.1/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { Database } from '../_shared/types/supabase.ts'

const supabaseUrl = Deno.env.get('REAL_URL')!
const supabaseSecretKey = Deno.env.get('REAL_KEY')! 

const supabase = createClient<Database>(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  global: {
    headers: {
      Authorization: `Bearer ${supabaseSecretKey}`
    }
  }
})

const app = new Hono().basePath('/auth-management')

app.get('/auth/me', async (c) => {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1).single()
    if (error) return c.json({ error: error.message }, 500)
    return c.json(data ?? {}, 200)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

app.get('/customer/:customerId/orders', async (c) => {
  try {
    const customerId = c.req.param('customerId')
    
    const { data, error } = await supabase
      .from('orders')
      .select('order_id, customer_name, customer_email')
      .ilike('customer_name', `%${customerId}%`) 

    if (error) {
      console.error("Supabase Orders Error:", error.message)
      return c.json({ error: error.message }, 500)
    }
    
    return c.json(data ?? [], 200)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

Deno.serve(app.fetch)