<template>
  <div class="admin-reservations">
    <div class="toolbar">
      <select v-model="selectedStatus" class="filter-select">
        <option value="">Todos los estados</option>
        <option value="Pending">Pendiente</option>
        <option value="Confirmed">Confirmada</option>
        <option value="Cancelled">Cancelada</option>
        <option value="Completed">Completada</option>
      </select>
      <button @click="loadReservations" class="btn btn-outline">🔄 Actualizar</button>
    </div>

    <div v-if="adminStore.isLoading" class="loading">Cargando reservas...</div>

    <div v-else-if="reservations.length === 0" class="empty">
      No hay reservas
    </div>

    <table v-else class="data-table">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Personas</th>
          <th>Solicitudes</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="res in reservations" :key="res.reservationId || res.reservation_id">
          <td data-label="Cliente">{{ res.customer?.name || res.user?.name || '-' }}</td>
          <td data-label="Fecha">{{ formatDate(res.reservationDate ?? res.reservation_date) }}</td>
          <td data-label="Hora">{{ formatTime(res.reservationTime ?? res.reservation_time) }}</td>
          <td data-label="Personas">{{ res.partySize ?? res.party_size }}</td>
          <td data-label="Solicitudes">{{ res.specialRequests || res.special_requests || '-' }}</td>
          <td data-label="Estado">
            <span :class="statusBadge(res.status).class">{{ statusBadge(res.status).label }}</span>
          </td>
          <td class="actions" data-label="Acciones">
            <button
              v-if="res.status === 'Pending' || res.status === 'pending'"
              @click="changeStatus(res, 'Confirmed')"
              class="btn-sm btn-confirm"
            >✓ Confirmar</button>
            <button
              v-if="res.status === 'Pending' || res.status === 'pending' || res.status === 'Confirmed'"
              @click="changeStatus(res, 'Cancelled')"
              class="btn-sm btn-danger"
            >✕ Cancelar</button>
            <button
              v-if="res.status === 'Confirmed'"
              @click="changeStatus(res, 'Completed')"
              class="btn-sm btn-complete"
            >✓ Completada</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@stores/adminStore';
import { useToast } from '../../composables/useToast';
import { formatDate, formatTime } from '@utils/formatters';

const adminStore = useAdminStore();
const toast = useToast();
const selectedStatus = ref('');

const reservations = computed(() => adminStore.reservations);

onMounted(() => {
  loadReservations();
});

const loadReservations = async () => {
  await adminStore.fetchAllReservations(selectedStatus.value || undefined);
  if (adminStore.error) {
    toast.error(adminStore.error);
    adminStore.error = null;
  }
};

const changeStatus = async (res: any, newStatus: string) => {
  const id = res.reservationId || res.reservation_id;
  const ok = await adminStore.updateReservationStatus(id, newStatus);
  if (ok) {
    toast.success(`Reserva ${newStatus === 'Confirmed' ? 'confirmada' : newStatus === 'Cancelled' ? 'cancelada' : 'completada'}`);
  } else {
    toast.error(adminStore.error || 'Error al actualizar');
  }
};

const statusBadge = (status: string) => {
  const s = status?.toLowerCase() || '';
  if (s === 'confirmed' || s === 'confirmada') return { class: 'badge badge-blue', label: 'Confirmada' };
  if (s === 'completed' || s === 'completada') return { class: 'badge badge-green', label: 'Completada' };
  if (s === 'cancelled' || s === 'cancelada') return { class: 'badge badge-red', label: 'Cancelada' };
  return { class: 'badge badge-yellow', label: 'Pendiente' };
};
</script>

<style scoped>
.admin-reservations { width: 100%; }
.toolbar { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.filter-select { padding: 0.5rem; border: 1px solid #bdc3c7; border-radius: 6px; }
.btn { padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
.btn-outline { background: transparent; border: 1px solid #bdc3c7; color: #2c3e50; }
.btn-sm { padding: 0.3rem 0.6rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem; white-space: nowrap; }
.btn-confirm { background: #27ae60; color: #fff; }
.btn-danger { background: #e74c3c; color: #fff; }
.btn-complete { background: #3498db; color: #fff; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { background: #f8f9fa; padding: 0.75rem 1rem; text-align: left; color: #2c3e50; font-weight: 600; border-bottom: 2px solid #ecf0f1; }
.data-table td { padding: 0.75rem 1rem; border-bottom: 1px solid #ecf0f1; }
.actions { display: flex; gap: 0.4rem; }
.badge { padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600; }
.badge-blue { background: #e8f0fe; color: #2980b9; }
.badge-green { background: #e8f8e8; color: #27ae60; }
.badge-yellow { background: #fef9e7; color: #f39c12; }
.badge-red { background: #fde8e8; color: #e74c3c; }
.loading, .empty { text-align: center; padding: 2rem; color: #7f8c8d; }

@media (max-width: 768px) {
  .data-table,
  .data-table thead,
  .data-table tbody,
  .data-table tr,
  .data-table th,
  .data-table td {
    display: block;
  }

  .data-table thead {
    display: none;
  }

  .data-table tr {
    background: #fff;
    border-radius: 12px;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    border: 1px solid #ecf0f1;
    padding: 0.75rem;
  }

  .data-table td {
    padding: 0.4rem 0;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .data-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #2c3e50;
    flex-shrink: 0;
  }

  .data-table td.actions {
    flex-wrap: wrap;
    gap: 0.35rem;
    padding-top: 0.5rem;
    border-top: 1px solid #ecf0f1;
    margin-top: 0.5rem;
  }

  .btn-sm {
    flex: 1;
    text-align: center;
  }

  .toolbar {
    flex-direction: column;
  }

  .toolbar .filter-select {
    width: 100%;
  }

  .toolbar .btn {
    width: 100%;
    text-align: center;
  }
}
</style>
