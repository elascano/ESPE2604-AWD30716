<script setup lang="ts">
import { ref } from 'vue';
import { apiRequest, ApiError } from '../../services/api';
import { useAuth } from '../../stores/auth';

const { token } = useAuth();

const phone = ref('');
const reason = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const result = ref<{ contactPriorityScore: number; requiresImmediateAttention: boolean } | null>(null);

async function run(): Promise<void> {
  errorMessage.value = '';
  result.value = null;
  isLoading.value = true;

  try {
    result.value = await apiRequest('/fabuladental/patients/contact-priority', {
      method: 'POST',
      token: token.value,
      body: {
        phone: phone.value,
        reasonForConsultation: reason.value
      }
    });
  } catch (error) {
    errorMessage.value =
      error instanceof ApiError ? error.message : 'Calculation failed.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="view-container">
    <header class="view-header">
      <div>
        <p class="eyebrow">Triage Rules</p>
        <h1>Contact Priority</h1>
      </div>
    </header>

    <p class="description">
      Scores a patient's contact urgency based on their phone record quality and the clinical urgency keywords detected in their reason for consultation.
    </p>

    <form @submit.prevent="run" class="rule-form">
      <label class="field">
        <span class="field-label">Phone number</span>
        <input v-model="phone" type="text" required placeholder="10 digits" />
      </label>
      <label class="field">
        <span class="field-label">Reason for consultation</span>
        <input v-model="reason" type="text" required placeholder="e.g. sangrado, dolor urgente" />
      </label>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <input
        class="submit-link"
        type="submit"
        :value="isLoading ? 'Calculating…' : 'Run calculation →'"
        :disabled="isLoading"
      />
    </form>

    <div v-if="result" class="rule-result">
      <p class="result-title">Assessment results</p>

      <div class="result-row">
        <span class="result-key">Priority Score</span>
        <span class="result-val accent">Score: {{ result.contactPriorityScore }} / 60</span>
      </div>

      <div class="result-row">
        <span class="result-key">Attention Level</span>
        <span
          class="result-val"
          :class="result.requiresImmediateAttention ? 'danger' : 'accent'"
        >
          {{ result.requiresImmediateAttention ? '🚨 Immediate attention required' : 'Normal scheduling queue' }}
        </span>
        <span v-if="result.requiresImmediateAttention" class="result-note">
          Urgent keywords detected or incomplete phone contact record.
        </span>
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
.result-val.danger { color: var(--color-danger); }
.result-note { font-size: 0.8rem; color: var(--color-text-muted); }
</style>
