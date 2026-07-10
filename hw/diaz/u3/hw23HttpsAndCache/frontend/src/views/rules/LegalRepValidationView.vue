<script setup lang="ts">
import { ref } from 'vue';
import { apiRequest, ApiError } from '../../services/api';
import { useAuth } from '../../stores/auth';

const { token } = useAuth();

const birthday = ref('');
const legalRep = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const result = ref<{ requiresLegalRepresentative: boolean; message: string } | null>(null);

async function run(): Promise<void> {
  errorMessage.value = '';
  result.value = null;
  isLoading.value = true;
  try {
    result.value = await apiRequest('/fabuladental/patients/legal-representative-validation', {
      method: 'POST',
      token: token.value,
      body: { birthday: birthday.value, legalRepresentative: legalRep.value },
    });
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : 'Validation failed.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="view-container">
    <header class="view-header">
      <div>
        <p class="eyebrow">Compliance Rules</p>
        <h1>Legal Representative</h1>
      </div>
    </header>

    <p class="description">
      Validates whether a legal representative is required for a patient based on their age, and confirms whether the provided representative name satisfies the requirement.
    </p>

    <form @submit.prevent="run" class="rule-form">
      <label class="field">
        <span class="field-label">Date of birth</span>
        <input v-model="birthday" type="date" required />
      </label>
      <label class="field">
        <span class="field-label">Legal representative name</span>
        <input v-model="legalRep" type="text" placeholder="Full name of guardian (if applicable)" />
      </label>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <input
        class="submit-link"
        type="submit"
        :value="isLoading ? 'Validating…' : 'Run validation →'"
        :disabled="isLoading"
      />
    </form>

    <div v-if="result" class="rule-result">
      <p class="result-title">Validation result</p>

      <div class="result-row">
        <span class="result-key">Representative Required</span>
        <span
          class="result-val"
          :class="result.requiresLegalRepresentative ? 'warn' : 'accent'"
        >
          {{ result.requiresLegalRepresentative ? 'Required' : 'Not required' }}
        </span>
      </div>

      <div class="result-row">
        <span class="result-key">Status message</span>
        <span class="result-note large">{{ result.message }}</span>
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
.result-val.accent { color: var(--color-accent); }
.result-val.warn { color: #ffd214; }
.result-note { font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.5; }
.result-note.large { font-size: 0.95rem; color: var(--color-text); }
</style>
