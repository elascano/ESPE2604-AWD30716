import React, { useState, useEffect } from 'react';
import { Percent, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../apiConfig';

export function IvaCalculator({ dbProducts }) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [ivaRate, setIvaRate] = useState('19');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dbProducts && dbProducts.length > 0 && !selectedProductId) {
      const first = dbProducts[0];
      setSelectedProductId(first._id);
      setProductName(first.name);
      setPrice(first.price.toString());
      setIvaRate(first.ivaRate ? first.ivaRate.toString() : '19');
    }
  }, [dbProducts]);

  const handleSelectProduct = (e) => {
    const id = e.target.value;
    setSelectedProductId(id);
    if (id && dbProducts) {
      const found = dbProducts.find((p) => p._id === id);
      if (found) {
        setProductName(found.name);
        setPrice(found.price.toString());
        setIvaRate(found.ivaRate ? found.ivaRate.toString() : '19');
      }
    } else {
      setProductName('');
      setPrice('');
      setIvaRate('19');
    }
  };

  const handleComputeIVA = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = selectedProductId
      ? { productId: selectedProductId }
      : { name: productName, price: parseFloat(price), ivaRate: parseFloat(ivaRate) };

    try {
      const response = await fetch(`${getApiUrl()}/api/products/compute-iva`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Failed to compute IVA');
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
          <Percent className="icon" style={{ color: '#2563eb' }} />
          Compute IVA Amount of One Product
        </h2>
        <p>Select a product directly from MongoDB to calculate exclusively its IVA tax amount in Node.js.</p>
      </div>

      <form onSubmit={handleComputeIVA}>
        <div className="form-group">
          <label>Select Product from MongoDB Database:</label>
          <select
            className="input-control"
            value={selectedProductId}
            onChange={handleSelectProduct}
            required
          >
            <option value="">-- Choose a Product from MongoDB --</option>
            {dbProducts && dbProducts.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} (${p.price} | IVA: {p.ivaRate || 19}%)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            className="input-control"
            value={productName}
            onChange={(e) => {
              setSelectedProductId('');
              setProductName(e.target.value);
            }}
            placeholder="Product Name"
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Price ($):</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="input-control"
              value={price}
              onChange={(e) => {
                setSelectedProductId('');
                setPrice(e.target.value);
              }}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label>IVA Rate (%):</label>
            <input
              type="number"
              step="0.1"
              min="0"
              className="input-control"
              value={ivaRate}
              onChange={(e) => {
                setSelectedProductId('');
                setIvaRate(e.target.value);
              }}
              placeholder="19"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading || !price}>
          <Calculator size={18} />
          {loading ? 'Calculating IVA...' : 'Compute Product IVA Value'}
        </button>
      </form>

      {error && (
        <div className="result-box danger">
          <div className="result-header" style={{ color: '#ef4444' }}>
            <AlertCircle size={20} /> Error Computing IVA
          </div>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result-box success">
          <div className="result-header" style={{ color: '#059669' }}>
            <CheckCircle2 size={20} /> Computed IVA Tax Value (Exclusive)
          </div>
          <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem' }}>
            Only the IVA value of product <strong>{result.productName}</strong> (Base: ${result.price}):
          </div>
          <div className="result-value-big" style={{ color: '#2563eb' }}>
            ${result.ivaValue.toFixed(2)}
          </div>
          <div className="result-grid">
            <div className="result-item">
              <div className="result-item-label">Product Name</div>
              <div className="result-item-val">{result.productName}</div>
            </div>
            <div className="result-item">
              <div className="result-item-label">Base Price</div>
              <div className="result-item-val">${result.price}</div>
            </div>
            <div className="result-item">
              <div className="result-item-label">IVA Rate Applied</div>
              <div className="result-item-val">{result.ivaRatePercent}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
