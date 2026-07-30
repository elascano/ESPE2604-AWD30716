import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, Calculator, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import { getApiUrl } from '../apiConfig';

export function CartCalculator({ dbProducts, refreshProducts }) {
  const [cartItems, setCartItems] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    if (dbProducts && dbProducts.length > 0) {
      const initialCart = dbProducts.slice(0, 5).map((p) => ({
        id: p._id,
        name: p.name,
        price: p.price,
      }));
      setCartItems(initialCart);
    }
  }, [dbProducts]);

  const handleInputChange = (id, field, value) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addProductRow = () => {
    if (cartItems.length >= 5) {
      alert('The requirement specifies a maximum of 5 products.');
      return;
    }
    const newId = `custom-${Date.now()}`;
    setCartItems([
      ...cartItems,
      { id: newId, name: `New Product ${cartItems.length + 1}`, price: 0 },
    ]);
  };

  const removeProductRow = (id) => {
    if (cartItems.length <= 1) {
      alert('Cart must contain at least 1 product.');
      return;
    }
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const loadFiveFromDb = () => {
    if (!dbProducts || dbProducts.length === 0) {
      alert('No products available in MongoDB database.');
      return;
    }
    const loaded = dbProducts.slice(0, 5).map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
    }));
    setCartItems(loaded);
  };

  const handleComputeTotal = async () => {
    if (cartItems.length === 0) {
      setError('Please add products to the cart first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${getApiUrl()}/api/products/cart-total`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: cartItems }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Failed to compute total');
      }
    } catch (err) {
      setError('Cannot connect to backend server at ' + getApiUrl());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>
          <ShoppingCart className="icon" style={{ color: '#2563eb' }} />
          Shopping Cart Total Computation
        </h2>
        <p>Products are loaded dynamically from MongoDB. Compute the total price of 5 products via Node.js backend.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={loadFiveFromDb}
        >
          <Database size={16} /> Load 5 Products directly from MongoDB
        </button>
        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
          Items in Cart: {cartItems.length}/5
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', color: '#64748b', marginBottom: '1.5rem' }}>
          No products loaded from MongoDB yet. Click the button above to load items.
        </div>
      ) : (
        <div className="cart-products-list">
          {cartItems.map((item, index) => (
            <div className="cart-row" key={item.id}>
              <div>
                <input
                  type="text"
                  className="input-control"
                  placeholder={`Product Name ${index + 1}`}
                  value={item.name}
                  onChange={(e) => handleInputChange(item.id, 'name', e.target.value)}
                />
              </div>
              <div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="input-control"
                  placeholder="Price ($)"
                  value={item.price}
                  onChange={(e) => handleInputChange(item.id, 'price', e.target.value)}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  className="btn-icon-danger"
                  title="Remove Item"
                  onClick={() => removeProductRow(item.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {cartItems.length < 5 && (
          <button type="button" className="btn-secondary" onClick={addProductRow}>
            <Plus size={16} /> Add Product Slot ({cartItems.length}/5)
          </button>
        )}
      </div>

      <button
        type="button"
        className="btn-primary"
        onClick={handleComputeTotal}
        disabled={loading || cartItems.length === 0}
      >
        <Calculator size={18} />
        {loading ? 'Computing Backend Total...' : `Compute Total of ${cartItems.length} Products`}
      </button>

      {error && (
        <div className="result-box danger">
          <div className="result-header" style={{ color: '#ef4444' }}>
            <AlertCircle size={20} /> Error Computing Total
          </div>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result-box success">
          <div className="result-header" style={{ color: '#10b981' }}>
            <CheckCircle2 size={20} /> Total Computed by Backend Array.reduce()
          </div>
          <div className="result-value-big" style={{ color: '#059669' }}>
            ${result.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="result-grid">
            <div className="result-item">
              <div className="result-item-label">Total Items</div>
              <div className="result-item-val">{result.itemCount} Products</div>
            </div>
            <div className="result-item">
              <div className="result-item-label">Average Unit Price</div>
              <div className="result-item-val">${result.averagePrice}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
