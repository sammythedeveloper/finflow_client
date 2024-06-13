<template>
    <footer
      class="mt-auto border-t"
      style="border-color: var(--border-subtle);"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5"
      >
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <!-- Copyright -->
          <p
            class="text-xs text-center"
            style="color: var(--text-muted);"
          >
            © {{ currentYear }} Finaura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup lang="ts">
  const currentYear = new Date().getFullYear();
  </script>