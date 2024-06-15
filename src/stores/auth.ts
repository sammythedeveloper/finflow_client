import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { authService } from '../services/authService';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const userEmail = ref<string | null>(localStorage.getItem('userEmail'));
  const username = ref<string | null>(localStorage.getItem('username'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  const setAuth = (newToken: string, email: string, name: string) => {
    token.value = newToken;
    userEmail.value = email;
    username.value = name;
    localStorage.setItem('token', newToken);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('username', name);
  };

  const clearAuth = () => {
    token.value = null;
    userEmail.value = null;
    username.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await authService.login(email, password);
      setAuth(data.token, email, email.split('@')[0]);
      return true;
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      error.value = message ?? 'Invalid email or password.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    loading.value = true;
    error.value = null;
    try {
      await authService.register(name, email, password);
      const { data } = await authService.login(email, password);
      setAuth(data.token, email, name);
      return true;
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      error.value = message ?? 'Registration failed. Please try again.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const logout = () => {
    clearAuth();
  };

  return {
    token,
    userEmail,
    username,
    loading,
    error,
    isAuthenticated,
    setAuth,
    clearAuth,
    login,
    register,
    logout,
    clearError,
  };
});
