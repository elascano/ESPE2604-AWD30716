import { useState, useEffect, useCallback } from "react";
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
  const [expDay, setExpDay] = useState("31");
  const [expMonth, setExpMonth] = useState("12");
  const [expYear, setExpYear] = useState("2026");
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vatRate = 0.19;
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const data = await request(
        "GET",
        `/projects/bf338534-365a-4d8d-b45d-1e961e182467/products?search=${query}`
      );
      setResults(data);
      setError(null);
    } catch (err: any) {
      setError("Error al conectar con el backend");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleAnalysis = async (product: Product) => {
    try {
      const payload = {
        products: cart,
        target_product: product,
        expiration: {
          day: parseInt(expDay) || 1,
          month: parseInt(expMonth) || 1,
          year: parseInt(expYear) || 2026,
        },
      };
      const data = await request(
        "POST",
        `/projects/bf338534-365a-4d8d-b45d-1e961e182467/analyze`,
        payload
      );
      setAnalysisResult(data);
    } catch (err: any) {
      alert("Error en el análisis con el backend");
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const orderData = {
        delivery_address: "123 Mockup St",
        notes: "Realizado desde el frontend",
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        total: total,
      };
      await request("POST", "/projects/bf338534-365a-4d8d-b45d-1e961e182467/orders", orderData);
      alert("¡Pedido realizado con éxito!");
      setCart([]);
    } catch (err: any) {
      alert("Error al realizar el pedido: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mockup-wrapper">
      <h1 className="mockup-title">Productos</h1>

      <form className="mockup-search-container" onSubmit={handleSearch}>
        <input
          className="mockup-input"
          placeholder="Ej: Pan"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="mockup-button" disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && <div className="mockup-error">{error}</div>}

      <div className="mockup-bottom-grid">
        <div className="mockup-left-panel">
          {!searched && !error && (
            <div className="mockup-left-text">
              Presione Enter o haga clic en "Buscar" para encontrar artículos...
            </div>
          )}

          {searched && !error && results.length === 0 && !loading && (
            <div className="mockup-left-text">No se encontraron productos.</div>
          )}

          {searched && !error && results.length > 0 && !loading && (
            <table className="mockup-table">
              <thead>
                <tr>
                  <th>NOMBRE</th>
                  <th>DESCRIPCIÓN</th>
                  <th>PRECIO</th>
                  <th>STOCK</th>
                  <th>ACCIÓN</th>
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
                        style={{ marginBottom: "10px" }}
                      >
                        Agregar al Carrito
                      </button>
                      <div style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
                        <input
                          value={expDay}
                          onChange={(e) => setExpDay(e.target.value)}
                          placeholder="DD"
                          style={{ width: "35px", color: "black", padding: "2px" }}
                        />
                        <input
                          value={expMonth}
                          onChange={(e) => setExpMonth(e.target.value)}
                          placeholder="MM"
                          style={{ width: "35px", color: "black", padding: "2px" }}
                        />
                        <input
                          value={expYear}
                          onChange={(e) => setExpYear(e.target.value)}
                          placeholder="YYYY"
                          style={{ width: "50px", color: "black", padding: "2px" }}
                        />
                      </div>
                      <button
                        className="mockup-button"
                        onClick={() => handleAnalysis(p)}
                        style={{ width: "100%", padding: "5px", fontSize: "0.8rem" }}
                      >
                        Analizar Producto
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mockup-cart">
          <h2 className="mockup-cart-title">Carrito de Compras</h2>
          <div className="mockup-cart-body">
            {cart.length === 0 ? (
              "El carrito está vacío"
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, textAlign: "left" }}>
                {cart.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mockup-cart-footer" style={{ flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <span className="label" style={{ fontSize: "0.9rem", color: "#7a7690" }}>
                Subtotal:
              </span>
              <span className="amount" style={{ fontSize: "0.9rem", color: "#ccc" }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <span className="label" style={{ fontSize: "0.9rem", color: "#7a7690" }}>
                IVA (19%):
              </span>
              <span className="amount" style={{ fontSize: "0.9rem", color: "#ccc" }}>
                ${vatAmount.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                borderTop: "1px solid #2f2a4a",
                paddingTop: "8px",
                marginTop: "4px",
              }}
            >
              <span className="label">Total:</span>
              <span className="amount">${total.toFixed(2)}</span>
            </div>
            <button
              className="mockup-button"
              style={{ marginTop: "16px", width: "100%" }}
              onClick={handleCheckout}
              disabled={cart.length === 0 || loading}
            >
              Pagar
            </button>
          </div>
        </div>
      </div>

      {analysisResult && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <div className="mockup-cart" style={{ width: "100%", maxWidth: "600px" }}>
            <h2 className="mockup-cart-title">Resultados Backend</h2>
            <div className="mockup-cart-body" style={{ textAlign: "left" }}>
              <p style={{ margin: "5px 0" }}>
                <strong>Total (Backend):</strong> ${analysisResult.total_price.toFixed(2)}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>IVA (19%):</strong> ${analysisResult.vat_amount.toFixed(2)}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Días para expirar:</strong> {analysisResult.days_left} días
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
