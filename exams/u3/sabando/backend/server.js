require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const productRoutes = require('./routes/product.routes');

const app = express();
const PORT = process.env.PORT || 3015;

// Read Supabase credentials from environment variables (supporting standard and Next.js conventions)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('Supabase client initialized successfully.');
} else {
  console.warn('WARNING: SUPABASE_URL or SUPABASE_KEY environment variables are missing.');
}

// Share Supabase client instance with handlers
app.locals.supabase = supabase;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    database: supabase ? 'initialized' : 'missing_credentials' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
