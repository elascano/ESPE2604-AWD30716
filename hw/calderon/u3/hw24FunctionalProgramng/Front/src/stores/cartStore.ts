import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '../utils/api';
import { useUserStore } from './userStore';
import { Dish } from '@/types/index';
import {
  CartItem,
  calculateCartTotal,
  calculateCartItemCount,
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
} from '../utils/functionalCart';

export type { CartItem };

const CART_STORAGE_KEY = 'cart_items';

const loadCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadCart());
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const totalPrice = computed(() => calculateCartTotal(items.value));

  const totalItems = computed(() => calculateCartItemCount(items.value));

  const persist = () => {
    saveCart(items.value);
  };

  const addItem = (dish: Dish, quantity: number = 1) => {
    items.value = addCartItem(items.value, dish, quantity);
    persist();
  };

  const removeItem = (dish_id: string) => {
    items.value = removeCartItem(items.value, dish_id);
    persist();
  };

  const updateQuantity = (dish_id: string, quantity: number) => {
    items.value = updateCartItemQuantity(items.value, dish_id, quantity);
    persist();
  };

  const clearCart = () => {
    items.value = [];
    persist();
  };

  const checkout = async () => {
    if (items.value.length === 0) {
      error.value = 'Cart is empty';
      return false;
    }

    isLoading.value = true;
    error.value = null;
    try {
      const userStore = useUserStore();
      const userId = userStore.user?.user_id;

      const response = await apiClient.post('/orders', {
        orderId: generateUUID(),
        userId: userId,
        totalAmount: totalPrice.value,
        deliveryType: 'dine_in',
        deliveryAddress: 'Restaurant',
        specialInstructions: '',
        items: items.value.map((item) => ({
          itemId: item.dish_id,
          quantity: item.quantity,
          priceAtPurchase: Number(item.dish.price),
        })),
      });

      clearCart();
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error processing order';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    items,
    isLoading,
    error,
    totalPrice,
    totalItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    checkout,
  };
});
