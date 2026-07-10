<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiRequest, ApiError } from '../services/api';
import { useAuth } from '../stores/auth';

interface Patient {
  patientID: string;
  fullName: string;
  birthday: string;
  phone: string;
  gender: string;
  reasonForConsultation: string;
  legalRepresentative: string | null;
}

const router = useRouter();
const { token } = useAuth();

const patients = ref<Patient[]>([]);
const searchTerm = ref('');
const isLoading = ref(true);
const errorMessage = ref('');
const selectedPatient = ref<Patient | null>(null);
const isEditing = ref(false);

const editForm = ref({
  fullName: '',
  birthday: '',
  phone: '',
  gender: '',
  reasonForConsultation: '',
  legalRepresentative: '',
});

const filteredPatients = computed(() => {
  const q = searchTerm.value.trim().toLowerCase();
  if (!q) return patients.value;
  return patients.value.filter(
    (p) =>
      p.fullName.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.patientID.includes(q)
  );
});

function formatDate(value: string): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-CA');
}

async function loadPatients(): Promise<void> {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    patients.value = await apiRequest<Patient[]>('/fabuladental/patients', { token: token.value });
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : 'Connection failed.';
    if (error instanceof ApiError && error.status === 401) {
      router.push({ name: 'login' });
    }
  } finally {
    isLoading.value = false;
  }
}

function selectPatient(patient: Patient): void {
  selectedPatient.value = selectedPatient.value?.patientID === patient.patientID ? null : patient;
  isEditing.value = false;
}

function startEditing(): void {
  if (!selectedPatient.value) return;
  const p = selectedPatient.value;
  editForm.value = {
    fullName: p.fullName,
    birthday: formatDate(p.birthday),
    phone: p.phone,
    gender: p.gender,
    reasonForConsultation: p.reasonForConsultation,
    legalRepresentative: p.legalRepresentative ?? '',
  };
  isEditing.value = true;
}

async function saveEdit(): Promise<void> {
  if (!selectedPatient.value) return;
  errorMessage.value = '';
  try {
    await apiRequest(`/fabuladental/patients/${selectedPatient.value.patientID}`, {
      method: 'PUT',
      token: token.value,
      body: { ...editForm.value, patientID: selectedPatient.value.patientID },
    });
    isEditing.value = false;
    selectedPatient.value = null;
    await loadPatients();
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : 'Update failed.';
  }
}

async function deletePatient(patientId: string): Promise<void> {
  errorMessage.value = '';
  try {
    await apiRequest(`/fabuladental/patients/${patientId}`, {
      method: 'DELETE',
      token: token.value,
    });
    selectedPatient.value = null;
    await loadPatients();
  } catch (error) {
    errorMessage.value = error instanceof ApiError ? error.message : 'Delete failed.';
  }
}

onMounted(loadPatients);
</script>

<template>
  <div class="view-container">
    <header class="view-header">
      <div>
        <p class="eyebrow">Patient Records</p>
        <h1>Registry</h1>
      </div>
      <a href="#" class="text-action" @click.prevent="loadPatients">↺ Refresh</a>
    </header>

    <div class="toolbar">
      <input
        v-model="searchTerm"
        type="search"
        class="filter-input"
        placeholder="Search by name, ID, or phone…"
      />
      <router-link to="/patients/create" class="text-action accent">+ New patient</router-link>
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="isLoading" class="status-message">Loading patients…</p>
    <p v-else-if="filteredPatients.length === 0 && !isLoading" class="status-message">
      No patients found matching your search.
    </p>

    <div v-else class="split-layout" :class="{ 'with-detail': selectedPatient }">
      <div class="table-section">
        <table class="patients-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Birthday</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="patient in filteredPatients"
              :key="patient.patientID"
              class="patient-row"
              :class="{ active: selectedPatient?.patientID === patient.patientID }"
              @click="selectPatient(patient)"
            >
              <td class="mono">{{ patient.patientID }}</td>
              <td class="name">{{ patient.fullName }}</td>
              <td class="mono">{{ patient.phone }}</td>
              <td>{{ patient.gender }}</td>
              <td class="mono">{{ formatDate(patient.birthday) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="selectedPatient" class="detail-section">
        <div v-if="!isEditing">
          <div class="detail-header">
            <div>
              <p class="detail-eyebrow">Patient File</p>
              <h2 class="detail-name">{{ selectedPatient.fullName }}</h2>
            </div>
            <a href="#" class="text-action muted" @click.prevent="selectedPatient = null">✕ Close</a>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Patient ID</span>
              <span class="info-val mono">{{ selectedPatient.patientID }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Birthday</span>
              <span class="info-val mono">{{ formatDate(selectedPatient.birthday) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phone</span>
              <span class="info-val mono">{{ selectedPatient.phone }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Gender</span>
              <span class="info-val">{{ selectedPatient.gender }}</span>
            </div>
            <div class="info-item full">
              <span class="info-label">Reason for consultation</span>
              <span class="info-val">{{ selectedPatient.reasonForConsultation }}</span>
            </div>
            <div class="info-item full">
              <span class="info-label">Legal representative</span>
              <span class="info-val">{{ selectedPatient.legalRepresentative ?? 'None (Adult)' }}</span>
            </div>
          </div>

          <div class="detail-actions">
            <a href="#" class="text-action accent" @click.prevent="startEditing">Edit patient →</a>
            <a href="#" class="text-action danger" @click.prevent="deletePatient(selectedPatient.patientID)">Delete records</a>
          </div>
        </div>

        <div v-else class="edit-form">
          <div class="detail-header">
            <h2 class="detail-name">Editing record</h2>
            <a href="#" class="text-action muted" @click.prevent="isEditing = false">Cancel</a>
          </div>

          <form @submit.prevent="saveEdit" class="patient-form">
            <label class="field">
              <span class="field-label">Full name</span>
              <input v-model="editForm.fullName" type="text" required />
            </label>
            <label class="field">
              <span class="field-label">Birthday</span>
              <input v-model="editForm.birthday" type="date" required />
            </label>
            <label class="field">
              <span class="field-label">Phone (10 digits)</span>
              <input v-model="editForm.phone" type="text" required />
            </label>
            <label class="field">
              <span class="field-label">Gender</span>
              <input v-model="editForm.gender" type="text" required />
            </label>
            <label class="field">
              <span class="field-label">Reason for consultation</span>
              <input v-model="editForm.reasonForConsultation" type="text" required />
            </label>
            <label class="field">
              <span class="field-label">Legal representative</span>
              <input v-model="editForm.legalRepresentative" type="text" />
            </label>
            <div class="form-actions">
              <input class="submit-link" type="submit" value="Save changes →" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-container {
  max-width: 1400px;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-3);
  margin-bottom: var(--space-4);
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

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.filter-input {
  flex: 1;
  max-width: 360px;
  border: none;
  border-bottom: 1px solid var(--color-border);
  background: transparent;
  padding: var(--space-2) 0;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-text);
  transition: border-color var(--transition-fast);
}

.filter-input:focus {
  outline: none;
  border-bottom-color: var(--color-accent);
}

.text-action {
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
  transition: color var(--transition-fast);
  white-space: nowrap;
}

.text-action.accent { color: var(--color-accent); font-weight: 500; }
.text-action.accent:hover { text-decoration: underline; color: var(--color-accent-hover); }
.text-action.muted { color: var(--color-text-muted); }
.text-action.muted:hover { color: var(--color-text); }
.text-action.danger { color: var(--color-danger); }
.text-action.danger:hover { text-decoration: underline; }

.error-message {
  color: var(--color-danger);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  border-left: 2px solid var(--color-danger);
  padding-left: var(--space-2);
  margin-bottom: var(--space-3);
}

.status-message {
  color: var(--color-text-muted);
  font-size: 0.95rem;
}

.split-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-5);
}

@media (min-width: 960px) {
  .split-layout.with-detail {
    grid-template-columns: 1.2fr 0.8fr;
  }
}

.table-section {
  overflow-x: auto;
}

.patients-table {
  width: 100%;
  border-collapse: collapse;
}

.patients-table th {
  text-align: left;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  padding: var(--space-3) var(--space-2);
  border-bottom: 1px solid var(--color-border);
}

.patients-table td {
  padding: var(--space-3) var(--space-2);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.9rem;
}

.patient-row {
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.patient-row:hover { background-color: var(--color-surface); }

.patient-row.active {
  background-color: rgba(0, 229, 163, 0.05);
}

.patient-row.active td { border-bottom-color: var(--color-accent); }

.name { font-weight: 500; }
.mono { font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-text-muted); }

.detail-section {
  border-left: 1px solid var(--color-border);
  padding-left: var(--space-4);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-3);
}

.detail-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin: 0;
}

.detail-name {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  margin: var(--space-1) 0 0 0;
  color: var(--color-text);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.info-item { display: flex; flex-direction: column; gap: var(--space-1); }
.info-item.full { grid-column: span 2; }

.info-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.info-val { font-size: 0.9rem; color: var(--color-text); }

.detail-actions {
  display: flex;
  gap: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
}

.edit-form .detail-header h2 { margin: 0; }

.patient-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.field-label {
  font-size: 0.7rem;
  font-family: var(--font-mono);
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.patient-form input[type='text'],
.patient-form input[type='date'] {
  border: none;
  border-bottom: 1px solid var(--color-border);
  background: transparent;
  padding: var(--space-2) 0;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-text);
  transition: border-color var(--transition-fast);
}

.patient-form input:focus { outline: none; border-bottom-color: var(--color-accent); }

.form-actions { margin-top: var(--space-2); }

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
</style>
