<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ConfirmModal from "./ConfirmModal.vue";
import Footer from "./Footer.vue";
import ThemeToggle from "./ThemeToggle.vue";
import { useAuthStore } from "../stores/auth";
import { getInitials } from "../utils/format";

defineProps<{
  title: string;
  subtitle?: string;
}>();

const emit = defineEmits<{
  addTransaction: [];
}>();

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const showLogoutConfirm = ref(false);
const loggingOut = ref(false);

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
  },
  {
    name: "Categories",
    path: "/categories",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
];

const initials = computed(() =>
  getInitials(auth.username ?? auth.userEmail ?? "U")
);

const isActive = (path: string) => route.path === path;

const confirmLogout = async () => {
  if (loggingOut.value) return;

  loggingOut.value = true;
  try {
    await auth.logout();
    showLogoutConfirm.value = false;
    router.push({ name: "Landing" });
  } finally {
    loggingOut.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex" style="background: var(--bg-base)">
    <!-- Desktop Sidebar -->
    <aside
      class="hidden md:flex flex-col w-[260px] shrink-0 m-4 rounded-3xl overflow-hidden"
      style="
        background: var(--sidebar-bg);
        border: 1px solid var(--border-subtle);
        backdrop-filter: blur(24px);
      "
    >
      <!-- Logo -->
      <div class="px-6 pt-7 pb-6">
        <div class="flex items-center gap-3">
          <div
          class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
          style="
         background: linear-gradient(135deg, var(--accent), var(--accent-bright));
         box-shadow: 0 4px 16px var(--accent-glow);
          "
          @click="router.push('/')"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>

          <div>
            <span class="text-lg font-bold gradient-text"> FinFlow </span>

            <p
              class="text-[10px] uppercase tracking-widest"
              style="color: var(--text-muted)"
            >
              Finance
            </p>
          </div>
      
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300"
          :style="{
            color: isActive(item.path)
              ? 'var(--text-primary)'
              : 'var(--text-secondary)',
            background: isActive(item.path)
              ? 'var(--bg-surface-hover)'
              : 'transparent',
          }"
        >
          <div
            v-if="isActive(item.path)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
            style="background: linear-gradient(180deg, var(--accent), #38bdf8)"
          />

          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            :style="{
              background: isActive(item.path)
                ? 'var(--accent-glow)'
                : 'var(--bg-surface)',
              color: isActive(item.path)
                ? 'var(--accent-bright)'
                : 'var(--text-muted)',
            }"
          >
            <svg
              class="w-[18px] h-[18px]"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                :d="item.icon"
              />
            </svg>
          </div>

          {{ item.name }}
        </router-link>
      </nav>

      <!-- New Transaction -->
      <div class="p-4">
        <button
          class="btn-primary w-full py-3 rounded-2xl text-sm flex items-center justify-center gap-2"
          @click="emit('addTransaction')"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>

          New Transaction
        </button>
      </div>
    </aside>

    <!-- Main Application Column -->
    <div
      class="flex-1 flex flex-col min-w-0 min-h-screen p-3 md:p-4 pb-24 md:pb-4"
    >
      <!-- Header -->
      <header
        class="glass-card rounded-2xl px-5 md:px-7 py-3.5 flex items-center justify-between gap-4 mb-5 shrink-0"
      >
        <div>
          <h1 class="text-lg font-bold" style="color: var(--text-primary)">
            {{ title }}
          </h1>

          <p
            v-if="subtitle"
            class="text-xs mt-0.5"
            style="color: var(--text-muted)"
          >
            {{ subtitle }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <ThemeToggle />

          <div
            class="hidden sm:flex items-center gap-2 px-2 py-1.5 rounded-xl"
            style="
              background: var(--bg-surface);
              border: 1px solid var(--border-subtle);
            "
          >
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
              style="
                background: var(--accent-glow);
                color: var(--accent-bright);
              "
            >
              {{ initials }}
            </div>

            <span
              class="text-xs font-medium hidden lg:block max-w-[100px] truncate"
              style="color: var(--text-secondary)"
            >
              {{ auth.username }}
            </span>
          </div>

          <button
            class="btn-ghost text-xs px-3.5 py-2 rounded-xl"
            @click="showLogoutConfirm = true"
          >
            Sign Out
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 space-y-5">
        <slot />
      </main>

      <!-- Footer -->
      <Footer class="mt-8 shrink-0" />
    </div>

    <!-- Mobile Navigation -->
    <nav class="md:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-4">
      <div
        class="flex items-center justify-around py-2 px-2 rounded-2xl"
        style="
          background: var(--sidebar-bg);
          border: 1px solid var(--border-subtle);
          backdrop-filter: blur(24px);
          box-shadow: var(--card-shadow);
        "
      >
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] font-medium"
          :style="{
            color: isActive(item.path)
              ? 'var(--accent-bright)'
              : 'var(--text-muted)',
          }"
        >
          <div
            class="w-8 h-8 rounded-xl flex items-center justify-center"
            :style="{
              background: isActive(item.path)
                ? 'var(--accent-glow)'
                : 'transparent',
            }"
          >
            <svg
              class="w-[18px] h-[18px]"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                :d="item.icon"
              />
            </svg>
          </div>

          {{ item.name }}
        </router-link>

        <button
          class="flex flex-col items-center gap-0.5 text-[10px] font-medium"
          style="color: var(--accent-bright)"
          @click="emit('addTransaction')"
        >
          <div
            class="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
            style="background: linear-gradient(135deg, var(--accent), var(--accent-bright))"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>

          Add
        </button>
      </div>
    </nav>

    <!-- Logout Confirmation -->
    <ConfirmModal
      :open="showLogoutConfirm"
      title="Sign out?"
      message="Are you sure you want to sign out? You'll need to log in again to access your account."
      confirm-label="Yes, sign out"
      cancel-label="Stay logged in"
      danger
      @confirm="confirmLogout"
      @cancel="showLogoutConfirm = false"
    />
  </div>
</template>
