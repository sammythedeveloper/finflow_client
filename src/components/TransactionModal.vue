<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import CustomDatePicker from './CustomDatePicker.vue';
import CustomSelect from './CustomSelect.vue';
import { useCategoryStore } from '../stores/categories';
import type { TransactionCreate } from '../types';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [payload: TransactionCreate];
}>();

const categoryStore = useCategoryStore();

const form = ref({
  amount: '',
  description: '',
  categoryId: undefined as number | undefined,
  date: new Date().toISOString().split('T')[0],
});

const categoryOptions = computed(() =>
  categoryStore.categories.map((c) => ({
    label: `${c.name} (${c.type})`,
    value: c.id,
  })),
);

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      await categoryStore.fetchCategories();
      form.value = {
        amount: '',
        description: '',
        categoryId: undefined,
        date: new Date().toISOString().split('T')[0],
      };
    }
  },
);

const handleSubmit = () => {
  if (!form.value.categoryId) return;
  emit('submit', {
    amount: Number(form.value.amount),
    description: form.value.description,
    categoryId: form.value.categoryId,
    date: new Date(form.value.date).toISOString(),
  });
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-up">
      <div
        v-if="open"
        class="fixed inset-0 flex items-center justify-center p-4 z-50"
        style="background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);"
        @click.self="emit('close')"
      >
        <div class="glass-card rounded-3xl max-w-md w-full p-7 animate-slide-up">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-lg font-bold" style="color: var(--text-primary);">New Transaction</h3>
              <p class="text-xs mt-0.5" style="color: var(--text-muted);">Record income or expense</p>
            </div>
            <button
              class="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style="color: var(--text-muted); background: var(--bg-surface);"
              @click="emit('close')"
            >
              ✕
            </button>
          </div>

          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-2" style="color: var(--text-muted);">Description</label>
              <input v-model="form.description" type="text" placeholder="Grocery store, Salary..." class="input-field" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider mb-2" style="color: var(--text-muted);">Amount</label>
                <input v-model="form.amount" type="number" step="0.01" min="0.01" required placeholder="0.00" class="input-field" />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider mb-2" style="color: var(--text-muted);">Date</label>
                <CustomDatePicker v-model="form.date" />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-2" style="color: var(--text-muted);">Category</label>
              <CustomSelect
                v-model="form.categoryId"
                :options="categoryOptions"
                placeholder="Select category"
              />
              <p v-if="categoryOptions.length === 0" class="text-xs mt-2" style="color: var(--gold);">
                No categories yet.
                <router-link to="/categories" class="underline" @click="emit('close')">Create one first</router-link>.
              </p>
            </div>

            <div class="flex justify-end gap-3 pt-4" style="border-top: 1px solid var(--border-subtle);">
              <button
                type="button"
                class="px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                style="color: var(--text-secondary); background: var(--bg-surface); border: 1px solid var(--border-subtle);"
                @click="emit('close')"
              >
                Cancel
              </button>
              <button type="submit" :disabled="!form.categoryId" class="btn-primary px-5 py-2.5 rounded-xl text-xs">
                Save Transaction
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
