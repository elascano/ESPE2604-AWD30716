<!-- src/components/Survey.vue -->

<template>
  <div class="survey-container">
    <div class="container">
      <h1>Cuéntanos Tu Experiencia</h1>
      <p class="subtitle">Tu opinión es muy importante para nosotros</p>

      <div class="survey-card">
        <form @submit.prevent="submitSurvey">
          <div class="form-group">
            <label>Calificación</label>
            <div class="rating">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="formData.rating = star"
                :class="{ active: formData.rating >= star }"
                class="star-btn"
              >
                ⭐
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="comments">Comentarios</label>
            <textarea
              id="comments"
              v-model="formData.comments"
              placeholder="Comparte tus comentarios sobre tu experiencia..."
              rows="5"
            ></textarea>
          </div>

          <div v-if="success" class="success-message">
            ¡Gracias por tu comentario!
          </div>

          <button
            type="submit"
            :disabled="surveyStore.isLoading"
            class="submit-btn"
          >
            {{ surveyStore.isLoading ? 'Enviando...' : 'Enviar Encuesta' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useSurvey } from '../composables/useSurvey';
import { useUserStore } from '../stores/userStore';
import { useToast } from '../composables/useToast';

const userStore = useUserStore();
const surveyStore = reactive(useSurvey());
const toast = useToast();

const formData = ref({
  rating: 0,
  comments: ''
});
const success = ref(false);

const submitSurvey = async () => {
  if (!userStore.isAuthenticated) {
    toast.error('Debes iniciar sesión para enviar una encuesta');
    return;
  }

  if (formData.value.rating === 0) {
    toast.error('Por favor selecciona una calificación');
    return;
  }

  success.value = false;

  const result = await surveyStore.submitSurvey(
    formData.value.rating,
    formData.value.comments
  );

  if (result) {
    success.value = true;
    toast.success('¡Gracias por tu comentario!');
    formData.value = { rating: 0, comments: '' };
    setTimeout(() => {
      success.value = false;
    }, 3000);
  } else if (surveyStore.error) {
    toast.error(surveyStore.error);
    surveyStore.error = null;
  }
};
</script>

<style scoped src="@/styles/pages/survey.css"></style>
