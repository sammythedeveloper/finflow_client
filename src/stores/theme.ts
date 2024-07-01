import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export type Theme = 'dark' | 'light';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) ?? 'dark');

  const apply = (value: Theme) => {
    document.documentElement.setAttribute('data-theme', value);
    localStorage.setItem('theme', value);
  };

  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
  };

  watch(theme, apply, { immediate: true });

  return { theme, toggle };
});
