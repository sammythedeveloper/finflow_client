<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import FinancialSummary from '../components/FinancialSummary.vue';
import MetricCard from '../components/MetricCard.vue';
import SpendingChart from '../components/SpendingChart.vue';
import TransactionModal from '../components/TransactionModal.vue';
import TransactionTable from '../components/TransactionTable.vue';
import { getSpendingTotals } from '../composables/useSpendingChart';
import type { TimeRange } from '../composables/useSpendingChart';
import { useAuthStore } from '../stores/auth';
import { useCategoryStore } from '../stores/categories';
import { useTransactionStore } from '../stores/transactions';
import type { TransactionCreate } from '../types';

const txStore = useTransactionStore();
const categoryStore = useCategoryStore();
const auth = useAuthStore();
const showModal = ref(false);
const timeRange = ref<TimeRange>('Monthly');
const chartTransactions = ref<typeof txStore.transactions>([]);

const periodTotals = computed(() =>
  getSpendingTotals(chartTransactions.value, categoryStore.categories),
);

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
});

onMounted(async () => {
  await Promise.all([
    txStore.fetchSummary(),
    txStore.fetchTransactions({ pageNumber: 1, pageSize: 5 }),
    categoryStore.fetchCategories(),
  ]);
  chartTransactions.value = await txStore.fetchAllForChart();
});

const handleAddTransaction = async (payload: TransactionCreate) => {
  const success = await txStore.createTransaction(payload);
  if (success) {
    showModal.value = false;
    chartTransactions.value = await txStore.fetchAllForChart();
  }
};
</script>

<template>
  <AppLayout title="Dashboard" subtitle="Your financial overview" @add-transaction="showModal = true">
    <!-- Welcome header (Finaura-style) -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight" style="color: var(--text-primary);">
          {{ greeting }}, {{ auth.username ?? 'there' }} 👋
        </h1>
        <p class="text-sm mt-1.5" style="color: var(--text-secondary);">
          Your financial snapshot is ready. Here's how you're doing.
        </p>
      </div>
      <button class="btn-primary px-5 py-2.5 rounded-2xl text-sm self-start md:self-auto shrink-0" @click="showModal = true">
        + Add Transaction
      </button>
    </div>

    <!-- Metric cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <MetricCard
        label="Net Balance"
        :value="txStore.summary?.netBalance ?? 0"
        badge="Total"
        variant="balance"
        signed
      />
      <MetricCard
        label="Total Income"
        :value="txStore.summary?.totalIncome ?? 0"
        badge="All Time"
        variant="income"
      />
      <MetricCard
        label="Total Expenses"
        :value="txStore.summary?.totalExpenses ?? 0"
        badge="All Time"
        variant="expense"
      />
      <MetricCard
        label="Monthly Spending"
        :value="periodTotals.monthly"
        badge="This Month"
        variant="spending"
      />
    </div>

    <!-- Chart + right column -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div class="xl:col-span-2">
        <SpendingChart
          v-model:time-range="timeRange"
          :transactions="chartTransactions"
          :categories="categoryStore.categories"
        />
      </div>

      <div class="space-y-5">
        <FinancialSummary :summary="txStore.summary" />
      </div>
    </div>

    <TransactionTable :transactions="txStore.transactions" :loading="txStore.loading" />

    <TransactionModal :open="showModal" @close="showModal = false" @submit="handleAddTransaction" />
  </AppLayout>
</template>
