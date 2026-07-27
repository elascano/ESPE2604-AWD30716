<!-- src/components/Orders.vue -->

<template>
  <div class="orders-container">
    <div class="container">
      <h1>Mis Órdenes</h1>

      <div v-if="!userStore.isAuthenticated" class="not-authenticated">
        <p>Debes iniciar sesión para ver tus órdenes</p>
        <router-link to="/login" class="login-btn">Iniciar Sesión</router-link>
      </div>

      <div v-else>
        <div v-if="ordersStore.isLoading" class="loading">Cargando órdenes...</div>

        <div v-else-if="ordersStore.orders.length === 0" class="empty">
          <p>No tienes órdenes aún</p>
          <router-link to="/menu">Realiza tu primer pedido</router-link>
        </div>

        <div v-else class="orders-list">
          <div v-for="order in ordersStore.orders" :key="order.order_id" class="order-card">
            <div class="order-header">
              <h3>Orden #{{ order.order_id.slice(0, 8) }}</h3>
              <span :class="['status', getStatusClass(order.status)]">
                {{ getStatusLabel(order.status) }}
              </span>
            </div>
            
            <div class="order-details">
              <p><strong>Fecha:</strong> {{ formatDate(order.created_at) }}</p>
              <p><strong>Total:</strong> {{ formatPrice(order.total_amount) }}</p>
              <p><strong>Artículos:</strong> {{ order.orderDetails?.length || 0 }}</p>
            </div>

            <div class="order-items">
              <div v-for="item in order.orderDetails" :key="item.detail_id" class="order-item">
                <span>{{ item.dish?.name }}</span>
                <span>x{{ item.quantity }}</span>
                <span>{{ formatPrice(item.subtotal) }}</span>
              </div>
            </div>

            <div class="order-actions">
              <button
                v-if="order.status !== 'Cancelled'"
                @click="cancelOrder(order.order_id)"
                class="cancel-btn"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useOrders } from '../composables/useOrders';
import { useUserStore } from '../stores/userStore';
import { useToast } from '../composables/useToast';
import { formatPrice, formatDate, getStatusLabel } from '@utils/formatters';

const ordersStore = reactive(useOrders());
const userStore = useUserStore();
const toast = useToast();

onMounted(() => {
  if (userStore.isAuthenticated) {
    ordersStore.fetchUserOrders();
  }
});

const getStatusClass = (status: string) => {
  return status.toLowerCase().replace(' ', '-');
};

const cancelOrder = async (id: string) => {
  if (confirm('¿Deseas cancelar esta orden?')) {
    const success = await ordersStore.cancelOrder(id);
    if (success) {
      toast.success('Orden cancelada');
    }
  }
};
</script>

<style scoped src="@/styles/pages/orders.css"></style>
