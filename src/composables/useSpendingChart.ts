import { computed } from 'vue';
import type { Category, Transaction } from '../types';

export type TimeRange = 'Daily' | 'Weekly' | 'Monthly';

export function useSpendingChart(
  transactions: () => Transaction[],
  range: () => TimeRange,
  categories: () => Category[] = () => [],
) {
  const expenseCategoryIds = computed(() =>
    new Set(categories().filter((c) => c.type === 'Expense').map((c) => c.id)),
  );

  const expenseTransactions = computed(() => {
    const ids = expenseCategoryIds.value;
    if (ids.size === 0) return transactions();
    return transactions().filter((t) => ids.has(t.categoryId));
  });

  const chartData = computed(() => {
    const txs = expenseTransactions.value;
    const now = new Date();
    const buckets = new Map<string, number>();

    if (range() === 'Daily') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        buckets.set(key, 0);
      }
      txs.forEach((t) => {
        const key = new Date(t.date).toISOString().split('T')[0];
        if (buckets.has(key)) {
          buckets.set(key, (buckets.get(key) ?? 0) + t.amount);
        }
      });
      return Array.from(buckets.entries()).map(([key, value]) => ({
        label: new Date(key).toLocaleDateString('en-US', { weekday: 'short' }),
        value,
      }));
    }

    if (range() === 'Weekly') {
      for (let i = 3; i >= 0; i--) {
        buckets.set(`Week ${4 - i}`, 0);
      }
      const fourWeeksAgo = new Date(now);
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
      txs
        .filter((t) => new Date(t.date) >= fourWeeksAgo)
        .forEach((t) => {
          const daysDiff = Math.floor((now.getTime() - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24));
          const weekIndex = Math.min(3, Math.floor(daysDiff / 7));
          const label = `Week ${4 - weekIndex}`;
          buckets.set(label, (buckets.get(label) ?? 0) + t.amount);
        });
      return Array.from(buckets.entries()).map(([label, value]) => ({ label, value }));
    }

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleDateString('en-US', { month: 'short' });
      buckets.set(key, 0);
    }
    txs.forEach((t) => {
      const d = new Date(t.date);
      const key = d.toLocaleDateString('en-US', { month: 'short' });
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + t.amount);
      }
    });
    return Array.from(buckets.entries()).map(([label, value]) => ({ label, value }));
  });

  const maxValue = computed(() => Math.max(...chartData.value.map((d) => d.value), 1));

  const pathData = computed(() => {
    const points = chartData.value;
    if (points.length === 0) return { line: '', area: '' };

    const width = 600;
    const height = 200;
    const padding = 20;
    const step = (width - padding * 2) / Math.max(points.length - 1, 1);

    const coords = points.map((p, i) => {
      const x = padding + i * step;
      const y = height - padding - (p.value / maxValue.value) * (height - padding * 2);
      return { x, y };
    });

    const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
    const area = `${line} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

    return { line, area };
  });

  return { chartData, maxValue, pathData };
}

export function getSpendingTotals(transactions: Transaction[], categories: Category[] = []) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let daily = 0;
  let weekly = 0;
  let monthly = 0;

  const expenseIds = new Set(categories.filter((c) => c.type === 'Expense').map((c) => c.id));
  const expenseTxs = expenseIds.size > 0
    ? transactions.filter((t) => expenseIds.has(t.categoryId))
    : transactions;

  expenseTxs.forEach((t) => {
    const date = new Date(t.date);
    const amount = t.amount;
    if (date >= todayStart) daily += amount;
    if (date >= weekStart) weekly += amount;
    if (date >= monthStart) monthly += amount;
  });

  return { daily, weekly, monthly };
}
