import { Hono } from 'https://deno.land/x/hono@v4.3.11/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0'

const app = new Hono().basePath('/orders-reservations')

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
  c.set('user', user)
  await next()
})

app.get('/orders', async (c) => {
  const supabase = c.get('supabase')
  const user = c.get('user')

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(quantity, dishes(name, price))') 
    .eq('user_id', user.id)

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data }, 200)
})

app.get('/orders/:orderId', async (c) => {
  const supabase = c.get('supabase')
  const orderId = c.req.param('orderId')

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(quantity, dishes(name, price))')
    .eq('id', orderId)
    .single()

  if (error) return c.json({ error: 'Order not found' }, 404)
  return c.json({ data }, 200)
})

app.get('/reservations', async (c) => {
  const supabase = c.get('supabase')
  const user = c.get('user')

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('user_id', user.id)

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data }, 200)
})

app.get('/reservations/:reservationId', async (c) => {
  const supabase = c.get('supabase')
  const reservationId = c.req.param('reservationId')

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', reservationId)
    .single()

  if (error) return c.json({ error: 'Reservation not found' }, 404)
  return c.json({ data }, 200)
})

app.get('/cart', async (c) => {
  const supabase = c.get('supabase')
  const user = c.get('user')

  const { data, error } = await supabase
    .from('cart')
    .select('*, cart_items(quantity, dishes(name, price))')
    .eq('user_id', user.id)
    .single()

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ data }, 200)
})

Deno.serve(app.fetch)