<template>
  <div class="home-container">
    <nav class="navbar">
      <div class="brand">
        <img src="/logoRestaurantGreen.png" alt="Biconoir's Restaurant Logo" class="nav-logo" />
        <h2>Biconoir's Restaurant</h2>
      </div>
      <button @click="handleLogout" class="logout-btn">Log Out</button>
    </nav>
    
    <main>
      <h1>Main Dashboard</h1>
      <p>Your session is active for 1 minute.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = async () => {
  try {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (response.ok) {
      router.push({ name: 'login' });
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.brand {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-logo {
  height: 40px;
  width: auto;
  border-radius: 4px;
}

.navbar h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #c82333;
}

main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
}

p {
  color: #6c757d;
}
</style>