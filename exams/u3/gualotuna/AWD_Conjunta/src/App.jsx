import React, { useState, useEffect } from 'react';
import { ShoppingCart, Percent, Calendar, Database, Server, RefreshCw } from 'lucide-react';
import { CartCalculator } from './components/CartCalculator';
import { IvaCalculator } from './components/IvaCalculator';
import { ExpirationCalculator } from './components/ExpirationCalculator';
import { ProductInventory } from './components/ProductInventory';
import { getApiUrl } from './apiConfig';

export function App() {
  const [activeTab, setActiveTab] = useState('cart'); // 'cart', 'iva', 'expiration', 'inventory'
  const [dbProducts, setDbProducts] = useState([]);
  const [serverOnline, setServerOnline] = useState(false);
  const [loadingHealth, setLoadingHealth] = useState(true);

  const checkServerHealth = async () => {
    try {
      const res = await fetch(`${getApiUrl()}/api/health`);
      if (res.ok) {
        setServerOnline(true);
      } else {
        setServerOnline(false);
      }
    } catch {
      setServerOnline(false);
    } finally {
      setLoadingHealth(false);
    }
  };

  const fetchDbProducts = async () => {
    try {
      const res = await fetch(`${getApiUrl()}/api/products`);
      const data = await res.json();
      if (data.success) {
        setDbProducts(data.data);
      }
    } catch {
      // Ignored if offline
    }
  };

  useEffect(() => {
    checkServerHealth();
    fetchDbProducts();
    const interval = setInterval(checkServerHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      {/* Header Banner */}
      <header className="header-banner">
        <div className="header-title-group">
          <h1>
            <Server size={32} style={{ color: '#2563eb' }} />
            Product Management & Computation Suite
          </h1>
          <p>Brayan Gualotuña</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="server-status-pill">
            <span className={`status-dot ${serverOnline ? '' : 'offline'}`}></span>
            Backend (Port 3009): {serverOnline ? 'Connected' : 'Disconnected'}
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              checkServerHealth();
              fetchDbProducts();
            }}
            title="Refresh connection & data"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="nav-tabs">
        <button
          className={`tab-button ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          <ShoppingCart size={18} />
          Cart Total (5 Products)
        </button>
        <button
          className={`tab-button ${activeTab === 'iva' ? 'active' : ''}`}
          onClick={() => setActiveTab('iva')}
        >
          <Percent size={18} />
          IVA Amount
        </button>
        <button
          className={`tab-button ${activeTab === 'expiration' ? 'active' : ''}`}
          onClick={() => setActiveTab('expiration')}
        >
          <Calendar size={18} />
          Expiration Days (Day/Month/Year)
        </button>
        <button
          className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Database size={18} />
          MongoDB Database ({dbProducts.length})
        </button>
      </nav>

      {/* Main Feature Content */}
      <main>
        {activeTab === 'cart' && <CartCalculator dbProducts={dbProducts} />}
        {activeTab === 'iva' && <IvaCalculator dbProducts={dbProducts} />}
        {activeTab === 'expiration' && <ExpirationCalculator dbProducts={dbProducts} />}
        {activeTab === 'inventory' && (
          <ProductInventory dbProducts={dbProducts} refreshProducts={fetchDbProducts} />
        )}
      </main>
    </div>
  );
}

export default App;
