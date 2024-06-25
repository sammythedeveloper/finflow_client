import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { transactionService } from '../services/transactionService';
import type { Transaction, TransactionCreate, TransactionQuery, TransactionSummary } from '../types';

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([]);
  const summary = ref<TransactionSummary | null>(null);
  const totalCount = ref(0);
  const totalPages = ref(0);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const expenseCategories = computed(() =>
    summary.value?.categoryBreakdown.filter((c) => c.type === 'Expense') ?? [],
  );

  const topExpenseCategories = computed(() =>
    [...expenseCategories.value]
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5),
  );

  const fetchTransactions = async (query: TransactionQuery = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await transactionService.getAll({
        pageNumber: query.pageNumber ?? pageNumber.value,
        pageSize: query.pageSize ?? pageSize.value,
        categoryId: query.categoryId,
        startDate: query.startDate,
        endDate: query.endDate,
      });
      transactions.value = data.data;
      totalCount.value = data.totalCount;
      totalPages.value = data.totalPages;
      pageNumber.value = data.pageNumber;
      pageSize.value = data.pageSize;
    } catch {
      error.value = 'Failed to load transactions.';
    } finally {
      loading.value = false;
    }
  };

  const fetchSummary = async () => {
    try {
      const { data } = await transactionService.getSummary();
      summary.value = data;
    } catch {
      error.value = 'Failed to load summary.';
    }
  };

  const createTransaction = async (payload: TransactionCreate) => {
    loading.value = true;
    error.value = null;
    try {
      await transactionService.create(payload);
      await Promise.all([fetchSummary(), fetchTransactions({ pageNumber: 1 })]);
      return true;
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      error.value = message ?? 'Failed to create transaction.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const fetchAllForChart = async () => {
    try {
      const { data } = await transactionService.getAll({ pageNumber: 1, pageSize: 500 });
      return data.data;
    } catch {
      return [];
    }
  };

  return {
    transactions,
    summary,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
    loading,
    error,
    expenseCategories,
    topExpenseCategories,
    fetchTransactions,
    fetchSummary,
    createTransaction,
    fetchAllForChart,
  };
});
