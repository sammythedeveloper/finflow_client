import api from './api';
import type {
  PaginatedTransactions,
  Transaction,
  TransactionCreate,
  TransactionQuery,
  TransactionSummary,
} from '../types';

export const transactionService = {
  getAll(params: TransactionQuery = {}) {
    return api.get<PaginatedTransactions>('/transactions', { params });
  },

  getSummary() {
    return api.get<TransactionSummary>('/transactions/summary');
  },

  create(data: TransactionCreate) {
    return api.post<Transaction>('/transactions', data);
  },
};
