<!-- src/components/Register.vue -->

<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Crear Cuenta</h1>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Nombre Completo</label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            placeholder="Juan Pérez"
          />
        </div>

        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="tu@email.com"
          />
        </div>

        <div class="form-group">
          <label for="phone">Teléfono (Opcional)</label>
          <input
            id="phone"
            v-model="phone"
            type="tel"
            placeholder="+593 99 999 9999"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
          />
        </div>

        <div v-if="passwordError" class="error-message">
          {{ passwordError }}
        </div>

        <button
          type="submit"
          :disabled="userStore.isLoading"
          class="submit-btn"
        >
          {{ userStore.isLoading ? 'Cargando...' : 'Crear Cuenta' }}
        </button>
      </form>

      <div class="login-link">
        ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import { useToast } from '../composables/useToast';
import { validateEmail, validatePassword, validatePhone } from '../utils/validators';

const name = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const userStore = useUserStore();
const router = useRouter();
const toast = useToast();

const passwordError = computed(() => {
  if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
    return 'Las contraseñas no coinciden';
  }
  return '';
});

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    toast.error('Todos los campos obligatorios deben estar llenos');
    return;
  }
  if (!validateEmail(email.value)) {
    toast.error('El correo electrónico no es válido');
    return;
  }
  if (!validatePassword(password.value)) {
    toast.error('La contraseña debe tener al menos 8 caracteres');
    return;
  }
  if (passwordError.value) {
    toast.error(passwordError.value);
    return;
  }
  if (phone.value && !validatePhone(phone.value)) {
    toast.error('El teléfono no es válido');
    return;
  }

  const success = await userStore.register(
    name.value,
    email.value,
    password.value,
    phone.value || undefined
  );
  if (success) {
    toast.success('Cuenta creada exitosamente');
    router.push('/');
  } else if (userStore.error) {
    toast.error(userStore.error);
    userStore.error = null;
  }
};
</script>

<style scoped src="@/styles/pages/register.css"></style>
