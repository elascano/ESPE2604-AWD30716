import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://18.118.134.82:3000',
  timeout: 15000
});

export async function getUsers() {
  const response = await api.get('/users');
  const payload = response.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.users)) return payload.users;

  return [];
}
