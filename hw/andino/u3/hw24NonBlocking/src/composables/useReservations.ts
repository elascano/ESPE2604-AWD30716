import { ref } from 'vue';
import apiClient from '../utils/api';

export const useReservations = () => {
  const reservations = ref<any[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const mapReservation = (r: any) => ({
    reservation_id: r.reservationId ?? r.reservation_id,
    customer_id: r.userId ?? r.customer_id,
    reservation_date: r.reservationDate ?? r.reservation_date,
    reservation_time: r.reservationTime ?? r.reservation_time,
    party_size: r.partySize ?? r.party_size,
    special_requests: r.specialRequests ?? r.special_requests,
    status: r.status ?? 'Pending',
    customer: r.customer ?? r.user,
  });

  const fetchReservations = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get('/reservations');
      reservations.value = (response.data.data ?? []).map(mapReservation);
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar reservas';
    } finally {
      isLoading.value = false;
    }
  };

  const createReservation = async (
    date: string,
    time: string,
    party_size: number,
    special_requests?: string
  ) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.post('/reservations', {
        reservation_date: date,
        reservation_time: time,
        party_size,
        special_requests: special_requests || undefined,
      });
      reservations.value.push(mapReservation(response.data.data));
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al crear la reserva';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const cancelReservation = async (id: string) => {
    try {
      const response = await apiClient.delete(`/reservations/${id}`);
      const idx = reservations.value.findIndex(
        (r) => r.reservation_id === id
      );
      if (idx !== -1) {
        reservations.value[idx] = mapReservation(response.data.data);
      }
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cancelar la reserva';
      return false;
    }
  };

  return {
    reservations,
    isLoading,
    error,
    fetchReservations,
    createReservation,
    cancelReservation,
  };
};
