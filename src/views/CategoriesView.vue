<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppLayout from '../components/AppLayout.vue';
import CustomSelect from '../components/CustomSelect.vue';
import TransactionModal from '../components/TransactionModal.vue';
import { useCategoryStore } from '../stores/categories';
import { useTransactionStore } from '../stores/transactions';
import type { CategoryCreate, TransactionCreate } from '../types';

const categoryStore = useCategoryStore();
const txStore = useTransactionStore();

const showModal = ref(false);
const showCategoryForm = ref(false);
const filterType = ref<'all' | 'Expense' | 'Income'>('all');
const searchQuery = ref('');

const newCategory = ref<CategoryCreate>({
  name: '',
  type: 'Expense',
});

const typeOptions = [
  {
    label: 'Expense',
    value: 'Expense' as const,
  },
  {
    label: 'Income',
    value: 'Income' as const,
  },
];

const filterOptions = [
  {
    label: 'All Categories',
    value: 'all' as const,
  },
  {
    label: 'Expenses',
    value: 'Expense' as const,
  },
  {
    label: 'Income',
    value: 'Income' as const,
  },
];

const expenseCount = computed(() =>
  categoryStore.categories.filter(
    (category) => category.type === 'Expense',
  ).length,
);

const incomeCount = computed(() =>
  categoryStore.categories.filter(
    (category) => category.type === 'Income',
  ).length,
);

const totalCategories = computed(
  () => categoryStore.categories.length,
);

const displayedCategories = computed(() => {
  let categories = categoryStore.categories;

  if (filterType.value !== 'all') {
    categories = categories.filter(
      (category) => category.type === filterType.value,
    );
  }

  const query = searchQuery.value.trim().toLowerCase();

  if (query) {
    categories = categories.filter((category) =>
      category.name.toLowerCase().includes(query),
    );
  }

  return categories;
});

const handleCreateCategory = async () => {
  const name = newCategory.value.name.trim();

  if (!name) return;

  const success = await categoryStore.createCategory({
    name,
    type: newCategory.value.type,
  });

  if (success) {
    newCategory.value = {
      name: '',
      type: 'Expense',
    };

    showCategoryForm.value = false;
  }
};

const handleAddTransaction = async (
  payload: TransactionCreate,
) => {
  const success = await txStore.createTransaction(payload);

  if (success) {
    showModal.value = false;
  }
};

onMounted(() => {
  categoryStore.fetchCategories();
});
</script>

<template>
  <AppLayout
    title="Categories"
    subtitle="Organize your income and expenses"
    @add-transaction="showModal = true"
  >
    <!-- Page header -->
    <section
      class="glass-card rounded-3xl p-6 md:p-7"
    >
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-5"
      >
        <div>
          <h1
            class="text-2xl md:text-3xl font-bold tracking-tight"
            style="color: var(--text-primary);"
          >
            Categories
          </h1>

          <p
            class="text-sm mt-1.5"
            style="color: var(--text-secondary);"
          >
            Organize the way you track your money.
          </p>

          <!-- Simple summary -->
          <div
            class="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs"
            style="color: var(--text-muted);"
          >
            <span>
              <strong
                class="font-bold"
                style="color: var(--text-primary);"
              >
                {{ totalCategories }}
              </strong>
              total
            </span>

            <span>
              <strong
                class="font-bold"
                style="color: var(--accent-bright);"
              >
                {{ expenseCount }}
              </strong>
              expenses
            </span>

            <span>
              <strong
                class="font-bold"
                style="color: var(--income);"
              >
                {{ incomeCount }}
              </strong>
              income
            </span>
          </div>
        </div>

        <button
          class="btn-primary px-5 py-2.5 rounded-2xl text-sm shrink-0"
          @click="showCategoryForm = !showCategoryForm"
        >
          {{ showCategoryForm ? 'Cancel' : '+ New Category' }}
        </button>
      </div>
    </section>

    <!-- Create category -->
    <Transition name="fade-up">
      <section
        v-if="showCategoryForm"
        class="glass-card rounded-3xl p-6"
      >
        <div class="mb-4">
          <h2
            class="text-sm font-semibold"
            style="color: var(--text-primary);"
          >
            New Category
          </h2>

          <p
            class="text-xs mt-1"
            style="color: var(--text-muted);"
          >
            Create a category for future transactions.
          </p>
        </div>

        <form
          class="flex flex-col sm:flex-row gap-3"
          @submit.prevent="handleCreateCategory"
        >
          <input
            v-model="newCategory.name"
            type="text"
            required
            maxlength="50"
            placeholder="Category name"
            class="input-field flex-1"
          />

          <CustomSelect
            v-model="newCategory.type"
            :options="typeOptions"
            compact
            class="sm:w-40"
          />

          <button
            type="submit"
            :disabled="categoryStore.loading"
            class="btn-primary px-6 py-2.5 rounded-xl text-sm disabled:opacity-50"
          >
            {{ categoryStore.loading ? 'Creating...' : 'Create' }}
          </button>
        </form>

        <p
          v-if="categoryStore.error"
          class="text-xs mt-2"
          style="color: var(--text-muted);"
        >
          {{ categoryStore.error }}
        </p>
      </section>
    </Transition>

    <!-- Loading -->
    <div
      v-if="categoryStore.loading && totalCategories === 0"
      class="glass-card rounded-3xl p-12 text-center"
    >
      <div
        class="w-8 h-8 mx-auto rounded-full border-2 border-t-transparent animate-spin"
        style="
          border-color: var(--accent);
          border-top-color: transparent;
        "
      />

      <p
        class="text-sm mt-4"
        style="color: var(--text-muted);"
      >
        Loading categories...
      </p>
    </div>

    <!-- No categories -->
    <section
      v-else-if="totalCategories === 0"
      class="glass-card rounded-3xl p-12 md:p-16 text-center"
    >
      <div
        class="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
        style="
          background: var(--accent-glow);
          color: var(--accent-bright);
        "
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 5v14m-7-7h14"
          />
        </svg>
      </div>

      <h2
        class="text-base font-semibold mt-4"
        style="color: var(--text-primary);"
      >
        No categories yet
      </h2>

      <p
        class="text-sm mt-1 max-w-sm mx-auto"
        style="color: var(--text-muted);"
      >
        Create your first category to start organizing
        your transactions.
      </p>

      <button
        class="btn-primary px-5 py-2.5 rounded-xl text-sm mt-5"
        @click="showCategoryForm = true"
      >
        Create Category
      </button>
    </section>

    <!-- Category library -->
    <section
      v-else
      class="glass-card rounded-3xl p-6 md:p-7"
    >
      <!-- Header / controls -->
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h2
            class="text-base font-semibold"
            style="color: var(--text-primary);"
          >
            Your Categories
          </h2>

          <p
            class="text-xs mt-1"
            style="color: var(--text-muted);"
          >
            {{ displayedCategories.length }}
            {{
              displayedCategories.length === 1
                ? 'category'
                : 'categories'
            }}
            shown
          </p>
        </div>

        <div class="flex gap-2">
          <!-- Search -->
          <div class="relative">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              viewBox="0 0 24 24"
              style="color: var(--text-muted);"
            >
            </svg>

            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search"
              class="input-field pl-9 pr-3 py-2.5 text-xs w-36 sm:w-48"
            />
          </div>

          <!-- Filter -->
          <CustomSelect
            v-model="filterType"
            :options="filterOptions"
            compact
            class="w-36"
          />
        </div>
      </div>

      <!-- No search results -->
      <div
        v-if="displayedCategories.length === 0"
        class="py-12 text-center"
      >
        <p
          class="text-sm font-medium"
          style="color: var(--text-primary);"
        >
          No categories found
        </p>

        <p
          class="text-xs mt-1"
          style="color: var(--text-muted);"
        >
          Try a different search or filter.
        </p>
      </div>

      <!-- Category grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        <div
          v-for="category in displayedCategories"
          :key="category.id"
          class="group flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
          style="
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
          "
        >
          <!-- Category initial -->
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
            :style="{
              background:
                category.type === 'Income'
                  ? 'rgba(125, 211, 252, 0.12)'
                  : 'var(--accent-glow)',
              color:
                category.type === 'Income'
                  ? 'var(--income)'
                  : 'var(--accent-bright)',
            }"
          >
            {{ category.name.charAt(0).toUpperCase() }}
          </div>

          <!-- Category name -->
          <div class="min-w-0 flex-1">
            <p
              class="text-sm font-semibold truncate"
              style="color: var(--text-primary);"
            >
              {{ category.name }}
            </p>

            <!-- Only show type when viewing all -->
            <p
              v-if="filterType === 'all'"
              class="text-[11px] mt-0.5"
              :style="{
                color:
                  category.type === 'Income'
                    ? 'var(--income)'
                    : 'var(--accent-bright)',
              }"
            >
              {{ category.type }}
            </p>
          </div>

          <!-- Arrow -->
          <svg
            class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
            style="color: var(--text-muted);"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m9 18 6-6-6-6"
            />
          </svg>
        </div>
      </div>
    </section>

    <!-- Transaction modal -->
    <TransactionModal
      :open="showModal"
      @close="showModal = false"
      @submit="handleAddTransaction"
    />
  </AppLayout>
</template>