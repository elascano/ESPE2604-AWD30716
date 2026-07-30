
const Product = require('../models/Product');

exports.computeCartTotal = async (req, res) => {
  try {
    const { products } = req.body; 

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required and cannot be empty.',
      });
    }

    
    const processedProducts = products.map((item, index) => {
      const priceNum = parseFloat(item.price) || 0;
      return {
        id: item._id || item.id || `temp-${index + 1}`,
        name: item.name ? String(item.name).trim() : `Product ${index + 1}`,
        price: priceNum,
      };
    });

    const totalPrice = processedProducts.reduce(
      (accumulator, currentProduct) => accumulator + currentProduct.price,
      0
    );

    const averagePrice = processedProducts.length > 0 ? totalPrice / processedProducts.length : 0;

    return res.status(200).json({
      success: true,
      message: 'Cart total computed successfully',
      data: {
        totalPrice: Number(totalPrice.toFixed(2)),
        averagePrice: Number(averagePrice.toFixed(2)),
        itemCount: processedProducts.length,
        items: processedProducts,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to compute cart total',
      error: error.message,
    });
  }
};


exports.computeProductIVA = async (req, res) => {
  try {
    let productObj = null;

    if (req.body.productId) {
      productObj = await Product.findById(req.body.productId);
      if (!productObj) {
        return res.status(404).json({ success: false, message: 'Product not found in database.' });
      }
    } else {
      const { name, price, ivaRate } = req.body;
      if (price === undefined || price === null || isNaN(price)) {
        return res.status(400).json({ success: false, message: 'Valid price is required.' });
      }
      productObj = {
        name: name || 'Unnamed Product',
        price: parseFloat(price),
        ivaRate: ivaRate !== undefined && !isNaN(ivaRate) ? parseFloat(ivaRate) : 19,
      };
    }

    const rate = productObj.ivaRate !== undefined ? productObj.ivaRate : 19;
    const ivaValue = productObj.price * (rate / 100);

    return res.status(200).json({
      success: true,
      message: 'IVA value computed successfully',
      data: {
        productName: productObj.name,
        price: productObj.price,
        ivaRatePercent: rate,
        ivaValue: Number(ivaValue.toFixed(2)), 
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to compute IVA value',
      error: error.message,
    });
  }
};


exports.computeExpirationDays = async (req, res) => {
  try {
    let day, month, year, productName;

    if (req.body.productId) {
      const existingProduct = await Product.findById(req.body.productId);
      if (!existingProduct) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      productName = existingProduct.name;
      day = existingProduct.expirationDay;
      month = existingProduct.expirationMonth;
      year = existingProduct.expirationYear;
    } else {
      productName = req.body.name || 'Sample Product';
      day = parseInt(req.body.day, 10);
      month = parseInt(req.body.month, 10);
      year = parseInt(req.body.year, 10);
    }

    if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid numerical inputs for day, month, and year.',
      });
    }

    const expirationDate = new Date(year, month - 1, day, 23, 59, 59);
    const currentDate = new Date();

    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const expDayClean = new Date(year, month - 1, day);

    const timeDiffMs = expDayClean.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiffMs / (1000 * 60 * 60 * 24));

    const isExpired = daysRemaining < 0;
    const isToday = daysRemaining === 0;

    return res.status(200).json({
      success: true,
      message: 'Expiration days computed successfully',
      data: {
        productName,
        expirationDate: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`,
        inputDateObject: { day, month, year },
        daysRemaining: Math.abs(daysRemaining),
        isExpired,
        isToday,
        statusMessage: isExpired
          ? `Product expired ${Math.abs(daysRemaining)} days ago.`
          : isToday
          ? 'Product expires today!'
          : `${daysRemaining} days left to sell this product.`,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to compute expiration days',
      error: error.message,
    });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const { name, price, ivaRate, expirationDay, expirationMonth, expirationYear } = req.body;

    const newProduct = await Product.create({
      name,
      price: parseFloat(price),
      ivaRate: ivaRate !== undefined ? parseFloat(ivaRate) : 19,
      expirationDay: parseInt(expirationDay, 10),
      expirationMonth: parseInt(expirationMonth, 10),
      expirationYear: parseInt(expirationYear, 10),
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Invalid product ID' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};
