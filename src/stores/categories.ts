import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { categoryService } from '../services/categoryService';
import type { Category, CategoryCreate } from '../types';

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const incomeCategories = computed(() => categories.value.filter((c) => c.type === 'Income'));
  const expenseCategories = computed(() => categories.value.filter((c) => c.type === 'Expense'));

  const fetchCategories = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await categoryService.getAll();
      categories.value = data;
    } catch {
      error.value = 'Failed to load categories.';
    } finally {
      loading.value = false;
    }
  };

  const createCategory = async (payload: CategoryCreate) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await categoryService.create(payload);
      categories.value.push(data);
      return true;
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      error.value = message ?? 'Failed to create category.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    categories,
    loading,
    error,
    incomeCategories,
    expenseCategories,
    fetchCategories,
    createCategory,
  };
});
