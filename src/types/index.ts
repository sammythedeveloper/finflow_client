export interface Category {
  id: number;
  name: string;
  type: 'Income' | 'Expense';
  userId: number;
}

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
  userId: number;
  categoryId: number;
  categoryName: string;
}

export interface TransactionCreate {
  amount: number;
  description: string;
  date: string;
  categoryId: number;
}

export interface CategoryCreate {
  name: string;
  type: 'Income' | 'Expense';
}

export interface CategorySummary {
  categoryName: string;
  type: string;
  totalAmount: number;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  categoryBreakdown: CategorySummary[];
}

export interface PaginatedTransactions {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  data: Transaction[];
}

export interface TransactionQuery {
  pageNumber?: number;
  pageSize?: number;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
  username: string;
}
