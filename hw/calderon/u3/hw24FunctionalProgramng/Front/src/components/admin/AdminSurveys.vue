<!-- src/components/admin/AdminSurveys.vue -->

<template>
  <div class="admin-surveys">
    <button @click="loadSurveys" class="refresh-btn">🔄 Actualizar</button>

    <div v-if="adminStore.isLoading" class="loading">Cargando encuestas...</div>

    <div v-else-if="adminStore.surveys.length === 0" class="empty">
      No hay encuestas
    </div>

    <div v-else class="surveys-grid">
      <div v-for="survey in adminStore.surveys" :key="survey.survey_id" class="survey-card">
        <div class="survey-rating">
          <span class="stars">⭐ {{ survey.rating }}/5</span>
        </div>
        <p class="customer">{{ survey.customer?.name }}</p>
        <p class="comments">{{ survey.comments || 'Sin comentarios' }}</p>
        <p class="date">{{ formatDate(survey.submitted_at) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAdminStore } from '@stores/adminStore';
import { useToast } from '../../composables/useToast';
import { formatDate } from '@utils/formatters';

const adminStore = useAdminStore();
const toast = useToast();

onMounted(() => {
  loadSurveys();
});

const loadSurveys = async () => {
  await adminStore.fetchSurveys();
  if (adminStore.error) {
    toast.error(adminStore.error);
    adminStore.error = null;
  }
};
</script>

<style scoped>
.admin-surveys {
  width: 100%;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.empty {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.surveys-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.survey-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #f39c12;
}

.survey-rating {
  margin-bottom: 0.5rem;
}

.stars {
  font-size: 1.2rem;
  color: #f39c12;
}

.customer {
  margin: 0.5rem 0;
  font-weight: 600;
  color: #2c3e50;
}

.comments {
  margin: 0.5rem 0;
  color: #7f8c8d;
  font-style: italic;
  line-height: 1.4;
}

.date {
  margin: 0.5rem 0 0 0;
  font-size: 0.85rem;
  color: #95a5a6;
}

@media (max-width: 768px) {
  .refresh-btn {
    width: 100%;
    text-align: center;
  }

  .surveys-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .survey-card {
    padding: 0.85rem;
  }

  .stars {
    font-size: 1rem;
  }

  .customer {
    font-size: 0.9rem;
  }

  .comments {
    font-size: 0.85rem;
  }
}
</style>
