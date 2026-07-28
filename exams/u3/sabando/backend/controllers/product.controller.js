const Product = require('../models/product.model');
const IVA_RATE = 0.16;

// Helper to check if Supabase is connected
const getSupabase = (req, res) => {
  const supabase = req.app.locals.supabase;
  if (!supabase) {
    res.status(500).json({ error: "Supabase credentials are not configured on the server." });
    return null;
  }
  return supabase;
};

// Add a product to Supabase
exports.addProduct = async (req, res) => {
  try {
    const supabase = getSupabase(req, res);
    if (!supabase) return;

    const { name, price, expirationDate } = req.body;

    if (!name || price === undefined || !expirationDate) {
      return res.status(400).json({ error: "Missing required fields (name, price, expirationDate)" });
    }

    const { day, month, year } = expirationDate;
    if (day === undefined || month === undefined || year === undefined) {
      return res.status(400).json({ error: "expirationDate must contain day, month, and year" });
    }

    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    if (isNaN(parseInt(day, 10)) || isNaN(parseInt(month, 10)) || isNaN(parseInt(year, 10))) {
      return res.status(400).json({ error: "Expiration date values must be integers" });
    }

    // Insert into Supabase table "products"
    const { data, error } = await supabase
      .from('products')
      .insert([
        { 
          name, 
          price: parseFloat(price), 
          expiration_day: parseInt(day, 10), 
          expiration_month: parseInt(month, 10), 
          expiration_year: parseInt(year, 10) 
        }
      ])
      .select();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: "A product with this name already exists" });
      }
      throw error;
    }

    const productMapped = Product.fromSupabase(data[0]);
    res.status(201).json({ message: "Product added successfully", product: productMapped });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products and calculate total price from Supabase
exports.getProducts = async (req, res) => {
  try {
    const supabase = getSupabase(req, res);
    if (!supabase) return;

    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;

    const productsMapped = data.map(p => Product.fromSupabase(p));
    const total = productsMapped.reduce((sum, p) => sum + p.price, 0);

    res.status(200).json({ products: productsMapped, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find product by name and return only its IVA amount
exports.getProductIva = async (req, res) => {
  try {
    const supabase = getSupabase(req, res);
    if (!supabase) return;

    const name = req.params.name;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', name);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: `Product with name '${name}' not found` });
    }

    const product = Product.fromSupabase(data[0]);
    const ivaAmount = product.price * IVA_RATE;

    res.status(200).json({
      name: product.name,
      price: product.price,
      ivaRate: `${IVA_RATE * 100}%`,
      ivaAmount: parseFloat(ivaAmount.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find product by name and compute expiration days left
exports.getProductExpiration = async (req, res) => {
  try {
    const supabase = getSupabase(req, res);
    if (!supabase) return;

    const name = req.params.name;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', name);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: `Product with name '${name}' not found` });
    }

    const product = Product.fromSupabase(data[0]);
    const expDate = Product.getExpirationDateObject(product.expirationDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const normalizedExpDate = new Date(expDate);
    normalizedExpDate.setHours(0, 0, 0, 0);

    const diffTime = normalizedExpDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    res.status(200).json({
      name: product.name,
      expirationDate: product.expirationDate,
      daysLeft: diffDays
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear the products table in Supabase
exports.resetProducts = async (req, res) => {
  try {
    const supabase = getSupabase(req, res);
    if (!supabase) return;

    // Delete all records where name is not empty (acts as a TRUNCATE)
    const { error } = await supabase
      .from('products')
      .delete()
      .neq('name', '');

    if (error) throw error;

    res.status(200).json({ message: "Product database cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
