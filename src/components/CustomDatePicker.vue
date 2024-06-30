<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  compact?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const open = ref(false);
const root = ref<HTMLElement | null>(null);
const viewDate = ref(new Date());

const displayLabel = computed(() => {
  if (!props.modelValue) return props.placeholder ?? 'Select date';
  const d = new Date(props.modelValue + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
});

const monthLabel = computed(() =>
  viewDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
);

const daysInMonth = computed(() => {
  const y = viewDate.value.getFullYear();
  const m = viewDate.value.getMonth();
  const first = new Date(y, m, 1).getDay();
  const total = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = Array(first).fill(null);
  for (let i = 1; i <= total; i++) cells.push(i);
  return cells;
});

const isSelected = (day: number) => {
  if (!props.modelValue) return false;
  const d = new Date(props.modelValue + 'T00:00:00');
  return (
    d.getDate() === day &&
    d.getMonth() === viewDate.value.getMonth() &&
    d.getFullYear() === viewDate.value.getFullYear()
  );
};

const pickDay = (day: number) => {
  const y = viewDate.value.getFullYear();
  const m = String(viewDate.value.getMonth() + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  emit('update:modelValue', `${y}-${m}-${d}`);
  open.value = false;
};

const prevMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1);
};

const clear = () => {
  emit('update:modelValue', '');
  open.value = false;
};

watch(
  () => props.modelValue,
  (v) => {
    if (v) viewDate.value = new Date(v + 'T00:00:00');
  },
  { immediate: true },
);

const onClickOutside = (e: MouseEvent) => {
  if (root.value && !root.value.contains(e.target as Node)) open.value = false;
};

onMounted(() => document.addEventListener('click', onClickOutside));
onUnmounted(() => document.removeEventListener('click', onClickOutside));
</script>

<template>
  <div ref="root" class="relative shrink-0" :class="compact ? 'w-[148px]' : 'w-full'">
    <button
      type="button"
      class="flex items-center justify-between gap-2 rounded-xl transition-all duration-200 w-full"
      :class="compact ? 'px-3 py-2.5' : 'px-4 py-3'"
      :style="{
        background: 'var(--bg-surface)',
        border: `1px solid ${open ? 'var(--accent)' : 'var(--border-subtle)'}`,
        boxShadow: open ? '0 0 0 3px var(--accent-glow)' : 'none',
        color: modelValue ? 'var(--text-primary)' : 'var(--text-muted)',
      }"
      @click.stop="open = !open"
    >
      <div class="flex items-center gap-2 min-w-0">
        <svg class="w-4 h-4 shrink-0" style="color: var(--accent-bright);" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-sm font-medium truncate">{{ displayLabel }}</span>
      </div>
    </button>

    <Transition name="fade-up">
      <div
        v-if="open"
        class="absolute z-50 mt-2 right-0 rounded-2xl p-4 w-[280px]"
        style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); box-shadow: var(--card-shadow);"
      >
        <div class="flex items-center justify-between mb-4">
          <button type="button" class="p-1.5 rounded-lg hover:opacity-70" style="color: var(--text-secondary);" @click="prevMonth">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span class="text-sm font-semibold" style="color: var(--text-primary);">{{ monthLabel }}</span>
          <button type="button" class="p-1.5 rounded-lg hover:opacity-70" style="color: var(--text-secondary);" @click="nextMonth">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 mb-1">
          <span v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="text-[10px] text-center font-semibold py-1" style="color: var(--text-muted);">{{ d }}</span>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <template v-for="(day, i) in daysInMonth" :key="i">
            <span v-if="day === null" />
            <button
              v-else
              type="button"
              class="h-8 rounded-lg text-xs font-medium transition-all duration-150"
              :style="{
                color: isSelected(day) ? 'white' : 'var(--text-secondary)',
                background: isSelected(day) ? 'linear-gradient(135deg, var(--accent), #3b82f6)' : 'transparent',
              }"
              @click="pickDay(day)"
            >
              {{ day }}
            </button>
          </template>
        </div>

        <button
          v-if="modelValue"
          type="button"
          class="w-full mt-3 py-2 text-xs font-semibold rounded-xl"
          style="color: var(--text-muted); background: var(--bg-surface);"
          @click="clear"
        >
          Clear
        </button>
      </div>
    </Transition>
  </div>
</template>
