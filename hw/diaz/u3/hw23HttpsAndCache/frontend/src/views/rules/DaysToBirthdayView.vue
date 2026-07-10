<script setup lang="ts">
import { ref } from 'vue';
import { apiRequest, ApiError } from '../../services/api';
import { useAuth } from '../../stores/auth';

const { token } = useAuth();

const birthday = ref('');
const isLoading = ref(false);
const error = ref('');
const result = ref<{
  daysUntilBirthday: number;
  isBirthdayWeek: boolean;
} | null>(null);

async function run() {
  if (!birthday.value) return;
  isLoading.value = true;
  error.value = '';
  result.value = null;
  try {
    const data = await apiRequest('/fabuladental/patients/days-to-birthday', {
      method: 'POST',
      body: {
          birthday: birthday.value
      },
      token: token.value,
    });
    result.value = data;
  } catch (e) {
    if (e instanceof ApiError) {
      error.value = e.message;
    } else {
      error.value = 'An unexpected error occurred.';
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="view-container">
    <header class="view-header">
      <div>
        <p class="eyebrow">Clinical Rules</p>
        <h1>Days to Birthday</h1>
      </div>
    </header>
    <p class="description">
      Calculates how many days remain until the patient's next birthday. Flags if the birthday falls within the current week.
    </p>
    <form @submit.prevent="run" class="rule-form">
      <div class="field">
        <label class="field-label" for="dtb-birthday">Date of birth</label>
        <input
          id="dtb-birthday"
          type="date"
          v-model="birthday"
          required
        />
      </div>
      <p v-if="error" class="error-message">{{ error }}</p>
      <input
        class="submit-link"
        type="submit"
        :value="isLoading ? 'Calculating…' : 'Run calculation →'"
        :disabled="isLoading"
      />
    </form>

    <div v-if="result" class="rule-result">
      <p class="result-title">Result</p>

      <div class="result-row">
        <span class="result-key">Days Until Birthday</span>
        <span class="result-val days-large">{{ result.daysUntilBirthday }}</span>
      </div>

      <div class="result-row">
        <span class="result-key">Birthday Week Status</span>
        <span v-if="result.isBirthdayWeek" class="result-val warn">⚠ Birthday this week!</span>
        <span v-else class="result-val">No upcoming birthday this week</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-container { max-width: 600px; }
.view-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-3); margin-bottom: var(--space-4); }
.eyebrow { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-accent); margin: 0 0 var(--space-1); }
h1 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 500; margin: 0; color: var(--color-text); }
.description { color: var(--color-text-muted); font-size: 0.95rem; line-height: 1.6; margin: 0 0 var(--space-5); }
.rule-form { display: flex; flex-direction: column; gap: var(--space-4); max-width: 400px; }
.field { display: flex; flex-direction: column; gap: var(--space-1); }
.field-label { font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-muted); }
input[type='text'], input[type='date'] { border: none; border-bottom: 1px solid var(--color-border); background: transparent; padding: var(--space-2) 0; font-family: var(--font-body); font-size: 0.95rem; color: var(--color-text); transition: border-color var(--transition-fast); width: 100%; }
input:focus { outline: none; border-bottom-color: var(--color-accent); }
.submit-link { appearance: none; background: none; border: none; padding: 0; font-family: var(--font-body); font-size: 0.95rem; font-weight: 600; color: var(--color-accent); cursor: pointer; transition: color var(--transition-fast); align-self: flex-start; }
.submit-link:hover { color: var(--color-accent-hover); text-decoration: underline; }
.submit-link:disabled { color: var(--color-text-muted); cursor: default; }
.error-message { color: var(--color-danger); font-family: var(--font-mono); font-size: 0.85rem; border-left: 2px solid var(--color-danger); padding-left: var(--space-2); }
.rule-result { margin-top: var(--space-5); border-top: 1px solid var(--color-border); padding-top: var(--space-4); }
.result-title { font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; color: var(--color-text-muted); margin: 0 0 var(--space-3); }
.result-row { display: flex; flex-direction: column; gap: var(--space-1); border-left: 2px solid var(--color-border); padding-left: var(--space-3); margin-bottom: var(--space-3); }
.result-key { font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; color: var(--color-text-muted); }
.result-val { font-family: var(--font-mono); font-size: 1.1rem; font-weight: 500; color: var(--color-text); }
.result-val.warn { color: #ffd214; }
.result-val.danger { color: var(--color-danger); }
.result-val.accent { color: var(--color-accent); }
.days-large { font-size: 2.5rem; }
.result-note { font-size: 0.8rem; color: var(--color-text-muted); }
</style>
