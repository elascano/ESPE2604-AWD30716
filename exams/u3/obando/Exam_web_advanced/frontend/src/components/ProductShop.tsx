import { useState, useEffect } from "react";
import { request } from "../api/api";
import "./ProductShop.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function ProductShop() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const [searched, setSearched] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const ivaRate = 0.19; // 19%
  const ivaAmount = subtotal * ivaRate;
  const total = subtotal + ivaAmount;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const data = await request("GET", `/projects/bf338534-365a-4d8d-b45d-1e961e182467/products?search=${query}`);
      setResults(data);
      setError(null);
    } catch (err: any) {
      setError("Error connecting to the backend");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mockup-wrapper">
      <h1 className="mockup-title">Products</h1>

      <form className="mockup-search-container" onSubmit={handleSearch}>
        <input
          className="mockup-input"
          placeholder="Bread"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="mockup-button" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <div className="mockup-error">
          {error}
        </div>
      )}

      <div className="mockup-bottom-grid">
        <div className="mockup-left-panel">
          {!searched && !error && (
            <div className="mockup-left-text">
              Press Enter or click "Search" to find articles...
            </div>
          )}

          {searched && !error && results.length === 0 && !loading && (
            <div className="mockup-left-text">No products found.</div>
          )}

          {searched && !error && results.length > 0 && !loading && (
            <table className="mockup-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>DESCRIPTION</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {results.map((p) => (
                  <tr key={p.id}>
                    <td className="name-col">{p.name}</td>
                    <td className="desc-col">{p.description}</td>
                    <td className="price-col">${p.price.toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button
                        className="mockup-add-btn"
                        onClick={() => addToCart(p)}
                        disabled={p.stock <= 0}
                      >
                        Add to Cart
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mockup-cart">
          <h2 className="mockup-cart-title">Shopping Cart</h2>
          <div className="mockup-cart-body">
            {cart.length === 0 ? (
              "Cart is empty"
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, textAlign: "left" }}>
                {cart.map(item => (
                  <li key={item.id} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mockup-cart-footer" style={{ flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span className="label" style={{ fontSize: '0.9rem', color: '#7a7690' }}>Subtotal:</span>
              <span className="amount" style={{ fontSize: '0.9rem', color: '#ccc' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span className="label" style={{ fontSize: '0.9rem', color: '#7a7690' }}>IVA (19%):</span>
              <span className="amount" style={{ fontSize: '0.9rem', color: '#ccc' }}>${ivaAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderTop: '1px solid #2f2a4a', paddingTop: '8px', marginTop: '4px' }}>
              <span className="label">Total:</span>
              <span className="amount">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
