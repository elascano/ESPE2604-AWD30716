<!-- src/components/admin/AdminOrders.vue -->

<template>
  <div class="admin-orders">
    <div class="filters">
      <select v-model="selectedStatus" class="filter-select">
        <option value="">Todos los estados</option>
        <option value="Pending">Pendiente</option>
        <option value="Confirmed">Confirmado</option>
        <option value="Completed">Completado</option>
        <option value="Cancelled">Cancelado</option>
      </select>
      <button @click="loadOrders" class="refresh-btn">🔄 Actualizar</button>
    </div>

    <div v-if="adminStore.isLoading" class="loading">Cargando órdenes...</div>

    <div v-else-if="adminStore.orders.length === 0" class="empty">
      No hay órdenes
    </div>

    <table v-else class="orders-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in adminStore.orders" :key="order.order_id">
          <td data-label="ID">{{ order.order_id.slice(0, 8) }}</td>
          <td data-label="Cliente">{{ order.customer?.name || order.customer?.email || order.customer_id?.slice(0, 8) || '-' }}</td>
          <td data-label="Total">{{ formatPrice(order.total_amount) }}</td>
          <td data-label="Estado">
            <span :class="['status-badge', statusClass(order.status)]">{{ statusLabel(order.status) }}</span>
          </td>
          <td data-label="Fecha">{{ formatDate(order.created_at) }}</td>
          <td class="actions" data-label="Acciones">
            <button
              v-if="canConfirm(order.status)"
              @click="updateStatus(order.order_id, 'Confirmed')"
              class="btn-sm btn-confirm"
            >✓ Confirmar</button>
            <button
              v-if="canComplete(order.status)"
              @click="updateStatus(order.order_id, 'Completed')"
              class="btn-sm btn-complete"
            >✓ Completar</button>
            <button
              v-if="canCancel(order.status)"
              @click="updateStatus(order.order_id, 'Cancelled')"
              class="btn-sm btn-danger"
            >✕ Cancelar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@stores/adminStore';
import { useToast } from '../../composables/useToast';
import { formatPrice, formatDate } from '@utils/formatters';

const adminStore = useAdminStore();
const toast = useToast();
const selectedStatus = ref('');

onMounted(() => {
  loadOrders();
});

const loadOrders = async () => {
  await adminStore.fetchAllOrders(selectedStatus.value || undefined);
  if (adminStore.error) {
    toast.error(adminStore.error);
    adminStore.error = null;
  }
};

const updateStatus = async (orderId: string, status: string) => {
  const success = await adminStore.updateOrderStatus(orderId, status);
  if (success) {
    toast.success(`Orden ${status === 'Confirmed' ? 'confirmada' : status === 'Completed' ? 'completada' : 'cancelada'}`);
  } else if (adminStore.error) {
    toast.error(adminStore.error);
    adminStore.error = null;
  }
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const statusLabel = (s: string) => {
  const m: Record<string, string> = { pending: 'Pendiente', confirmed: 'Confirmado', completed: 'Completado', cancelled: 'Cancelado' };
  return m[s?.toLowerCase()] || s;
};
const statusClass = (s: string) => s?.toLowerCase() || '';
const canConfirm = (s: string) => ['pending', 'pendiente'].includes(s?.toLowerCase());
const canComplete = (s: string) => ['confirmed', 'confirmada', 'confirmado'].includes(s?.toLowerCase());
const canCancel = (s: string) => !['completed', 'completada', 'completado', 'cancelled', 'cancelada', 'cancelado'].includes(s?.toLowerCase());
</script>

<style scoped>
.admin-orders {
  width: 100%;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.empty {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table thead {
  background-color: #f8f9fa;
}

.orders-table th {
  padding: 1rem;
  text-align: left;
  color: #2c3e50;
  font-weight: 600;
  border-bottom: 2px solid #ecf0f1;
}

.orders-table td {
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
}

.status-select {
  padding: 0.25rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
}

.status-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.pending { background: #fef9e7; color: #f39c12; }
.status-badge.confirmed { background: #e8f0fe; color: #2980b9; }
.status-badge.completed { background: #e8f8e8; color: #27ae60; }
.status-badge.cancelled { background: #fde8e8; color: #e74c3c; }

.actions { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.btn-sm { padding: 0.3rem 0.6rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem; white-space: nowrap; }
.btn-confirm { background: #27ae60; color: #fff; }
.btn-complete { background: #3498db; color: #fff; }
.btn-danger { background: #e74c3c; color: #fff; }

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-select {
    width: 100%;
  }

  .refresh-btn {
    width: 100%;
    text-align: center;
  }

  .orders-table,
  .orders-table thead,
  .orders-table tbody,
  .orders-table tr,
  .orders-table th,
  .orders-table td {
    display: block;
  }

  .orders-table thead {
    display: none;
  }

  .orders-table tr {
    background: #fff;
    border-radius: 12px;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    border: 1px solid #ecf0f1;
    padding: 0.75rem;
  }

  .orders-table td {
    padding: 0.4rem 0;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .orders-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #2c3e50;
    flex-shrink: 0;
  }

  .orders-table td.actions {
    flex-wrap: wrap;
    gap: 0.35rem;
    padding-top: 0.5rem;
    border-top: 1px solid #ecf0f1;
    margin-top: 0.5rem;
  }

  .btn-sm {
    flex: 1;
    text-align: center;
    padding: 0.4rem 0.5rem;
    font-size: 0.78rem;
  }
}
</style>
