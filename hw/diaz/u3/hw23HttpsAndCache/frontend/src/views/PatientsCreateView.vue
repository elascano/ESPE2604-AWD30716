<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiRequest, ApiError } from '../services/api';
import { useAuth } from '../stores/auth';

const router = useRouter();
const { token } = useAuth();

const form = ref({
  patientID: '',
  fullName: '',
  birthday: '',
  phone: '',
  gender: '',
  reasonForConsultation: '',
  legalRepresentative: '',
});

const errorMessage = ref('');
const successMessage = ref('');
const isSubmitting = ref(false);

async function submitForm(): Promise<void> {
  errorMessage.value = '';
  successMessage.value = '';
  isSubmitting.value = true;

  try {
    await apiRequest('/fabuladental/patients', {
      method: 'POST',
      token: token.value,
      body: form.value,
    });
    successMessage.value = 'Patient registered successfully.';
    resetForm();
    setTimeout(() => router.push({ name: 'patients-list' }), 1200);
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : 'Registration failed.';
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm(): void {
  form.value = {
    patientID: '',
    fullName: '',
    birthday: '',
    phone: '',
    gender: '',
    reasonForConsultation: '',
    legalRepresentative: '',
  };
}
</script>

<template>
  <div class="view-container">
    <header class="view-header">
      <div>
        <p class="eyebrow">Patient Records</p>
        <h1>Register new patient</h1>
      </div>
      <router-link to="/patients/list" class="text-action muted">← Back to list</router-link>
    </header>

    <form @submit.prevent="submitForm" class="patient-form">
      <div class="form-grid">
        <label class="field">
          <span class="field-label">Patient ID *</span>
          <input v-model="form.patientID" type="text" required placeholder="e.g. 123456789" />
        </label>

        <label class="field">
          <span class="field-label">Full name *</span>
          <input v-model="form.fullName" type="text" required placeholder="First and last name" />
        </label>

        <label class="field">
          <span class="field-label">Birthday *</span>
          <input v-model="form.birthday" type="date" required />
        </label>

        <label class="field">
          <span class="field-label">Phone (10 digits) *</span>
          <input v-model="form.phone" type="text" required placeholder="0987654321" />
        </label>

        <label class="field">
          <span class="field-label">Gender *</span>
          <select v-model="form.gender" required class="select-input">
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label class="field full">
          <span class="field-label">Reason for consultation *</span>
          <input v-model="form.reasonForConsultation" type="text" required placeholder="Briefly describe the reason" />
        </label>

        <label class="field full">
          <span class="field-label">Legal representative (if under 18)</span>
          <input v-model="form.legalRepresentative" type="text" placeholder="Full name of legal guardian" />
        </label>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

      <div class="form-actions">
        <input
          class="submit-link"
          type="submit"
          :value="isSubmitting ? 'Registering…' : 'Register patient →'"
          :disabled="isSubmitting"
        />
        <a href="#" class="text-action muted" @click.prevent="resetForm">Clear form</a>
      </div>
    </form>
  </div>
</template>

<style scoped>
.view-container { max-width: 720px; }

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-3);
  margin-bottom: var(--space-5);
}

.eyebrow {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin: 0 0 var(--space-1);
}

h1 {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 500;
  margin: 0;
  color: var(--color-text);
}

.text-action {
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.text-action.muted { color: var(--color-text-muted); }
.text-action.muted:hover { color: var(--color-text); }

.patient-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4) var(--space-5);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.field.full { grid-column: span 2; }

.field-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

input[type='text'],
input[type='date'],
.select-input {
  border: none;
  border-bottom: 1px solid var(--color-border);
  background: transparent;
  padding: var(--space-2) 0;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-text);
  transition: border-color var(--transition-fast);
  width: 100%;
}

input:focus,
.select-input:focus {
  outline: none;
  border-bottom-color: var(--color-accent);
}

.select-input option { background: var(--color-surface); color: var(--color-text); }

.error-message {
  color: var(--color-danger);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  border-left: 2px solid var(--color-danger);
  padding-left: var(--space-2);
}

.success-message {
  color: var(--color-accent);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  border-left: 2px solid var(--color-accent);
  padding-left: var(--space-2);
}

.form-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.submit-link {
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-accent);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.submit-link:hover { color: var(--color-accent-hover); text-decoration: underline; }
.submit-link:disabled { color: var(--color-text-muted); cursor: default; }
</style>
