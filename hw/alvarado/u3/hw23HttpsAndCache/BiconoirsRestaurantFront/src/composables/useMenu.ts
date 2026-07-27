import { ref, computed } from 'vue';
import apiClient from '../utils/api';
import { Dish } from '@/types/index';

const mapDishFromApi = (apiDish: any, categoryMap: Record<string, string>): Dish => ({
  dish_id: apiDish.itemId ?? apiDish.dish_id,
  name: apiDish.name,
  description: apiDish.description,
  price: Number(apiDish.price),
  image_url: apiDish.imageUrl ?? apiDish.image_url,
  category: categoryMap[apiDish.categoryId] || apiDish.categoryId || apiDish.category || '',
  is_available: apiDish.isAvailable ?? apiDish.is_available ?? true,
  created_at: apiDish.createdAt ?? apiDish.created_at ?? new Date(),
  updated_at: apiDish.updatedAt ?? apiDish.updated_at ?? new Date(),
});

export const useMenu = () => {
  const dishes = ref<Dish[]>([]);
  const categories = ref<string[]>([]);
  const categoryMap = ref<Record<string, string>>({});
  const selectedCategory = ref<string>('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const filteredDishes = computed(() => {
    if (!selectedCategory.value) return dishes.value;
    return dishes.value.filter((d) => d.category === selectedCategory.value);
  });

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/menu/categories');
      const raw: any[] = response.data.data ?? [];
      const map: Record<string, string> = {};
      for (const c of raw) {
        if (c.categoryId && c.name && c.active !== false) {
          map[c.categoryId] = c.name;
        }
      }
      categoryMap.value = map;
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const fetchDishes = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await apiClient.get('/menu/dishes', {
        params: { available: 'true' }
      });
      const rawDishes: any[] = response.data.data ?? [];
      dishes.value = rawDishes.map((d: any) => mapDishFromApi(d, categoryMap.value));
      categories.value = [...new Set(dishes.value.map((d) => d.category))];
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar los platos';
    } finally {
      isLoading.value = false;
    }
  };

  const getDishById = async (id: string) => {
    try {
      const response = await apiClient.get(`/menu/dishes/${id}`);
      return mapDishFromApi(response.data.data, categoryMap.value);
    } catch (err) {
      error.value = 'Error al obtener el plato';
      return null;
    }
  };

  return {
    dishes,
    categories,
    selectedCategory,
    filteredDishes,
    isLoading,
    error,
    fetchDishes,
    fetchCategories,
    getDishById
  };
};
