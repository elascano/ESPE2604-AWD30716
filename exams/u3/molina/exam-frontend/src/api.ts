const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/$/, "");

export type Item = {
  id: string;
  name: string;
  price: number;
  stock: number;
  expiration_date: string;
  created_at: string;
  availability: string;
  iva_rate?: number;
  iva_value?: number;
  price_with_iva?: number;
  days_remaining?: number;
};

export type ItemCreate = {
  name: string;
  price: number;
  stock: number;
  expiration_date: string;
};

type VatItem = Item & {
  iva_rate: number;
  iva_value: number;
  price_with_iva: number;
};

type RemainingDaysItem = {
  id: string;
  name: string;
  expiration_date: string;
  days_remaining: number;
};

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return null as T;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data as T;
}

export async function getItems(): Promise<Item[]> {
  const response = await fetch(`${API_URL}/api/v1/items`);
  return parseResponse<Item[]>(response);
}

export async function searchItemsWithCalculations(query: string): Promise<Item[]> {
  const params = new URLSearchParams({ q: query.trim() });

  // Al buscar se activan exactamente dos GET al Business API.
  const [vatResponse, daysResponse] = await Promise.all([
    fetch(`${API_URL}/api/v1/items/iva?${params.toString()}`),
    fetch(`${API_URL}/api/v1/items/dias-restantes?${params.toString()}`),
  ]);

  const [vatItems, remainingDaysItems] = await Promise.all([
    parseResponse<VatItem[]>(vatResponse),
    parseResponse<RemainingDaysItem[]>(daysResponse),
  ]);

  const daysById = new Map(
    remainingDaysItems.map((item) => [item.id, item]),
  );

  return vatItems.map((item) => ({
    ...item,
    ...daysById.get(item.id),
  }));
}

export async function createItem(body: ItemCreate): Promise<Item> {
  const response = await fetch(`${API_URL}/api/v1/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return parseResponse<Item>(response);
}

export async function deleteItem(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/items/${id}`, {
    method: "DELETE",
  });

  await parseResponse<void>(response);
}
