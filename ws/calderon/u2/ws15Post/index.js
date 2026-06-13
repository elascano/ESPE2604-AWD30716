//  Jilmar Calderon port 3003
import { createClient } from '@supabase/supabase-js';
const port = 3003;
import express from 'express';
import customerRoutes from './routes/customerRoutes.js';

export const supabase = createClient(supabaseUrl, supabaseKey);

app.use('/customers', customerRoutes);

app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));
