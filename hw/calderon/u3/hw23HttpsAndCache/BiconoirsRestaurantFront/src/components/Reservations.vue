<!-- src/components/Reservations.vue -->

<template>
  <div class="reservations-container">
    <div class="container">
      <h1>Mis Reservas</h1>

      <div v-if="!userStore.isAuthenticated" class="not-authenticated">
        <p>Debes iniciar sesión para hacer reservas</p>
        <router-link to="/login" class="login-btn">Iniciar Sesión</router-link>
      </div>

      <div v-else class="reservations-content">
        <!-- Formulario para nueva reserva -->
        <div class="new-reservation">
          <h2>Nueva Reserva</h2>
          <form @submit.prevent="handleCreateReservation">
            <div class="form-group">
              <label for="date">Fecha</label>
              <input
                id="date"
                v-model="formData.date"
                type="date"
                required
              />
            </div>

            <div class="form-group">
              <label for="time">Hora</label>
              <input
                id="time"
                v-model="formData.time"
                type="time"
                required
              />
            </div>

            <div class="form-group">
              <label for="partySize">Número de Personas</label>
              <input
                id="partySize"
                v-model.number="formData.partySize"
                type="number"
                min="1"
                max="50"
                required
              />
            </div>

            <div class="form-group">
              <label for="requests">Solicitudes Especiales</label>
              <textarea
                id="requests"
                v-model="formData.requests"
                placeholder="Alergias, preferencias, etc."
                rows="3"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="reservationsStore.isLoading"
              class="submit-btn"
            >
              {{ reservationsStore.isLoading ? 'Creando...' : 'Crear Reserva' }}
            </button>
          </form>
        </div>

        <!-- Lista de reservas -->
        <div class="reservations-list">
          <h2>Mis Reservas</h2>

          <div v-if="reservationsStore.isLoading" class="loading">
            Cargando reservas...
          </div>

          <div v-else-if="reservationsStore.reservations.length === 0" class="empty">
            No tienes reservas aún
          </div>

          <div v-else class="reservations-grid">
            <div v-for="res in reservationsStore.reservations" :key="res.reservation_id" class="reservation-card">
              <div class="res-header">
                <h3>{{ formatDate(res.reservation_date) }}</h3>
                <span :class="['status', getStatusClass(res.status)]">
                  {{ getStatusLabel(res.status) }}
                </span>
              </div>

              <div class="res-details">
                <p><strong>Hora:</strong> {{ formatTime(res.reservation_time ?? res.reservation_date) }}</p>
                <p><strong>Personas:</strong> {{ res.party_size }}</p>
                <p v-if="res.special_requests"><strong>Solicitudes:</strong> {{ res.special_requests }}</p>
              </div>

              <div class="res-actions">
                <button
                  v-if="res.status !== 'Cancelled'"
                  @click="cancelReservation(res.reservation_id)"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useReservations } from '../composables/useReservations';
import { useUserStore } from '../stores/userStore';
import { useToast } from '../composables/useToast';
import { formatDate, formatTime, getStatusLabel } from '../utils/formatters';

const reservationsStore = reactive(useReservations());
const userStore = useUserStore();
const toast = useToast();

const formData = ref({
  date: '',
  time: '',
  partySize: 2,
  requests: ''
});

onMounted(() => {
  if (userStore.isAuthenticated) {
    reservationsStore.fetchReservations();
  }
});

const getStatusClass = (status: string) => {
  return status.toLowerCase().replace(' ', '-');
};

const handleCreateReservation = async () => {
  const success = await reservationsStore.createReservation(
    formData.value.date,
    formData.value.time,
    formData.value.partySize,
    formData.value.requests
  );

  if (success) {
    toast.success('¡Reserva creada exitosamente!');
    formData.value = { date: '', time: '', partySize: 2, requests: '' };
  } else if (reservationsStore.error) {
    toast.error(reservationsStore.error);
    reservationsStore.error = null;
  }
};

const cancelReservation = async (id: string) => {
  if (confirm('¿Deseas cancelar esta reserva?')) {
    const success = await reservationsStore.cancelReservation(id);
    if (success) {
      toast.success('Reserva cancelada');
    } else if (reservationsStore.error) {
      toast.error(reservationsStore.error);
      reservationsStore.error = null;
    }
  }
};
</script>

<style scoped src="@/styles/pages/reservations.css"></style>
