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

const app = new Hono().basePath('/menu-management')

app.get('/menu/dishes', async (c) => {
  try {
    const { data, error } = await supabase.from('menu_items').select('*')
    
    if (error) {
      console.error("Supabase Error:", error.message)
      return c.json({ error: error.message }, 500)
    }

    return c.json(data ?? [], 200)

  } catch (err: any) {
    console.error("Server Error:", err.message)
    return c.json({ error: err.message }, 500)
  }
})

app.get('/menu/dish/:dishId', async (c) => {
  try {
    const dishId = c.req.param('dishId')
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('item_id' as any, dishId as any)
      .single()

    if (error || !data) {
      return c.json({ error: 'Dish not found' }, 404)
    }
    return c.json(data, 200)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

app.get('/menu/categories', async (c) => {
  try {
    const { data, error } = await supabase.from('menu_items').select('*')
    if (error) return c.json({ error: error.message }, 500)

    const categories = [
      ...new Set(
        (data ?? [])
          .map((item) => (item as any).category)
          .filter((cat): cat is string => typeof cat === 'string')
      ),
    ]
    return c.json(categories, 200)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

app.get('/menu/ingredients', async (c) => {
  try {
    const { data, error } = await supabase.from('ingredients').select('*')
    if (error) return c.json({ error: error.message }, 500)
    return c.json(data ?? [], 200)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

Deno.serve(app.fetch)