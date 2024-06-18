<script setup lang="ts">
import { computed } from 'vue';
import { formatCurrency } from '../utils/format';

const props = defineProps<{
  label: string;
  value: number;
  badge: string;
  variant?: 'balance' | 'income' | 'expense' | 'spending';
  signed?: boolean;
}>();

const variantStyles: Record<string, { color: string; wave: string; icon: string }> = {
  balance: {
    color: 'var(--accent-bright)',
    wave: '#a78bfa',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  },
  income: {
    color: 'var(--income)',
    wave: '#4ade80',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  },
  expense: {
    color: 'var(--chart-blue)',
    wave: '#38bdf8',
    icon: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6',
  },
  spending: {
    color: 'var(--gold)',
    wave: '#e8c468',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
};

const style = computed(() => variantStyles[props.variant ?? 'balance']);

const wavePath = computed(() => {
  const v = props.value;
  const amp = 12 + (Math.abs(v) % 100) / 10;
  return `M0,40 Q50,${40 - amp} 100,40 T200,${40 + amp * 0.5} T300,40 T400,${40 - amp * 0.7} T500,40 L500,80 L0,80 Z`;
});
</script>

<template>
  <div class="glass-card rounded-3xl p-5 relative overflow-hidden group flex flex-col justify-between min-h-[148px]">
    <div class="relative z-10">
      <div class="flex items-start justify-between mb-3">
        <p class="text-xs font-semibold uppercase tracking-wider" style="color: var(--text-muted);">{{ label }}</p>
        <div
          class="w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          :style="{ background: 'var(--bg-surface)', color: style.color }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" :d="style.icon" />
          </svg>
        </div>
      </div>

      <h3 class="text-2xl font-bold tabular-nums tracking-tight mb-1" :style="{ color: style.color }">
        <template v-if="signed && value >= 0">+</template>
        <template v-if="signed && value < 0">-</template>
        {{ formatCurrency(value) }}
      </h3>

      <span
        class="inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
        style="background: var(--bg-surface); color: var(--text-muted); border: 1px solid var(--border-subtle);"
      >
        {{ badge }}
      </span>
    </div>

    <!-- Wave chart -->
    <svg class="absolute bottom-0 left-0 right-0 w-full h-16 opacity-40 group-hover:opacity-60 transition-opacity duration-500" viewBox="0 0 500 80" preserveAspectRatio="none">
      <defs>
        <linearGradient :id="`wave-${variant}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="style.wave" stop-opacity="0.5" />
          <stop offset="100%" :stop-color="style.wave" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path :d="wavePath" :fill="`url(#wave-${variant})`" />
    </svg>
  </div>
</template>
