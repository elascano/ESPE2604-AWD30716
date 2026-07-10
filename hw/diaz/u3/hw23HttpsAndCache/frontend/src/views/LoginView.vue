<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiRequest, ApiError } from '../services/api';
import { useAuth } from '../stores/auth';

interface LoginResponse {
  message: string;
  token: string;
  role: string;
}

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

const router = useRouter();
const { setSession } = useAuth();

async function handleSubmit(): Promise<void> {
  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    console.log("1");

    const result = await apiRequest<LoginResponse>(
      '/fabuladental/auth/login',
      {
        method: 'POST',
        body: {
          username: username.value,
          password: password.value,
        },
      },
    );

    console.log("2", result);

    setSession(result.token, result.role);

    console.log("3");

    await router.push({ name: 'patients-list' });

    console.log("4");
  } catch (error) {
    console.error(error);

    errorMessage.value =
      error instanceof ApiError
        ? error.message
        : String(error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section class="login-screen">
    <div class="login-panel">
      <p class="eyebrow">Fábula Dental</p>
      <h1>Patient records access</h1>
      <p class="subtitle">Sign in with your clinic credentials.</p>

      <form class="login-form" @submit.prevent="handleSubmit">
        <label class="field">
          <span class="field-label">Username</span>
          <input v-model="username" type="text" required autocomplete="username" />
        </label>

        <label class="field">
          <span class="field-label">Password</span>
          <input v-model="password" type="password" required autocomplete="current-password" />
        </label>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <input
          class="submit-link"
          type="submit"
          :value="isSubmitting ? 'Signing in…' : 'Sign in →'"
          :disabled="isSubmitting"
        />
      </form>
    </div>
  </section>
</template>

<style scoped>
.login-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: var(--space-4);
}

.login-panel {
  width: min(400px, 90vw);
  border-left: 2px solid var(--color-border);
  padding-left: var(--space-4);
  transition: border-color var(--transition-normal);
}

.login-panel:focus-within {
  border-color: var(--color-accent);
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin: 0 0 var(--space-2);
}

h1 {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 var(--space-1);
}

.subtitle {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-4);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.field-label {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

input[type='text'],
input[type='password'] {
  border: none;
  border-bottom: 1px solid var(--color-border);
  background: transparent;
  padding: var(--space-2) 0;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-text);
  transition: border-color var(--transition-fast), padding var(--transition-fast);
}

input[type='text']:focus,
input[type='password']:focus {
  outline: none;
  border-bottom-color: var(--color-accent);
  padding-bottom: var(--space-2);
}

.error-message {
  font-family: var(--font-mono);
  color: var(--color-danger);
  font-size: 0.8rem;
  margin: 0;
  border-left: 1px solid var(--color-danger);
  padding-left: var(--space-2);
}

.submit-link {
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  margin-top: var(--space-2);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-accent);
  text-align: left;
  cursor: pointer;
  width: fit-content;
  transition: color var(--transition-fast), transform var(--transition-fast);
}

.submit-link:hover {
  color: var(--color-accent-hover);
  text-decoration: underline;
  transform: translateX(4px);
}

.submit-link:disabled {
  color: var(--color-text-muted);
  cursor: default;
  transform: none;
  text-decoration: none;
}
</style>