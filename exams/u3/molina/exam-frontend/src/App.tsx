import { FormEvent, useEffect, useState } from "react";
import {
  createItem,
  deleteItem,
  getItems,
  Item,
  searchItemsWithCalculations,
} from "./api";

function formatDate(value?: string) {
  if (!value) return "—";

  const normalized = value.length === 10 ? `${value}T00:00:00` : value;
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
  }).format(new Date(normalized));
}

function remainingDaysLabel(days?: number) {
  if (days === undefined) return "Días sin calcular";
  if (days > 1) return `Faltan ${days} días`;
  if (days === 1) return "Falta 1 día";
  if (days === 0) return "Expira hoy";
  if (days === -1) return "Expiró hace 1 día";
  return `Expiró hace ${Math.abs(days)} días`;
}

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("10");
  const [stock, setStock] = useState("1");
  const [expirationDate, setExpirationDate] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadItems() {
    try {
      setLoading(true);
      setItems(await getItems());
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error loading items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function onCreate(event: FormEvent) {
    event.preventDefault();

    try {
      setLoading(true);
      await createItem({
        name,
        price: Number(price),
        stock: Number(stock),
        expiration_date: expirationDate,
      });

      setName("");
      setExpirationDate("");
      setSearch("");
      await loadItems();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error creating item");
    } finally {
      setLoading(false);
    }
  }

  async function onSearch(event: FormEvent) {
    event.preventDefault();

    if (!search.trim()) {
      await loadItems();
      return;
    }

    try {
      setLoading(true);
      const results = await searchItemsWithCalculations(search);
      setItems(results);
      setMessage(results.length === 0 ? "No se encontraron productos." : "");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error searching items");
    } finally {
      setLoading(false);
    }
  }

  async function clearSearch() {
    setSearch("");
    await loadItems();
  }

  async function onDelete(id: string) {
    try {
      setLoading(true);
      await deleteItem(id);
      if (search.trim()) {
        setItems(await searchItemsWithCalculations(search));
      } else {
        await loadItems();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error deleting item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header>
        <h1>Amazon Shopping</h1>
        <p>Busca productos y calcula su IVA y los días restantes para expirar.</p>
      </header>

      <form className="search-form" onSubmit={onSearch}>
        <label htmlFor="search">Buscar por nombre</label>
        <div className="search-controls">
          <input
            id="search"
            placeholder="Ejemplo: apple"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="submit" disabled={loading}>Buscar</button>
          <button type="button" className="secondary" onClick={clearSearch} disabled={loading}>
            Mostrar todos
          </button>
        </div>
        <small>
          La búsqueda ejecuta <code>/iva</code> y <code>/dias-restantes</code>.
        </small>
      </form>

      <form className="create-form" onSubmit={onCreate}>
        <h2>Crear producto</h2>
        <div className="form-grid">
          <label>
            Nombre
            <input
              placeholder="Item name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          <label>
            Precio
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
            />
          </label>
          <label>
            Stock
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              required
            />
          </label>
          <label>
            Fecha de expiración
            <input
              type="date"
              value={expirationDate}
              onChange={(event) => setExpirationDate(event.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>Crear</button>
      </form>

      {message && <p className="message">{message}</p>}
      {loading && <p className="loading">Procesando…</p>}

      <section className="items-list">
        {items.map((item) => (
          <article key={item.id}>
            <div className="item-main">
              <strong>{item.name}</strong>
              <span>
                Precio base: ${item.price.toFixed(2)} · stock {item.stock} · {item.availability}
              </span>
              <span>Expiración: {formatDate(item.expiration_date)}</span>
            </div>

            {item.iva_value !== undefined && (
              <div className="calculation-block">
                <span>IVA ({((item.iva_rate ?? 0) * 100).toFixed(0)}%): ${item.iva_value.toFixed(2)}</span>
                <strong>Total: ${(item.price_with_iva ?? item.price).toFixed(2)}</strong>
              </div>
            )}

            {item.days_remaining !== undefined && (
              <div className="calculation-block">
                <span>Fecha: {formatDate(item.expiration_date)}</span>
                <strong>{remainingDaysLabel(item.days_remaining)}</strong>
              </div>
            )}

            <button className="danger" onClick={() => onDelete(item.id)} disabled={loading}>
              Eliminar
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
