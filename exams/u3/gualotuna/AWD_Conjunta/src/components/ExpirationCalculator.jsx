import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../apiConfig';

export function ExpirationCalculator({ dbProducts }) {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    if (dbProducts && dbProducts.length > 0 && !selectedProductId) {
      const first = dbProducts[0];
      setSelectedProductId(first._id);
      setProductName(first.name);
      setDay(first.expirationDay.toString());
      setMonth(first.expirationMonth.toString());
      setYear(first.expirationYear.toString());
    }
  }, [dbProducts]);

  const handleSelectProduct = (e) => {
    const id = e.target.value;
    setSelectedProductId(id);
    if (id && dbProducts) {
      const found = dbProducts.find((p) => p._id === id);
      if (found) {
        setProductName(found.name);
        setDay(found.expirationDay.toString());
        setMonth(found.expirationMonth.toString());
        setYear(found.expirationYear.toString());
      }
    } else {
      setProductName('');
      setDay('');
      setMonth('');
      setYear('');
    }
  };

  const handleComputeExpiration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = selectedProductId
      ? { productId: selectedProductId }
      : {
          name: productName,
          day: parseInt(day, 10),
          month: parseInt(month, 10),
          year: parseInt(year, 10),
        };

    try {
      const response = await fetch(`${getApiUrl()}/api/products/compute-expiration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Failed to compute expiration time');
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
          <Calendar className="icon" style={{ color: '#2563eb' }} />
          Product Expiration Time Calculation
        </h2>
        <p>Select a product from MongoDB. The expiration date populates 3 inputs (Day, Month, Year) to compute remaining sell days.</p>
      </div>

      <form onSubmit={handleComputeExpiration}>
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
                {p.name} (Exp: {p.expirationDay}/{p.expirationMonth}/{p.expirationYear})
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

        <div className="form-group">
          <label style={{ color: '#1e293b', fontWeight: 700 }}>
            Expiration Date (3 Inputs: Day, Month, Year):
          </label>
          <div className="date-inputs-grid">
            <div>
              <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Day (1-31)</label>
              <input
                type="number"
                min="1"
                max="31"
                className="input-control"
                value={day}
                onChange={(e) => {
                  setSelectedProductId('');
                  setDay(e.target.value);
                }}
                placeholder="DD"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Month (1-12)</label>
              <input
                type="number"
                min="1"
                max="12"
                className="input-control"
                value={month}
                onChange={(e) => {
                  setSelectedProductId('');
                  setMonth(e.target.value);
                }}
                placeholder="MM"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Year (YYYY)</label>
              <input
                type="number"
                min="2024"
                max="2100"
                className="input-control"
                value={year}
                onChange={(e) => {
                  setSelectedProductId('');
                  setYear(e.target.value);
                }}
                placeholder="YYYY"
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading || !day || !month || !year}>
          <Clock size={18} />
          {loading ? 'Computing Remaining Days...' : 'Compute Expiration Days Left'}
        </button>
      </form>

      {error && (
        <div className="result-box danger">
          <div className="result-header" style={{ color: '#ef4444' }}>
            <AlertCircle size={20} /> Error Computing Expiration
          </div>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className={`result-box ${result.isExpired ? 'danger' : 'success'}`}>
          <div className="result-header" style={{ color: result.isExpired ? '#dc2626' : '#059669' }}>
            {result.isExpired ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
            {result.statusMessage}
          </div>

          <div
            className="result-value-big"
            style={{ color: result.isExpired ? '#dc2626' : '#059669' }}
          >
            {result.daysRemaining} {result.daysRemaining === 1 ? 'Day' : 'Days'}
          </div>

          <div className="result-grid">
            <div className="result-item">
              <div className="result-item-label">Target Expiration</div>
              <div className="result-item-val">{result.expirationDate}</div>
            </div>
            <div className="result-item">
              <div className="result-item-label">Product Name</div>
              <div className="result-item-val">{result.productName}</div>
            </div>
            <div className="result-item">
              <div className="result-item-label">Status</div>
              <div className="result-item-val" style={{ color: result.isExpired ? '#dc2626' : '#059669' }}>
                {result.isExpired ? 'Expired' : result.isToday ? 'Expires Today' : 'Active / Ready to Sell'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
