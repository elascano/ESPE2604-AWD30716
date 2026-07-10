<!-- src/components/Cart.vue -->

<template>
  <div class="cart-container">
    <div class="container">
      <h1>Carrito de Compras</h1>

      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <p>Tu carrito está vacío</p>
        <router-link to="/menu" class="continue-btn">Volver al Menú</router-link>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cartStore.items" :key="item.dish_id" class="cart-item">
            <div class="item-details">
              <h3>{{ item.dish.name }}</h3>
              <p class="price">{{ formatPrice(item.dish.price) }} c/u</p>
            </div>
            <div class="item-controls">
              <button @click="cartStore.updateQuantity(item.dish_id, item.quantity - 1)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="cartStore.updateQuantity(item.dish_id, item.quantity + 1)">+</button>
            </div>
            <div class="item-subtotal">
              {{ formatPrice(Number(item.dish.price) * item.quantity) }}
            </div>
            <button
              @click="cartStore.removeItem(item.dish_id)"
              class="remove-btn"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>{{ formatPrice(cartStore.totalPrice) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>{{ formatPrice(cartStore.totalPrice) }}</span>
          </div>

          <button
            @click="handleCheckout"
            :disabled="cartStore.isLoading || !userStore.isAuthenticated"
            class="checkout-btn"
          >
            {{ cartStore.isLoading ? 'Procesando...' : 'Procesar Pedido' }}
          </button>

          <div v-if="!userStore.isAuthenticated" class="login-required">
            <router-link to="/login">Inicia sesión para continuar</router-link>
          </div>

          <router-link to="/menu" class="continue-btn">Continuar Comprando</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cartStore';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';
import { formatPrice } from '../utils/formatters';

const cartStore = useCartStore();
const userStore = useUserStore();
const router = useRouter();
const toast = useToast();

const handleCheckout = async () => {
  const order = await cartStore.checkout();
  if (order) {
    toast.success('¡Pedido creado exitosamente!');
    router.push('/orders');
  } else if (cartStore.error) {
    toast.error(cartStore.error);
    cartStore.error = null;
  }
};
</script>

<style scoped src="@/styles/pages/cart.css"></style>
