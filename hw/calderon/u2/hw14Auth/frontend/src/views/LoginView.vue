<template>
  <div class="login-wrapper">
    <div class="login-card">
      
      <img src="/logoRestaurantGreen.png" alt="Logo de Biconoir's Restaurant" class="logo" />

      <h2>Welcome to Biconoir's Restaurant</h2>
      <p class="subtitle">Please log in to continue.</p>
      
      <a href="/api/auth/google" class="google-btn">
        <svg class="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Sign in with Google
      </a>
      
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f7f6;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1); 
  text-align: center;
  max-width: 420px;
  width: 90%;
}

.logo {
  width: 140px;
  height: auto;
  margin-bottom: 24px;
  border-radius: 8px; 
}

h2 {
  margin: 0 0 8px;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.subtitle {
  color: #6c757d;
  margin-bottom: 32px;
  font-size: 15px;
}

.google-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  color: #3c4043;
  border: 1px solid #dadce0;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.google-btn:hover {
  background-color: #f8f9fa;
  border-color: #d2e3fc;
  box-shadow: 0 1px 3px rgba(60,64,67,0.15);
}

.google-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
}
</style>