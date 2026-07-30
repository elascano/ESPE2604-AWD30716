import React, { useState } from 'react';
import { Database, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../apiConfig';

export function ProductInventory({ dbProducts, refreshProducts }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [ivaRate, setIvaRate] = useState('19');
  const [expirationDay, setExpirationDay] = useState('15');
  const [expirationMonth, setExpirationMonth] = useState('12');
  const [expirationYear, setExpirationYear] = useState('2026');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`${getApiUrl()}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          ivaRate: parseFloat(ivaRate),
          expirationDay: parseInt(expirationDay, 10),
          expirationMonth: parseInt(expirationMonth, 10),
          expirationYear: parseInt(expirationYear, 10),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage(`Product "${name}" successfully saved to MongoDB!`);
        setName('');
        setPrice('');
        refreshProducts();
      } else {
        setError(data.message || 'Failed to save product');
      }
    } catch (err) {
      setError('Cannot connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product from MongoDB?')) return;
    try {
      const response = await fetch(`${getApiUrl()}/api/products/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        refreshProducts();
      }
    } catch (err) {
      alert('Error deleting product');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      
      <div className="card">
        <div className="card-header">
          <h2>
            <Plus className="icon" style={{ color: '#2563eb' }} />
            Add New Product to MongoDB
          </h2>
          <p>Store persistent product records in your cloud MongoDB cluster.</p>
        </div>

        <form onSubmit={handleCreateProduct}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              className="input-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wireless Router"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="input-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="79.99"
                required
              />
            </div>
            <div className="form-group">
              <label>IVA Rate (%)</label>
              <input
                type="number"
                step="0.1"
                className="input-control"
                value={ivaRate}
                onChange={(e) => setIvaRate(e.target.value)}
                placeholder="19"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Expiration Date (Day, Month, Year)</label>
            <div className="date-inputs-grid">
              <input
                type="number"
                min="1"
                max="31"
                className="input-control"
                value={expirationDay}
                onChange={(e) => setExpirationDay(e.target.value)}
                placeholder="Day"
                required
              />
              <input
                type="number"
                min="1"
                max="12"
                className="input-control"
                value={expirationMonth}
                onChange={(e) => setExpirationMonth(e.target.value)}
                placeholder="Month"
                required
              />
              <input
                type="number"
                min="2024"
                className="input-control"
                value={expirationYear}
                onChange={(e) => setExpirationYear(e.target.value)}
                placeholder="Year"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Product to MongoDB'}
          </button>
        </form>

        {message && (
          <div className="result-box success" style={{ marginTop: '1rem' }}>
            <CheckCircle2 size={18} /> {message}
          </div>
        )}
        {error && (
          <div className="result-box danger" style={{ marginTop: '1rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}
      </div>

      {/* Database Product List */}
      <div className="card">
        <div className="card-header">
          <h2>
            <Database className="icon" style={{ color: '#2563eb' }} />
            MongoDB Products ({dbProducts ? dbProducts.length : 0})
          </h2>
          <p>Stored product records ready for computations.</p>
        </div>

        {!dbProducts || dbProducts.length === 0 ? (
          <p style={{ color: '#94a3b8', fontStyle: 'italic', padding: '1rem 0' }}>
            No products stored in database yet. Add one using the form on the left!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
            {dbProducts.map((p) => (
              <div
                key={p._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{p.name}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Price: <strong>${p.price}</strong> | IVA: {p.ivaRate}% | Exp: {p.expirationDay}/{p.expirationMonth}/{p.expirationYear}
                  </div>
                </div>
                <button
                  className="btn-icon-danger"
                  onClick={() => handleDeleteProduct(p._id)}
                  title="Delete product"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
