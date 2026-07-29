import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({ baseURL: API_BASE, timeout: 15000 });

export async function getProducts() {
  const { data } = await api.get('/products');
  return data;
}

export async function calculateCartTotal(products: { name: string; price: number; quantity: number }[]) {
  const { data } = await api.post('/cart/total', { products });
  return data;
}

export async function getProductIva(id: string) {
  const { data } = await api.get(`/products/${id}/iva`);
  return data;
}

export async function getProductExpiration(id: string, day: number, month: number, year: number) {
  const { data } = await api.post(`/products/${id}/expiration`, { day, month, year });
  return data;
}
