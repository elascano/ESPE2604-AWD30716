import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0'

const app = new Hono().basePath('/inventory-analytics')

app.use('*', async (c, next) => {
  const supabase = createClient(
    Deno.env.get('MI_SUPABASE_URL') ?? '',
    Deno.env.get('MI_SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: c.req.header('Authorization') || '' } } }
  )
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  c.set('supabase', supabase)
  await next()
})

app.get('/inventory', async (c) => {
  const supabase = c.get('supabase')

  const { data, error } = await supabase
    .from('inventory')
    .select('id, ingredient_name, current_stock, unit, reorder_level, supplier, expiry_date') 

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data }, 200)
})

Deno.serve(app.fetch)