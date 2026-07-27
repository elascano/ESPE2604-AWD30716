<!-- src/components/Menu.vue -->

<template>
  <div class="menu-container">
    <div class="container">
      <h1>Nuestro Menú</h1>
      
      <div class="filters">
        <button
          v-for="category in menuStore.categories"
          :key="category"
          @click="menuStore.selectedCategory = category"
          :class="{ active: menuStore.selectedCategory === category }"
          class="filter-btn"
        >
          {{ category }}
        </button>
        <button
          @click="menuStore.selectedCategory = ''"
          :class="{ active: menuStore.selectedCategory === '' }"
          class="filter-btn"
        >
          Todos
        </button>
      </div>

      <div v-if="menuStore.isLoading" class="loading">Cargando platos...</div>

      <div v-else-if="menuStore.filteredDishes.length === 0" class="empty">
        No hay platos disponibles
      </div>

      <div v-else class="dishes-grid">
        <div v-for="dish in menuStore.filteredDishes" :key="dish.dish_id" class="dish-card">
          <div class="dish-image">
            <img :src="dish.image_url || '/img/placeholder.jpg'" :alt="dish.name" />
          </div>
          <div class="dish-info">
            <h3>{{ dish.name }}</h3>
            <p class="description">{{ dish.description }}</p>
            <div class="dish-footer">
              <span class="price">{{ formatPrice(dish.price) }}</span>
              <button
                @click="addToCart(dish)"
                class="add-btn"
              >
                Agregar
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
import { useMenu } from '../composables/useMenu';
import { useCartStore } from '../stores/cartStore';
import { useToast } from '../composables/useToast';
import { formatPrice } from '../utils/formatters';

const menuStore = reactive(useMenu());
const cartStore = useCartStore();
const toast = useToast();

onMounted(async () => {
  await menuStore.fetchCategories();
  await menuStore.fetchDishes();
});

const addToCart = (dish: any) => {
  cartStore.addItem(dish, 1);
  toast.success(`${dish.name} agregado al carrito`);
};
</script>

<style scoped src="@/styles/pages/menu.css"></style>
