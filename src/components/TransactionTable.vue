<script setup lang="ts">
import type { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

defineProps<{
  transactions: Transaction[];
  loading?: boolean;
}>();
</script>

<template>
  <div class="glass-card rounded-3xl overflow-hidden p-6">
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-base font-bold" style="color: var(--text-primary);">Recent Transactions</h2>
      <router-link
        to="/transactions"
        class="text-xs font-semibold transition-colors duration-300 hover:opacity-80"
        style="color: var(--accent-bright);"
      >
        View all →
      </router-link>
    </div>

    <div v-if="loading" class="py-14 text-center text-sm" style="color: var(--text-muted);">
      <div class="w-6 h-6 border-2 rounded-full animate-spin mx-auto mb-3" style="border-color: var(--border-subtle); border-top-color: var(--accent);" />
      Loading transactions...
    </div>

    <div v-else-if="transactions.length === 0" class="py-14 text-center text-sm" style="color: var(--text-muted);">
      No transactions yet. Add your first one!
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse text-sm">
        <thead>
          <tr class="text-[10px] uppercase tracking-wider" style="color: var(--text-muted);">
            <th class="pb-3 font-semibold">Description</th>
            <th class="pb-3 font-semibold hidden sm:table-cell">Category</th>
            <th class="pb-3 font-semibold hidden md:table-cell">Date</th>
            <th class="pb-3 font-semibold text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tx in transactions"
            :key="tx.id"
            class="transition-colors duration-200"
            style="border-top: 1px solid var(--border-subtle);"
          >
            <td class="py-3.5 font-medium" style="color: var(--text-primary);">{{ tx.description || '—' }}</td>
            <td class="py-3.5 hidden sm:table-cell">
              <span
                class="px-2.5 py-1 rounded-lg text-xs font-medium"
                style="background: var(--bg-surface); color: var(--text-secondary); border: 1px solid var(--border-subtle);"
              >
                {{ tx.categoryName }}
              </span>
            </td>
            <td class="py-3.5 text-xs hidden md:table-cell" style="color: var(--text-muted);">{{ formatDate(tx.date) }}</td>
            <td class="py-3.5 text-right font-bold tabular-nums" style="color: var(--text-primary);">
              {{ formatCurrency(tx.amount) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
