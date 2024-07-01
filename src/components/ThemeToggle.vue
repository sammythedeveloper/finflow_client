<script setup lang="ts">
import { useThemeStore } from '../stores/theme';

const theme = useThemeStore();
</script>

<template>
  <button
    class="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105"
    style="background: var(--bg-surface); border: 1px solid var(--border-subtle); color: var(--text-secondary);"
    :title="theme.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="theme.toggle()"
  >
    <Transition name="fade-up" mode="out-in">
      <svg v-if="theme.theme === 'dark'" key="sun" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" />
        <path stroke-linecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg v-else key="moon" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </Transition>
  </button>
</template>
