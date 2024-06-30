<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

export interface SelectOption {
  label: string;
  value: string | number | undefined;
}

const props = defineProps<{
  modelValue: string | number | undefined;
  options: SelectOption[];
  placeholder?: string;
  compact?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | number | undefined];
}>();

const open = ref(false);
const root = ref<HTMLElement | null>(null);

const selectedLabel = computed(() => {
  const found = props.options.find((o) => o.value === props.modelValue);
  return found?.label ?? props.placeholder ?? 'Select';
});

const select = (value: string | number | undefined) => {
  emit('update:modelValue', value);
  open.value = false;
};

const onClickOutside = (e: MouseEvent) => {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false;
};

onMounted(() => document.addEventListener('click', onClickOutside));
onUnmounted(() => document.removeEventListener('click', onClickOutside));
</script>

<template>
  <div ref="root" class="relative" :class="compact ? 'w-auto shrink-0' : 'w-full'">
    <button
      type="button"
      class="flex items-center justify-between gap-2 rounded-xl transition-all duration-200 w-full"
      :class="compact ? 'px-3 py-2.5 min-w-[130px]' : 'px-4 py-3'"
      :style="{
        background: 'var(--bg-surface)',
        border: `1px solid ${open ? 'var(--accent)' : 'var(--border-subtle)'}`,
        boxShadow: open ? '0 0 0 3px var(--accent-glow)' : 'none',
        color: 'var(--text-primary)',
      }"
      @click.stop="open = !open"
    >
      <span class="text-sm font-medium truncate">{{ selectedLabel }}</span>
      <svg
        class="w-4 h-4 shrink-0 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        style="color: var(--text-muted);"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <Transition name="fade-up">
      <div
        v-if="open"
        class="absolute z-50 mt-2 rounded-2xl overflow-hidden shadow-2xl min-w-full"
        style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); box-shadow: var(--card-shadow);"
      >
        <div class="max-h-56 overflow-y-auto py-1">
          <button
            v-for="opt in options"
            :key="String(opt.value)"
            type="button"
            class="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 flex items-center justify-between gap-2"
            :style="{
              color: modelValue === opt.value ? 'var(--accent-bright)' : 'var(--text-secondary)',
              background: modelValue === opt.value ? 'var(--accent-glow)' : 'transparent',
            }"
            @click="select(opt.value)"
          >
            <span class="truncate">{{ opt.label }}</span>
            <svg
              v-if="modelValue === opt.value"
              class="w-4 h-4 shrink-0"
              style="color: var(--accent-bright);"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
