<!-- src/components/Home.vue -->

<template>
  <div class="home-container">
    <section class="hero">
      <div class="container hero-content">
        <h1>SABOR &<br>ELEGANCIA</h1>
        <p>Descubre la verdadera cocina gourmet en el corazón de Quito.</p>
        <div class="hero-buttons">
          <router-link to="/reservations" class="hero-link">RESERVAR AHORA</router-link>
          <router-link to="/menu" class="hero-btn-outline">VER LA CARTA</router-link>
        </div>
      </div>
    </section>

    <section class="featured-dishes">
      <div class="container">
        <h2>Platos Destacados</h2>

        <div v-if="isLoading" class="loading">Cargando platos destacados...</div>
        <div v-else-if="featuredDishes.length === 0" class="loading">
          No hay platos disponibles
        </div>
        <div v-else class="dishes-grid">
          <div v-for="dish in featuredDishes" :key="dish.dish_id" class="dish-card">
            <img
              :src="dish.image_url || '/img/placeholder.jpg'"
              :alt="dish.name"
              class="dish-image"
            />
            <div class="dish-info">
              <h3>{{ dish.name }}</h3>
              <p>{{ dish.description }}</p>
              <span class="price">{{ formatPrice(dish.price) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <div class="feature-grid">
          <div class="feature">
            <div class="icon">🎯</div>
            <h3>Calidad Premium</h3>
            <p>Ingredientes frescos y de la mejor calidad</p>
          </div>
          <div class="feature">
            <div class="icon">👨‍🍳</div>
            <h3>Chefs Expertos</h3>
            <p>Preparado con técnicas gourmet</p>
          </div>
          <div class="feature">
            <div class="icon">⚡</div>
            <h3>Servicio Rápido</h3>
            <p>Atención personalizada en cada momento</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="container">
        <h2>¿Listo para una experiencia única?</h2>
        <p>Reserva tu mesa o realiza tu pedido ahora</p>
        <div class="button-group">
          <router-link to="/menu" class="btn btn-primary">Pedir Ahora</router-link>
          <router-link to="/reservations" class="btn btn-secondary">Hacer Reserva</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '../utils/api';
import { formatPrice } from '../utils/formatters';

const featuredDishes = ref<any[]>([]);
const isLoading = ref(false);

const mapDish = (d: any) => ({
  dish_id: d.itemId ?? d.dish_id,
  name: d.name,
  description: d.description,
  price: Number(d.price),
  image_url: d.imageUrl ?? d.image_url,
});

onMounted(async () => {
  isLoading.value = true;
  try {
    const res = await apiClient.get('/menu/dishes');
    const raw: any[] = res.data.data ?? [];
    featuredDishes.value = raw.map(mapDish).slice(0, 2);
  } catch {
    // API error — empty stays
  } finally {
    isLoading.value = false;
  }
});
</script>

<!-- Import page styles -->
<style scoped src="@/styles/pages/home.css"></style>
