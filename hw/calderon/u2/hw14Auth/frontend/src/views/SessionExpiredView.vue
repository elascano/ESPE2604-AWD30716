<template>
  <div class="expired-container">
    <h2>Your session has expired</h2>
    <p>For security reasons, please authenticate again.</p>
    
    <button @click="goToLogin" class="relogin-btn">
      Log in again
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
  router.push({ name: 'login' });
};
</script>

<style scoped>
.expired-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}
.relogin-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>