import { ref } from 'vue';
import apiClient from '../utils/api';

const mapOrderFromApi = (o: any): any => ({
  order_id: o.orderId ?? o.order_id,
  customer_id: o.userId ?? o.customer_id,
  total_amount: o.totalAmount ?? o.total_amount,
  status: o.status ?? 'Pending',
  order_date: o.orderDate ?? o.order_date,
  delivery_date: o.deliveryDate ?? o.delivery_date,
  created_at: o.createdAt ?? o.created_at,
  updated_at: o.updatedAt ?? o.updated_at,
  customer: o.customer,
  orderDetails: (o.orderDetails ?? o.order_details ?? []).map((d: any) => ({
    detail_id: d.detailId ?? d.detail_id,
    order_id: d.orderId ?? d.order_id,
    dish_id: d.dishId ?? d.dish_id,
    quantity: d.quantity,
    unit_price: d.unitPrice ?? d.unit_price,
    subtotal: d.subtotal,
    dish: d.dish,
  })),
});

export const useOrders = () => {
  const orders = ref<any[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchUserOrders = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const userId = localStorage.getItem('user_id');
      const response = await apiClient.get('/orders');
      const all = (response.data.data ?? []).map(mapOrderFromApi);
      orders.value = all.filter(
        (o: any) => o.customer_id === userId
      );
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar las órdenes';
    } finally {
      isLoading.value = false;
    }
  };

  const getOrderById = async (id: string) => {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      return mapOrderFromApi(response.data.data);
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al obtener la orden';
      return null;
    }
  };

  const cancelOrder = async (id: string) => {
    try {
      const response = await apiClient.delete(`/orders/${id}`);
      const index = orders.value.findIndex((o) => o.order_id === id);
      if (index !== -1) {
        orders.value[index] = mapOrderFromApi(response.data.data);
      }
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cancelar la orden';
      return false;
    }
  };

  return {
    orders,
    isLoading,
    error,
    fetchUserOrders,
    getOrderById,
    cancelOrder,
  };
};
