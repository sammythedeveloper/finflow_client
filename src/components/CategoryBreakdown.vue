<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CategorySummary } from '../types';
import { formatCurrency } from '../utils/format';

const props = defineProps<{
  categories: CategorySummary[];
}>();

type ViewMode = 'expense' | 'income';

const mode = ref<ViewMode>('expense');

const expenseColors = [
  '#475569',
  '#64748b',
  '#94a3b8',
  '#60a5fa',
  '#3b82f6',
];

const incomeColors = [
  '#7dd3fc',
  '#60a5fa',
  '#38bdf8',
  '#93c5fd',
  '#bae6fd',
];

const filteredCategories = computed(() =>
  [
    ...props.categories.filter(
      (c) =>
        c.type ===
        (mode.value === 'expense' ? 'Expense' : 'Income'),
    ),
  ]
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5),
);

const maxAmount = computed(() =>
  Math.max(
    ...filteredCategories.value.map(
      (c) => c.totalAmount,
    ),
    1,
  ),
);

const activeColors = computed(() =>
  mode.value === 'expense'
    ? expenseColors
    : incomeColors,
);

const emptyMessage = computed(() =>
  mode.value === 'expense'
    ? 'No expense categories yet'
    : 'No income categories yet',
);
</script>

<template>
  <div class="glass-card rounded-3xl p-6 flex flex-col h-full">
    <!-- Header -->
    <div
      class="flex items-start justify-between gap-3 mb-5"
    >
      <div>
        <h2
          class="text-base font-bold"
          style="color: var(--text-primary);"
        >
          Categories
        </h2>

        <Transition
          name="fade-up"
          mode="out-in"
        >
          <p
            :key="mode"
            class="text-xs mt-0.5"
            style="color: var(--text-muted);"
          >
            {{
              mode === 'expense'
                ? 'Top spending categories'
                : 'Top income categories'
            }}
          </p>
        </Transition>
      </div>

      <!-- Expense / Income Toggle -->
      <div
        class="relative flex rounded-xl shrink-0"
        style="
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          padding: 3px;
        "
      >
        <div
          class="absolute rounded-[9px] transition-all duration-400 ease-out"
          :style="{
            width: 'calc(50% - 3px)',
            height: 'calc(100% - 6px)',
            top: '3px',
            left:
              mode === 'expense'
                ? '3px'
                : 'calc(50%)',
            background:
              'linear-gradient(135deg, #3b82f6, #60a5fa)',
            boxShadow:
              '0 2px 10px var(--accent-glow)',
          }"
        />

        <button
          type="button"
          class="relative z-10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-[9px] transition-colors duration-300"
          :style="{
            color:
              mode === 'expense'
                ? 'white'
                : 'var(--text-muted)',
          }"
          @click="mode = 'expense'"
        >
          Spend
        </button>

        <button
          type="button"
          class="relative z-10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-[9px] transition-colors duration-300"
          :style="{
            color:
              mode === 'income'
                ? 'white'
                : 'var(--text-muted)',
          }"
          @click="mode = 'income'"
        >
          Income
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredCategories.length === 0"
      class="flex-1 flex items-center justify-center py-10"
    >
      <Transition
        name="fade-up"
        mode="out-in"
      >
        <p
          :key="mode"
          class="text-sm"
          style="color: var(--text-muted);"
        >
          {{ emptyMessage }}
        </p>
      </Transition>
    </div>

    <!-- Category Bars -->
    <TransitionGroup
      v-else
      name="bar-list"
      tag="div"
      class="space-y-4 flex-1 relative"
    >
      <div
        v-for="(cat, i) in filteredCategories"
        :key="`${mode}-${cat.categoryName}`"
      >
        <div
          class="flex justify-between text-xs font-medium mb-2"
        >
          <span style="color: var(--text-primary);">
            {{ cat.categoryName }}
          </span>

          <span
            class="font-bold tabular-nums"
            :style="{
              color:
                activeColors[
                  i % activeColors.length
                ],
            }"
          >
            {{ formatCurrency(cat.totalAmount) }}
          </span>
        </div>

        <div
          class="w-full h-1.5 rounded-full overflow-hidden"
          style="background: var(--bg-surface);"
        >
          <div
            class="h-full rounded-full transition-all duration-700 ease-out"
            :style="{
              width: `${(cat.totalAmount / maxAmount) * 100}%`,
              background: `linear-gradient(90deg, ${
                activeColors[i % activeColors.length]
              }, ${
                activeColors[
                  (i + 1) % activeColors.length
                ]
              })`,
              opacity: 0.85,
            }"
          />
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>