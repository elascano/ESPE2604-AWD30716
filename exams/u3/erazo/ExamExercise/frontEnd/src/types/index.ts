export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
}

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartResult {
  items: CartItem[];
  subtotal: number;
  iva: number;
  ivaRate: number;
  total: number;
}

export interface IvaResult {
  product: { _id: string; name: string; price: number };
  iva: number;
  ivaRate: number;
  pricePlusIva: number;
}

export interface ExpirationResult {
  product: { _id: string; name: string };
  expirationDate: string;
  daysLeft: number;
  isExpired: boolean;
  status: string;
}
