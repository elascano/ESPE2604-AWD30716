import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '../utils/api';

const mapOrder = (o: any): any => ({
  order_id: o.orderId ?? o.order_id,
  customer_id: o.userId ?? o.customer_id,
  total_amount: o.totalAmount ?? o.total_amount,
  status: o.status ?? 'Pending',
  order_date: o.orderDate ?? o.order_date,
  created_at: o.createdAt ?? o.created_at,
  updated_at: o.updatedAt ?? o.updated_at,
  customer: o.customer ?? o.user,
  orderDetails: (o.orderDetails ?? o.order_details ?? []).map((d: any) => ({
    detail_id: d.detailId ?? d.detail_id,
    dish_id: d.dishId ?? d.dish_id,
    quantity: d.quantity,
    unit_price: d.unitPrice ?? d.unit_price,
    subtotal: d.subtotal,
    dish: d.dish,
  })),
});

const mapReservation = (r: any): any => ({
  reservation_id: r.reservationId ?? r.reservation_id,
  customer_id: r.userId ?? r.customer_id,
  reservation_date: r.reservationDate ?? r.reservation_date,
  reservation_time: r.reservationTime ?? r.reservation_time,
  party_size: r.partySize ?? r.party_size,
  special_requests: r.specialRequests ?? r.special_requests,
  status: r.status ?? 'Pending',
  created_at: r.createdAt ?? r.created_at,
  customer: r.customer ?? r.user,
});

const mapSurvey = (s: any): any => ({
  survey_id: s.surveyId ?? s.survey_id,
  customer_id: s.userId ?? s.customer_id,
  rating: s.rating,
  comments: s.comments,
  submitted_at: s.submittedAt ?? s.submitted_at,
  created_at: s.createdAt ?? s.created_at,
  customer: s.customer,
});

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalCustomers: number;
}

export const useAdminStore = defineStore('admin', () => {
  const stats = ref<DashboardStats | null>(null);
  const orders = ref<any[]>([]);
  const reservations = ref<any[]>([]);
  const surveys = ref<any[]>([]);
  const dishes = ref<any[]>([]);
  const categories = ref<any[]>([]);
  const ingredients = ref<any[]>([]);
  const inventory = ref<any[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchDashboardStats = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get('/admin/stats');
      stats.value = response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar estadísticas';
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAllOrders = async (status?: string, page: number = 1) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get('/orders',
        { params: { status, page, limit: 50 } }
      );
      orders.value = (response.data.data ?? []).map(mapOrder);
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar órdenes';
    } finally {
      isLoading.value = false;
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    error.value = null;
    try {
      const response = await apiClient.put(`/orders/${orderId}`, { status });
      const index = orders.value.findIndex((o: any) => o.order_id === orderId);
      if (index !== -1) {
        orders.value[index] = mapOrder(response.data.data);
      }
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al actualizar estado';
      return false;
    }
  };

  const fetchAllReservations = async (status?: string, page: number = 1) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get('/reservations',
        { params: { status, page, limit: 50 } }
      );
      reservations.value = (response.data.data ?? []).map(mapReservation);
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar reservas';
    } finally {
      isLoading.value = false;
    }
  };

  const updateReservationStatus = async (reservationId: string, status: string) => {
    error.value = null;
    try {
      const response = await apiClient.put(`/reservations/${reservationId}`, { status });
      const index = reservations.value.findIndex(
        (r: any) => r.reservation_id === reservationId
      );
      if (index !== -1) {
        reservations.value[index] = mapReservation(response.data.data);
      }
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al actualizar reserva';
      return false;
    }
  };

  const fetchSurveys = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get('/surveys');
      surveys.value = (response.data.data ?? []).map(mapSurvey);
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar encuestas';
    } finally {
      isLoading.value = false;
    }
  };

  const fetchDishes = async () => {
    try {
      const response = await apiClient.get('/menu/dishes');
      dishes.value = response.data.data ?? [];
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar platos';
    }
  };

  const createDish = async (data: any) => {
    error.value = null;
    try {
      const response = await apiClient.post('/menu/dishes', data);
      dishes.value.push(response.data.data);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al crear plato';
      return false;
    }
  };

  const updateDish = async (dishId: string, data: any) => {
    error.value = null;
    try {
      const response = await apiClient.put(`/menu/dishes/${dishId}`, data);
      const index = dishes.value.findIndex((d: any) => d.itemId === dishId || d.item_id === dishId);
      if (index !== -1) dishes.value[index] = response.data.data;
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al actualizar plato';
      return false;
    }
  };

  const deleteDish = async (dishId: string) => {
    error.value = null;
    try {
      await apiClient.delete(`/menu/dishes/${dishId}`);
      dishes.value = dishes.value.filter((d: any) => d.itemId !== dishId && d.item_id !== dishId);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al eliminar plato';
      return false;
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/menu/categories');
      categories.value = response.data.data ?? [];
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar categorías';
    }
  };

  const createCategory = async (data: any) => {
    error.value = null;
    try {
      const response = await apiClient.post('/menu/categories', data);
      categories.value.push(response.data.data);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al crear categoría';
      return false;
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await apiClient.get('/ingredients');
      ingredients.value = response.data.data ?? [];
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar ingredientes';
    }
  };

  const createIngredient = async (data: any) => {
    error.value = null;
    try {
      const response = await apiClient.post('/ingredients', data);
      ingredients.value.push(response.data.data);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al crear ingrediente';
      return false;
    }
  };

  const updateIngredient = async (ingredientId: string, data: any) => {
    error.value = null;
    try {
      const response = await apiClient.put(`/ingredients/${ingredientId}`, data);
      const index = ingredients.value.findIndex(
        (i: any) => i.skuCode === ingredientId || i.sku_code === ingredientId
      );
      if (index !== -1) ingredients.value[index] = response.data.data;
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al actualizar ingrediente';
      return false;
    }
  };

  const deleteIngredient = async (ingredientId: string) => {
    error.value = null;
    try {
      await apiClient.delete(`/ingredients/${ingredientId}`);
      ingredients.value = ingredients.value.filter(
        (i: any) => i.skuCode !== ingredientId && i.sku_code !== ingredientId
      );
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al eliminar ingrediente';
      return false;
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await apiClient.get('/inventory');
      inventory.value = response.data.data ?? [];
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar inventario';
    }
  };

  const createInventoryItem = async (data: any) => {
    error.value = null;
    try {
      const response = await apiClient.post('/inventory', data);
      inventory.value.push(response.data.data);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al crear ítem de inventario';
      return false;
    }
  };

  const updateInventoryItem = async (inventoryId: string, data: any) => {
    error.value = null;
    try {
      const response = await apiClient.put(`/inventory/${inventoryId}`, data);
      const index = inventory.value.findIndex(
        (i: any) => i.inventoryId === inventoryId || i.inventory_id === inventoryId
      );
      if (index !== -1) inventory.value[index] = response.data.data;
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al actualizar ítem de inventario';
      return false;
    }
  };

  const deleteInventoryItem = async (inventoryId: string) => {
    error.value = null;
    try {
      await apiClient.delete(`/inventory/${inventoryId}`);
      inventory.value = inventory.value.filter(
        (i: any) => i.inventoryId !== inventoryId && i.inventory_id !== inventoryId
      );
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al eliminar ítem de inventario';
      return false;
    }
  };

  return {
    stats, orders, reservations, surveys, dishes, categories, ingredients, inventory,
    isLoading, error,
    fetchDashboardStats,
    fetchAllOrders, updateOrderStatus,
    fetchAllReservations, updateReservationStatus,
    fetchSurveys,
    fetchDishes, createDish, updateDish, deleteDish,
    fetchCategories, createCategory,
    fetchIngredients, createIngredient, updateIngredient, deleteIngredient,
    fetchInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem,
  };
});
