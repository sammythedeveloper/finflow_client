import api from './api';
import type { Category, CategoryCreate } from '../types';

export const categoryService = {
  getAll() {
    return api.get<Category[]>('/categories');
  },

  create(data: CategoryCreate) {
    return api.post<Category>('/categories', data);
  },
};
