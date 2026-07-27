<!-- src/components/admin/Dashboard.vue -->

<template>
  <div class="dashboard-container">
    <div class="container">
      <h1>Panel de Administración</h1>

      <div v-if="!userStore.isAdmin" class="unauthorized">
        <p>No tienes acceso a esta sección</p>
        <router-link to="/">Volver al inicio</router-link>
      </div>

      <div v-else>
        <div v-if="statsLoading" class="loading">Cargando datos...</div>
        <div v-else class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon orders">📦</div>
            <div class="stat-content">
              <p class="stat-label">Total Órdenes</p>
              <p class="stat-value">{{ adminStore.stats?.totalOrders || 0 }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon revenue">💰</div>
            <div class="stat-content">
              <p class="stat-label">Ingresos Totales</p>
              <p class="stat-value">{{ formatPrice(adminStore.stats?.totalRevenue || 0) }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon pending">⏳</div>
            <div class="stat-content">
              <p class="stat-label">Órdenes Pendientes</p>
              <p class="stat-value">{{ adminStore.stats?.pendingOrders || 0 }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon customers">👥</div>
            <div class="stat-content">
              <p class="stat-label">Total Clientes</p>
              <p class="stat-value">{{ adminStore.stats?.totalCustomers || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="nav-tabs">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="{ active: activeTab === tab }"
            class="tab-btn"
          >{{ tab }}</button>
        </div>

        <div class="tab-content">
          <AdminOrders v-if="activeTab === 'Órdenes'" />
          <AdminMenu v-if="activeTab === 'Menú'" />
          <AdminIngredients v-if="activeTab === 'Ingredientes'" />
          <AdminReservations v-if="activeTab === 'Reservas'" />
          <AdminInventory v-if="activeTab === 'Inventario'" />
          <AdminSurveys v-if="activeTab === 'Encuestas'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@stores/adminStore';
import { useUserStore } from '@stores/userStore';
import { useToast } from '../../composables/useToast';
import { formatPrice } from '@utils/formatters';
import AdminOrders from './AdminOrders.vue';
import AdminMenu from './AdminMenu.vue';
import AdminIngredients from './AdminIngredients.vue';
import AdminReservations from './AdminReservations.vue';
import AdminInventory from './AdminInventory.vue';
import AdminSurveys from './AdminSurveys.vue';

const adminStore = useAdminStore();
const userStore = useUserStore();
const toast = useToast();
const activeTab = ref('Órdenes');
const tabs = ['Órdenes', 'Menú', 'Ingredientes', 'Reservas', 'Inventario', 'Encuestas'];
const statsLoading = ref(false);

onMounted(async () => {
  statsLoading.value = true;
  await adminStore.fetchDashboardStats();
  statsLoading.value = false;
  if (adminStore.error) {
    toast.error(adminStore.error);
    adminStore.error = null;
  }
});
</script>

<style scoped>
.dashboard-container {
  padding: 2rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.unauthorized {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  color: #7f8c8d;
}

.unauthorized a {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
  align-items: center;
}

.stat-icon {
  font-size: 2.5rem;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.stat-icon.orders {
  background-color: #e8f4f8;
}

.stat-icon.revenue {
  background-color: #f0f8e8;
}

.stat-icon.pending {
  background-color: #fff4e8;
}

.stat-icon.customers {
  background-color: #f4e8f8;
}

.stat-label {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.stat-value {
  margin: 0.5rem 0 0 0;
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
}

.nav-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #ecf0f1;
  background: white;
  padding: 0;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

.tab-btn {
  padding: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  color: #7f8c8d;
  font-size: 1rem;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-btn:hover {
  background-color: #f8f9fa;
  color: #2c3e50;
}

.tab-btn.active {
  color: #3498db;
  border-bottom-color: #3498db;
}

.tab-content {
  background: white;
  padding: 2rem;
  border-radius: 0 8px 8px 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.placeholder {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem 0;
  }

  h1 {
    font-size: 1.4rem;
    margin-bottom: 1.25rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    padding: 1rem;
    gap: 0.75rem;
  }

  .stat-icon {
    font-size: 1.8rem;
    width: 50px;
    height: 50px;
  }

  .stat-value {
    font-size: 1.3rem;
  }

  .nav-tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: 0;
    border-radius: 8px;
  }

  .nav-tabs::-webkit-scrollbar {
    display: none;
  }

  .tab-btn {
    padding: 0.75rem 0.85rem;
    font-size: 0.85rem;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .tab-content {
    padding: 1rem;
    border-radius: 0 0 8px 8px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    padding: 0.85rem;
  }

  .tab-btn {
    padding: 0.6rem 0.7rem;
    font-size: 0.8rem;
  }

  .tab-content {
    padding: 0.75rem;
  }
}
</style>
