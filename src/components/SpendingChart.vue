<script setup lang="ts">
import { computed } from 'vue';
import type { Category, Transaction } from '../types';
import { useSpendingChart, type TimeRange } from '../composables/useSpendingChart';
import { formatCurrency } from '../utils/format';

const props = defineProps<{
  transactions: Transaction[];
  categories?: Category[];
}>();

const timeRange = defineModel<TimeRange>('timeRange', { default: 'Monthly' });

const { chartData, maxValue, pathData } = useSpendingChart(
  () => props.transactions,
  () => timeRange.value,
  () => props.categories ?? [],
);

const yLabels = computed(() => {
  const max = maxValue.value;
  return [max, max * 0.75, max * 0.5, max * 0.25, 0].map((v) => formatCurrency(v));
});

const ranges: TimeRange[] = ['Daily', 'Weekly', 'Monthly'];
</script>

<template>
  <div class="glass-card rounded-3xl p-6 flex flex-col justify-between h-full">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="text-base font-bold" style="color: var(--text-primary);">Spending Trends</h2>
        <p class="text-xs mt-0.5" style="color: var(--text-muted);">Expense flow over time</p>
      </div>

      <div
        class="relative inline-flex rounded-xl shrink-0"
        style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 4px;"
      >
        <div
          class="absolute rounded-lg transition-all duration-400 ease-out"
          :style="{
            width: 'calc(33.333% - 2.67px)',
            height: 'calc(100% - 8px)',
            top: '4px',
            left: `calc(${ranges.indexOf(timeRange) * 33.333}% + 4px)`,
            background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
            boxShadow: '0 2px 10px rgba(56,189,248,0.3)',
          }"
        />
        <button
          v-for="range in ranges"
          :key="range"
          type="button"
          class="relative z-10 px-4 py-2 text-[11px] font-semibold rounded-lg transition-colors duration-300 min-w-[62px]"
          :style="{ color: timeRange === range ? 'white' : 'var(--text-muted)' }"
          @click="timeRange = range"
        >
          {{ range }}
        </button>
      </div>
    </div>

    <div v-if="chartData.every((d) => d.value === 0)" class="h-56 flex items-center justify-center text-sm" style="color: var(--text-muted);">
      No expense data for this period
    </div>

    <template v-else>
      <div class="relative h-56 w-full">
        <div class="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px]" style="color: var(--text-muted);">
          <div v-for="label in yLabels" :key="label" class="border-b w-full pb-1" style="border-color: var(--border-subtle);">
            <span>{{ label }}</span>
          </div>
        </div>

        <svg class="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 200">
          <defs>
            <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#a78bfa" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#a78bfa" />
              <stop offset="50%" stop-color="#e8c468" />
              <stop offset="100%" stop-color="#a78bfa" />
            </linearGradient>
          </defs>
          <path :d="pathData.area" fill="url(#spendGrad)" class="transition-all duration-700 ease-out" />
          <path :d="pathData.line" fill="none" stroke="url(#lineGrad)" stroke-width="2.5" stroke-linecap="round" class="transition-all duration-700 ease-out" />
        </svg>
      </div>

      <div class="flex justify-between text-[10px] mt-4 pt-3" style="color: var(--text-muted); border-top: 1px solid var(--border-subtle);">
        <span v-for="point in chartData" :key="point.label">{{ point.label }}</span>
      </div>
    </template>
  </div>
</template>
