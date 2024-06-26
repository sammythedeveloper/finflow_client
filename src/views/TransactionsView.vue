<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import CustomDatePicker from '../components/CustomDatePicker.vue';
import CustomSelect from '../components/CustomSelect.vue';
import TransactionModal from '../components/TransactionModal.vue';
import { useCategoryStore } from '../stores/categories';
import { useTransactionStore } from '../stores/transactions';
import type { TransactionCreate } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

const txStore = useTransactionStore();
const categoryStore = useCategoryStore();
const showModal = ref(false);
const searchQuery = ref('');
const filterCategoryId = ref<number | undefined>();
const filterStartDate = ref('');
const filterEndDate = ref('');

const categoryOptions = computed(() => [
  { label: 'All Categories', value: undefined as number | undefined },
  ...categoryStore.categories.map((c) => ({ label: c.name, value: c.id })),
]);

const loadTransactions = () => {
  txStore.fetchTransactions({
    pageNumber: txStore.pageNumber,
    pageSize: txStore.pageSize,
    categoryId: filterCategoryId.value,
    startDate: filterStartDate.value || undefined,
    endDate: filterEndDate.value || undefined,
  });
};

onMounted(async () => {
  await categoryStore.fetchCategories();
  loadTransactions();
});

watch([filterCategoryId, filterStartDate, filterEndDate], () => {
  txStore.pageNumber = 1;
  loadTransactions();
});

const goToPage = (page: number) => {
  txStore.pageNumber = page;
  loadTransactions();
};

const handleAddTransaction = async (payload: TransactionCreate) => {
  const success = await txStore.createTransaction(payload);
  if (success) {
    showModal.value = false;
    loadTransactions();
  }
};

const filteredTransactions = () => {
  if (!searchQuery.value) return txStore.transactions;
  const q = searchQuery.value.toLowerCase();
  return txStore.transactions.filter(
    (t) => t.description.toLowerCase().includes(q) || t.categoryName.toLowerCase().includes(q),
  );
};
</script>

<template>
  <AppLayout title="Transactions" subtitle="View and filter all your transactions" @add-transaction="showModal = true">
    <div class="glass-card rounded-3xl p-5 md:p-6 space-y-5">
      <!-- Filters: search dominant, compact filters on the right -->
      <div class="flex flex-col lg:flex-row lg:items-center gap-3">
        <div class="relative flex-1 min-w-0">
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
            style="color: var(--text-muted);"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by description or category..."
            class="input-field pl-12 pr-4 py-3.5 text-base w-full"
            style="font-size: 0.9375rem;"
          />
        </div>

        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <CustomSelect
            v-model="filterCategoryId"
            :options="categoryOptions"
            placeholder="Category"
            compact
          />
          <CustomDatePicker v-model="filterStartDate" placeholder="From" compact />
          <CustomDatePicker v-model="filterEndDate" placeholder="To" compact />
        </div>
      </div>

      <div v-if="txStore.loading" class="py-16 text-center text-sm" style="color: var(--text-muted);">
        <div class="w-6 h-6 border-2 rounded-full animate-spin mx-auto mb-3" style="border-color: var(--border-subtle); border-top-color: var(--accent);" />
        Loading...
      </div>

      <div v-else-if="filteredTransactions().length === 0" class="py-16 text-center text-sm" style="color: var(--text-muted);">
        No transactions found.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="text-[10px] uppercase tracking-wider" style="color: var(--text-muted);">
              <th class="pb-3 font-semibold">Description</th>
              <th class="pb-3 font-semibold">Category</th>
              <th class="pb-3 font-semibold">Date</th>
              <th class="pb-3 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tx in filteredTransactions()"
              :key="tx.id"
              class="transition-colors duration-200 hover:opacity-80"
              style="border-top: 1px solid var(--border-subtle);"
            >
              <td class="py-3.5 font-medium" style="color: var(--text-primary);">{{ tx.description || '—' }}</td>
              <td class="py-3.5">
                <span class="px-2.5 py-1 rounded-lg text-xs font-medium" style="background: var(--bg-surface); color: var(--text-secondary); border: 1px solid var(--border-subtle);">
                  {{ tx.categoryName }}
                </span>
              </td>
              <td class="py-3.5 text-xs" style="color: var(--text-muted);">{{ formatDate(tx.date) }}</td>
              <td class="py-3.5 text-right font-bold tabular-nums" style="color: var(--text-primary);">{{ formatCurrency(tx.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="txStore.totalPages > 1" class="flex items-center justify-between pt-4" style="border-top: 1px solid var(--border-subtle);">
        <p class="text-xs" style="color: var(--text-muted);">
          Page {{ txStore.pageNumber }} of {{ txStore.totalPages }} · {{ txStore.totalCount }} total
        </p>
        <div class="flex gap-2">
          <button
            :disabled="txStore.pageNumber <= 1"
            class="px-4 py-2 text-xs font-semibold rounded-xl disabled:opacity-30"
            style="color: var(--text-secondary); background: var(--bg-surface); border: 1px solid var(--border-subtle);"
            @click="goToPage(txStore.pageNumber - 1)"
          >
            Previous
          </button>
          <button
            :disabled="txStore.pageNumber >= txStore.totalPages"
            class="px-4 py-2 text-xs font-semibold rounded-xl disabled:opacity-30"
            style="color: var(--text-secondary); background: var(--bg-surface); border: 1px solid var(--border-subtle);"
            @click="goToPage(txStore.pageNumber + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <TransactionModal :open="showModal" @close="showModal = false" @submit="handleAddTransaction" />
  </AppLayout>
</template>
