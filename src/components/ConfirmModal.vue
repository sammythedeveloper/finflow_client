<script setup lang="ts">
defineProps<{
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-up">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style="background: rgba(0, 0, 0, 0.55); backdrop-filter: blur(6px)"
        @click.self="emit('cancel')"
      >
        <div
          class="glass-card rounded-3xl p-7 max-w-sm w-full animate-slide-up"
        >
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            :style="{
              background: danger ? 'var(--expense-bg)' : 'var(--accent-glow)',
            }"
          >
            <svg
              class="w-6 h-6"
              :style="{
                color: danger ? 'var(--expense)' : 'var(--accent-bright)',
              }"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>

          <h3 class="text-lg font-bold mb-2" style="color: var(--text-primary)">
            {{ title }}
          </h3>
          <p
            class="text-sm mb-6 leading-relaxed"
            style="color: var(--text-secondary)"
          >
            {{ message }}
          </p>

          <div class="flex gap-3">
            <!-- Stay logged in -->
            <button
              type="button"
              class="modal-cancel flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              @click="emit('cancel')"
            >
              {{ cancelLabel ?? "Cancel" }}
            </button>

            <!-- Yes, sign out -->
            <button
              type="button"
              class="modal-confirm flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              @click="emit('confirm')"
            >
              {{ confirmLabel ?? "Confirm" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-cancel {
  color: var(--text-secondary);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
}

.modal-cancel:hover {
  color: #ffffff;
  background: #059669;
  border-color: #059669;
  box-shadow: 0 6px 16px rgba(5, 150, 105, 0.2);
  transform: translateY(-1px);
}

.modal-confirm {
  color: var(--text-secondary);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
}

.modal-confirm:hover {
  color: #ffffff;
  background: #800020;
  border-color: #800020;
  box-shadow: 0 6px 16px rgba(128, 0, 32, 0.22);
  transform: translateY(-1px);
}

.modal-cancel:active,
.modal-confirm:active {
  transform: translateY(0) scale(0.98);
}
</style>