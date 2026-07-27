import { ref } from 'vue';
import apiClient from '../utils/api';

export const useSurvey = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const submitSurvey = async (rating: number, comments: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const surveysRes = await apiClient.get('/surveys');
      const surveyList: any[] = surveysRes.data.data ?? [];
      const activeSurvey = surveyList.find(
        (s: any) => (s.status ?? 'active') === 'active'
      );
      const surveyId = activeSurvey?.surveyId ?? activeSurvey?.survey_id;

      if (surveyId) {
        await apiClient.post(`/surveys/${surveyId}/submit`, {
          responses: [
            { question_id: 'rating', answer: String(rating) },
            { question_id: 'comments', answer: comments },
          ],
        });
      } else {
        await apiClient.post('/surveys', { rating, comments });
      }
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al enviar la encuesta';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    submitSurvey,
  };
};
