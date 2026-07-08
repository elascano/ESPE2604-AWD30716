<!-- src/components/layouts/MainLayout.vue -->

<template>
  <div class="main-layout">
    <nav class="navbar">
      <div class="container nav-container">
        <router-link to="/" class="logo-section">
          <img src="@/assets/img/logoRestaurantGreen.png" alt="Biconoir's" class="logo-image" />
        </router-link>

        <button class="hamburger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menú">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="nav-wrapper" :class="{ open: menuOpen }">
          <ul class="nav-links">
            <li><router-link to="/" @click="menuOpen = false">Inicio</router-link></li>
            <li><router-link to="/menu" @click="menuOpen = false">Menú</router-link></li>
            <li><router-link to="/about" @click="menuOpen = false">Sobre Nosotros</router-link></li>
            <li><router-link to="/reservations" @click="menuOpen = false">Reservar</router-link></li>
            <li><router-link to="/survey" @click="menuOpen = false">Encuesta</router-link></li>
            <li><router-link to="/orders" @click="menuOpen = false">Mis Pedidos</router-link></li>
          </ul>

          <div class="user-actions">
            <router-link class="cart-icon" to="/cart" aria-label="Carrito" @click="menuOpen = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </router-link>
            <div v-if="!userStore.isAuthenticated">
              <router-link to="/login" class="login-btn" @click="menuOpen = false">Entrar</router-link>
            </div>
            <div v-else class="user-menu">
              <router-link v-if="userStore.isAdmin" to="/admin/dashboard" class="admin-link" @click="menuOpen = false">Admin</router-link>
              <span class="user-name">{{ userStore.user?.name || 'Usuario' }}</span>
              <button class="logout-btn" @click="userStore.logout(); menuOpen = false">Salir</button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="content">
      <router-view />
    </main>

    <ToastNotification />

    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-section">
          <h4>Contacto</h4>
          <p>Dirección ficticia · Tel: 000-000-000</p>
        </div>
        <div class="footer-section">
          <h4>Enlaces</h4>
          <p><router-link to="/about">Sobre Nosotros</router-link></p>
        </div>
        <div class="footer-section">
          <h4>Síguenos</h4>
          <p>Redes sociales ficticias</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import ToastNotification from '../ToastNotification.vue';

const userStore = useUserStore();
const menuOpen = ref(false);
</script>

<style src="@/styles/pages/mainlayout.css"></style>
