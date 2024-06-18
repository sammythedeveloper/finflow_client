<script setup lang="ts">
import { computed } from "vue";
import type { TransactionSummary } from "../types";
import { formatCurrency } from "../utils/format";

const props = defineProps<{
  summary: TransactionSummary | null;
}>();

const healthScore = computed(() => {
  if (!props.summary) return 0;
  const { totalIncome, totalExpenses, netBalance } = props.summary;
  if (totalIncome === 0 && totalExpenses === 0) return 50;
  if (totalIncome === 0) return 20;
  const ratio = netBalance / totalIncome;
  return Math.min(100, Math.max(0, Math.round(50 + ratio * 50)));
});

const healthLabel = computed(() => {
  const s = healthScore.value;
  if (s >= 80) return "Excellent";
  if (s >= 60) return "Good";
  if (s >= 40) return "Fair";
  return "Needs attention";
});

const rows = computed(() => [
  {
    label: "Total Income",
    value: props.summary?.totalIncome ?? 0,
    color: "var(--income)",
  },
  {
    label: "Total Expenses",
    value: props.summary?.totalExpenses ?? 0,
    color: "var(--chart-blue)",
  },
  {
    label: "Net Balance",
    value: props.summary?.netBalance ?? 0,
    color: "var(--accent-bright)",
  },
]);
</script>

<template>
  <div class="glass-card rounded-3xl p-6 flex flex-col h-full">
    <div class="mb-5">
      <h2 class="text-base font-bold" style="color: var(--text-primary)">
        Financial Summary
      </h2>
      <p class="text-xs mt-0.5" style="color: var(--text-muted)">
        Your overall financial health
      </p>
    </div>

    <!-- Health gauge -->
    <div class="flex flex-col items-center mb-6">
      <div class="relative w-36 h-20 overflow-hidden">
        <svg viewBox="0 0 120 70" class="w-full h-full">
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke="var(--bg-surface)"
            stroke-width="10"
            stroke-linecap="round"
          />
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke="url(#healthGrad)"
            stroke-width="10"
            stroke-linecap="round"
            :stroke-dasharray="`${healthScore * 1.57} 157`"
            class="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="var(--accent)" />
              <stop offset="100%" stop-color="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
        <div class="absolute inset-x-0 bottom-0 text-center">
          <p
            class="text-2xl font-bold tabular-nums"
            style="color: var(--text-primary)"
          >
            {{ healthScore }}
          </p>
          <p
            class="text-[10px] font-semibold uppercase tracking-wider"
            style="color: var(--text-muted)"
          >
            out of 100
          </p>
        </div>
      </div>
      <span
        class="mt-2 text-xs font-semibold px-3 py-1 rounded-full"
        style="background: var(--accent-glow); color: var(--accent-bright)"
      >
        {{ healthLabel }}
      </span>
    </div>

    <!-- Summary rows -->
    <!-- Summary rows -->
    <div class="space-y-3 flex-1">
      <div
        v-for="row in rows"
        :key="row.label"
        class="flex items-center justify-between px-4 py-3 rounded-2xl transition-colors"
        style="
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
        "
      >
        <span class="text-xs font-medium" style="color: var(--text-secondary)">
          {{ row.label }}
        </span>

        <span
          class="text-sm font-bold tabular-nums"
          :style="{ color: row.color }"
        >
          {{ formatCurrency(row.value) }}
        </span>
      </div>
    </div>

    <!-- Manage Categories -->
    <router-link
      to="/categories"
      class="mt-5 w-full py-3 rounded-2xl text-xs font-semibold text-center block transition-all duration-300 hover:scale-[1.02]"
      style="
        color: var(--text-secondary);
        background: var(--bg-surface);
        border: 1px solid var(--border-subtle);
      "
    >
      Manage Categories →
    </router-link>
  </div>
</template>
