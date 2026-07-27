import { Dish } from '@/types/index';

export interface CartItem {
  dish_id: string;
  dish: Dish;
  quantity: number;
}

export const calculateCartTotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + Number(item.dish.price) * item.quantity, 0);

export const calculateCartItemCount = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, 0);

export const addCartItem = (
  items: CartItem[],
  dish: Dish,
  quantity: number = 1
): CartItem[] => {
  const existing = items.find((item) => item.dish_id === dish.dish_id);
  if (existing) {
    return items.map((item) =>
      item.dish_id === dish.dish_id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }
  return [...items, { dish_id: dish.dish_id, dish, quantity }];
};

export const removeCartItem = (
  items: CartItem[],
  dish_id: string
): CartItem[] => items.filter((item) => item.dish_id !== dish_id);

export const updateCartItemQuantity = (
  items: CartItem[],
  dish_id: string,
  quantity: number
): CartItem[] => {
  if (quantity <= 0) return removeCartItem(items, dish_id);
  return items.map((item) =>
    item.dish_id === dish_id ? { ...item, quantity } : item
  );
};

export const getAvailableCategories = (dishes: Dish[]): string[] => [
  ...new Set(dishes.filter((d) => d.is_available).map((d) => d.category)),
];
