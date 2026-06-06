import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0'

const app = new Hono().basePath('/ingredients-core')

app.use('*', async (c, next) => {
  const supabase = createClient(
    Deno.env.get('REAL_URL') ?? '',
    Deno.env.get('REAL_KEY') ?? '',
    { global: { headers: { Authorization: c.req.header('Authorization') || '' } } }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  c.set('supabase', supabase)
  await next()
})

app.get('/ingredients', async (c) => {
  const supabase = c.get('supabase')

  const { data, error } = await supabase
    .from('ingredients')
    .select('sku_code, name, unit_of_measurement, stock_disponible')

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data }, 200)
})

app.get('/ingredients/:ingredientId', async (c) => {
  const supabase = c.get('supabase')
  const ingredientId = c.req.param('ingredientId')

  const { data, error } = await supabase
    .from('ingredients')
    .select('sku_code, name, unit_of_measurement, stock_disponible')
    .eq('sku_code', ingredientId)
    .single()

  if (error || !data) return c.json({ error: 'Ingredient not found' }, 404)
  return c.json({ data }, 200)
})

Deno.serve(app.fetch)
