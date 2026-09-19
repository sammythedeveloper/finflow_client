<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AnimatedBackground from "../components/AnimatedBackground.vue";
import ThemeToggle from "../components/ThemeToggle.vue";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();

const mobileMenuOpen = ref(false);

const goToLogin = () => {
  mobileMenuOpen.value = false;
  router.push({ name: "Login" });
};

const goToRegister = () => {
  mobileMenuOpen.value = false;
  router.push({ name: "Register" });
};

const goToDashboard = () => {
  router.push({ name: "Dashboard" });
};
</script>

<template>
  <div
    class="relative min-h-screen overflow-hidden"
    style="background: var(--bg-base); color: var(--text-primary)"
  >
    <!-- EXACT SAME ANIMATED BACKGROUND -->
    <AnimatedBackground />
    <!-- NAVIGATION -->
    <header class="relative z-50 px-4 sm:px-6 pt-4">
      <nav
        class="mx-auto max-w-7xl rounded-2xl border px-5 py-3.5 backdrop-blur-xl"
        style="background: var(--bg-glass); border-color: var(--border-subtle)"
      >
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <button
            type="button"
            class="flex items-center gap-3"
            @click="router.push({ name: 'Home' })"
          >
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl text-lg text-white shadow-lg font-bold animate-pulse-glow"
              style="
                background: linear-gradient(135deg, var(--accent), var(--accent-bright));
                box-shadow: 0 4px 16px var(--accent-glow);
              "
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
            <h3 class="text-xl font-bold tracking-tight gradient-text">
              FinFlow
            </h3>
          </button>

          <!-- Desktop navigation -->
          <div class="hidden md:flex items-center gap-8">
            <a
              href="#features"
              class="text-sm transition-colors"
              style="color: var(--text-secondary)"
              @mouseenter="
                ($event.currentTarget as HTMLElement).style.color =
                  'var(--text-primary)'
              "
              @mouseleave="
                ($event.currentTarget as HTMLElement).style.color =
                  'var(--text-secondary)'
              "
            >
              Features
            </a>

            <a
              href="#how-it-works"
              class="text-sm transition-colors"
              style="color: var(--text-secondary)"
              @mouseenter="
                ($event.currentTarget as HTMLElement).style.color =
                  'var(--text-primary)'
              "
              @mouseleave="
                ($event.currentTarget as HTMLElement).style.color =
                  'var(--text-secondary)'
              "
            >
              How it works
            </a>

            <a
              href="#overview"
              class="text-sm transition-colors"
              style="color: var(--text-secondary)"
              @mouseenter="
                ($event.currentTarget as HTMLElement).style.color =
                  'var(--text-primary)'
              "
              @mouseleave="
                ($event.currentTarget as HTMLElement).style.color =
                  'var(--text-secondary)'
              "
            >
              Overview
            </a>
          </div>

          <!-- Desktop actions -->
          <div class="hidden sm:flex items-center gap-3">
            <div
              v-if="!auth.isAuthenticated"
              type="button"
              class="rounded-xl px-4 py-2.5 text-sm"
            >
              <ThemeToggle />
            </div>
            <button
              v-if="!auth.isAuthenticated"
              type="button"
              class="btn-ghost rounded-xl px-4 py-2.5 text-sm"
              @click="goToLogin"
            >
              Sign in
            </button>

            <button
              v-if="!auth.isAuthenticated"
              type="button"
              class="btn-primary rounded-xl px-5 py-2.5 text-sm"
              @click="goToRegister"
            >
              Get started
            </button>

            <button
              v-else
              type="button"
              class="btn-primary rounded-xl px-5 py-2.5 text-sm"
              @click="goToDashboard"
            >
              Open dashboard
            </button>
          </div>

          <!-- Mobile button -->
          <button
            type="button"
            class="sm:hidden flex h-10 w-10 items-center justify-center rounded-xl"
            style="
              background: var(--bg-surface);
              border: 1px solid var(--border-subtle);
              color: var(--text-primary);
            "
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg
              v-if="!mobileMenuOpen"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>

            <svg
              v-else
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>
        </div>

        <!-- Mobile menu -->
        <Transition name="fade-up">
          <div
            v-if="mobileMenuOpen"
            class="md:hidden mt-4 pt-4 space-y-2 border-t"
            style="border-color: var(--border-subtle)"
          >
            <a
              href="#features"
              class="block rounded-xl px-4 py-3 text-sm"
              style="color: var(--text-secondary)"
              @click="mobileMenuOpen = false"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              class="block rounded-xl px-4 py-3 text-sm"
              style="color: var(--text-secondary)"
              @click="mobileMenuOpen = false"
            >
              How it works
            </a>

            <a
              href="#overview"
              class="block rounded-xl px-4 py-3 text-sm"
              style="color: var(--text-secondary)"
              @click="mobileMenuOpen = false"
            >
              Overview
            </a>

            <div class="grid grid-cols-2 gap-2 pt-2">
              <button
                v-if="!auth.isAuthenticated"
                type="button"
                class="btn-ghost rounded-xl px-4 py-3 text-sm"
                @click="goToLogin"
              >
                Sign in
              </button>

              <button
                v-if="!auth.isAuthenticated"
                type="button"
                class="btn-primary rounded-xl px-4 py-3 text-sm"
                @click="goToRegister"
              >
                Get started
              </button>

              <button
                v-else
                type="button"
                class="btn-primary col-span-2 rounded-xl px-4 py-3 text-sm"
                @click="goToDashboard"
              >
                Open dashboard
              </button>
            </div>
          </div>
        </Transition>
      </nav>
    </header>

    <!-- ========================= -->
    <!-- HERO -->
    <!-- ========================= -->

    <main class="relative z-10">
      <section class="px-4 sm:px-6 pt-20 sm:pt-28 lg:pt-32">
        <div class="mx-auto max-w-7xl">
          <div class="max-w-4xl mx-auto text-center">
            <!-- Small label -->
            <div
              class="animate-slide-up inline-flex items-center gap-2 rounded-full border px-4 py-2 mb-7"
              style="
                background: var(--bg-surface);
                border-color: var(--border-subtle);
              "
            >
              <span
                class="h-2 w-2 rounded-full animate-pulse-glow"
                style="background: var(--accent)"
              />

              <span
                class="text-xs sm:text-sm font-medium"
                style="color: var(--text-secondary)"
              >
                Your money. One clear picture.
              </span>
            </div>

            <!-- Headline -->
            <h1
              class="animate-slide-up text-5xl sm:text-6xl lg:text-7xl xl:text-[88px] font-bold tracking-[-0.045em] leading-[0.98]"
              style="animation-delay: 0.08s"
            >
              Take control of
              <br />

              <span class="gradient-text"> your financial flow. </span>
            </h1>

            <!-- Description -->
            <p
              class="animate-slide-up mx-auto mt-7 max-w-2xl text-base sm:text-lg lg:text-xl leading-8"
              style="color: var(--text-secondary); animation-delay: 0.16s"
            >
              Track your income and expenses, automatically organize your
              spending, and see exactly where your money is going with one
              simple financial overview.
            </p>

            <!-- CTA -->
            <div
              class="animate-slide-up mt-9 flex flex-col sm:flex-row justify-center items-center gap-3"
              style="animation-delay: 0.24s"
            >
              <button
                type="button"
                class="btn-primary w-full sm:w-auto rounded-xl px-7 py-3.5 text-sm sm:text-base"
                @click="goToRegister"
              >
                Start managing your money
                <span class="ml-2">→</span>
              </button>

              <a
                href="#overview"
                class="btn-ghost w-full sm:w-auto rounded-xl px-7 py-3.5 text-sm sm:text-base text-center"
              >
                See how it works
              </a>
            </div>

            <p
              class="animate-fade-in mt-4 text-xs"
              style="color: var(--text-muted); animation-delay: 0.4s"
            >
              Simple financial tracking · Clear insights · Built for you
            </p>
          </div>

          <!-- ========================= -->
          <!-- DASHBOARD PREVIEW -->
          <!-- ========================= -->

          <div
            id="overview"
            class="animate-slide-up relative mx-auto mt-20 max-w-6xl"
            style="animation-delay: 0.3s"
          >
            <!-- Glow behind dashboard -->
            <div
              class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-[100px] opacity-20"
              style="background: var(--accent)"
            />

            <!-- Dashboard shell -->
            <div
              class="relative rounded-2xl sm:rounded-3xl border p-2 sm:p-3"
              style="
                background: var(--bg-glass);
                border-color: var(--border-subtle);
                box-shadow: 0 30px 100px rgba(0, 0, 0, 0.35),
                  0 0 60px var(--accent-glow);
              "
            >
              <div
                class="rounded-xl sm:rounded-2xl border overflow-hidden"
                style="
                  background: var(--bg-elevated);
                  border-color: var(--border-subtle);
                "
              >
                <!-- Fake browser/dashboard header -->
                <div
                  class="h-12 sm:h-14 px-4 sm:px-6 flex items-center justify-between border-b"
                  style="border-color: var(--border-subtle)"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="h-2.5 w-2.5 rounded-full"
                      style="background: var(--accent)"
                    />
                    <span
                      class="text-xs sm:text-sm font-semibold"
                      style="color: var(--text-primary)"
                    >
                      Financial Overview
                    </span>
                  </div>

                  <div class="hidden sm:flex items-center gap-2">
                    <div
                      class="h-7 w-20 rounded-lg"
                      style="background: var(--bg-surface)"
                    />
                    <div
                      class="h-7 w-7 rounded-full"
                      style="background: var(--bg-surface)"
                    />
                  </div>
                </div>

                <!-- Dashboard -->
                <div class="p-4 sm:p-6 lg:p-8">

<!-- =========================
     Overview header
========================== -->
<div class="flex items-end justify-between mb-6">
  <div>
    <p
      class="text-xs font-medium uppercase tracking-wider"
      style="color: var(--accent)"
    >
      Overview
    </p>

    <h2
      class="mt-1 text-xl sm:text-2xl font-bold tracking-tight"
      style="color: var(--text-primary)"
    >
      Your finances at a glance
    </h2>
  </div>

  <span
    class="hidden sm:block text-xs"
    style="color: var(--text-muted)"
  >
    September 2026
  </span>
</div>


<!-- =========================
     Financial snapshot
========================== -->
<div class="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr] gap-3">

  <!-- Balance — HERO -->
  <div
    class="relative overflow-hidden rounded-2xl border p-5 sm:p-6"
    style="
      background: var(--bg-surface);
      border-color: var(--border-subtle);
    "
  >
    <!-- subtle accent glow -->
    <div
      class="absolute -right-16 -top-16 w-40 h-40 rounded-full blur-3xl opacity-10"
      style="background: var(--accent)"
    />

    <div class="relative">
      <div class="flex items-center justify-between">
        <p
          class="text-xs font-medium"
          style="color: var(--text-muted)"
        >
          Current balance
        </p>

        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center"
          style="
            background: var(--accent-glow);
            color: var(--accent-bright);
          "
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v18m9-9H3"
            />
          </svg>
        </div>
      </div>

      <div class="mt-5 flex items-end gap-3">
        <p
          class="text-3xl sm:text-4xl font-bold tracking-tight"
          style="color: var(--text-primary)"
        >
          $8,420.50
        </p>

        <span
          class="mb-1.5 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold"
          style="
            color: var(--income);
            background: var(--income-bg);
          "
        >
          ↗ 12.4%
        </span>
      </div>

      <p
        class="mt-2 text-xs"
        style="color: var(--text-muted)"
      >
        Compared with last month
      </p>
    </div>
  </div>


  <!-- Income -->
  <div
    class="rounded-2xl border p-5"
    style="
      background: var(--bg-surface);
      border-color: var(--border-subtle);
    "
  >
    <div class="flex items-center justify-between">
      <p
        class="text-xs font-medium"
        style="color: var(--text-muted)"
      >
        Income
      </p>

      <span
        class="w-8 h-8 rounded-lg flex items-center justify-center"
        style="
          background: var(--income-bg);
          color: var(--income);
        "
      >
        ↗
      </span>
    </div>

    <p
      class="mt-5 text-2xl font-bold"
      style="color: var(--income)"
    >
      +$5,840
    </p>

    <p
      class="mt-2 text-xs"
      style="color: var(--text-muted)"
    >
      This month
    </p>
  </div>


  <!-- Expenses -->
  <div
    class="rounded-2xl border p-5"
    style="
      background: var(--bg-surface);
      border-color: var(--border-subtle);
    "
  >
    <div class="flex items-center justify-between">
      <p
        class="text-xs font-medium"
        style="color: var(--text-muted)"
      >
        Expenses
      </p>

      <span
        class="w-8 h-8 rounded-lg flex items-center justify-center"
        style="
          background: var(--expense-bg);
          color: var(--expense);
        "
      >
        ↘
      </span>
    </div>

    <p
      class="mt-5 text-2xl font-bold"
      style="color: var(--text-primary)"
    >
      -$2,316
    </p>

    <p
      class="mt-2 text-xs"
      style="color: var(--text-muted)"
    >
      This month
    </p>
  </div>
</div>


<!-- =========================
     Main analytics
========================== -->
<div class="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-4 mt-4">

  <!-- Financial flow -->
  <div
    class="rounded-2xl border p-5 sm:p-6"
    style="
      background: var(--bg-surface);
      border-color: var(--border-subtle);
    "
  >
    <div class="flex items-start justify-between">
      <div>
        <p
          class="text-sm font-semibold"
          style="color: var(--text-primary)"
        >
          Financial flow
        </p>

        <p
          class="mt-1 text-xs"
          style="color: var(--text-muted)"
        >
          Income and spending over time
        </p>
      </div>

      <button
        type="button"
        class="px-2.5 py-1.5 rounded-lg text-[11px] font-medium"
        style="
          color: var(--text-secondary);
          background: var(--bg-surface-hover);
          border: 1px solid var(--border-subtle);
        "
      >
        6 months
      </button>
    </div>

    <!-- Legend -->
    <div class="flex items-center gap-4 mt-5">
      <div class="flex items-center gap-1.5">
        <span
          class="w-2 h-2 rounded-full"
          style="background: var(--accent)"
        />
        <span
          class="text-[11px]"
          style="color: var(--text-muted)"
        >
          Income
        </span>
      </div>

      <div class="flex items-center gap-1.5">
        <span
          class="w-2 h-2 rounded-full"
          style="background: var(--chart-bar-inactive)"
        />
        <span
          class="text-[11px]"
          style="color: var(--text-muted)"
        >
          Expenses
        </span>
      </div>
    </div>

    <!-- Chart -->
    <div class="mt-5 h-48 sm:h-56 flex items-end gap-3 sm:gap-6">
      <div
        v-for="(bar, index) in [
          { month: 'Apr', income: 45, expense: 28 },
          { month: 'May', income: 58, expense: 35 },
          { month: 'Jun', income: 52, expense: 31 },
          { month: 'Jul', income: 72, expense: 42 },
          { month: 'Aug', income: 65, expense: 38 },
          { month: 'Sep', income: 88, expense: 46 },
        ]"
        :key="index"
        class="flex-1 h-full flex flex-col justify-end"
      >
        <div class="flex items-end justify-center gap-1.5 h-[calc(100%-20px)]">
          <div
            class="w-3 sm:w-5 rounded-t-md transition-all duration-300 hover:opacity-80"
            :style="{
              height: `${bar.income}%`,
              background: 'var(--accent)',
            }"
          />

          <div
            class="w-3 sm:w-5 rounded-t-md transition-all duration-300 hover:opacity-80"
            :style="{
              height: `${bar.expense}%`,
              background: 'var(--chart-bar-inactive)',
            }"
          />
        </div>

        <span
          class="mt-2 text-[10px] text-center"
          style="color: var(--text-muted)"
        >
          {{ bar.month }}
        </span>
      </div>
    </div>
  </div>


  <!-- Spending -->
  <div
    class="rounded-2xl border p-5 sm:p-6"
    style="
      background: var(--bg-surface);
      border-color: var(--border-subtle);
    "
  >
    <div class="flex items-start justify-between">
      <div>
        <p
          class="text-sm font-semibold"
          style="color: var(--text-primary)"
        >
          Spending
        </p>

        <p
          class="mt-1 text-xs"
          style="color: var(--text-muted)"
        >
          Where your money goes
        </p>
      </div>

      <span
        class="text-xs font-semibold"
        style="color: var(--text-primary)"
      >
        $2,316
      </span>
    </div>

    <div class="mt-6 space-y-5">
      <div
        v-for="category in [
          { name: 'Housing', value: 38, amount: '$880' },
          { name: 'Food', value: 24, amount: '$556' },
          { name: 'Transport', value: 16, amount: '$371' },
          { name: 'Shopping', value: 12, amount: '$278' },
        ]"
        :key="category.name"
      >
        <div class="flex items-center justify-between mb-2">
          <span
            class="text-xs font-medium"
            style="color: var(--text-secondary)"
          >
            {{ category.name }}
          </span>

          <div class="flex items-center gap-2">
            <span
              class="text-[11px]"
              style="color: var(--text-muted)"
            >
              {{ category.amount }}
            </span>

            <span
              class="text-xs font-semibold"
              style="color: var(--text-primary)"
            >
              {{ category.value }}%
            </span>
          </div>
        </div>

        <div
          class="h-1.5 rounded-full overflow-hidden"
          style="background: var(--chart-bar-inactive)"
        >
          <div
            class="h-full rounded-full"
            :style="{
              width: `${category.value}%`,
              background: 'var(--accent)',
            }"
          />
        </div>
      </div>
    </div>

    <button
      type="button"
      class="mt-6 w-full py-2.5 rounded-xl text-xs font-semibold transition-all"
      style="
        color: var(--accent);
        background: var(--accent-glow);
      "
    >
      View spending breakdown
    </button>
  </div>
</div>


<!-- =========================
     Recent activity
========================== -->
<div
  class="mt-4 rounded-2xl border overflow-hidden"
  style="
    background: var(--bg-surface);
    border-color: var(--border-subtle);
  "
>
  <div class="px-5 py-4 flex items-center justify-between">
    <div>
      <p
        class="text-sm font-semibold"
        style="color: var(--text-primary)"
      >
        Recent activity
      </p>

      <p
        class="mt-1 text-xs"
        style="color: var(--text-muted)"
      >
        Your latest transactions
      </p>
    </div>

    <button
      type="button"
      class="text-xs font-semibold transition-colors"
      style="color: var(--accent)"
    >
      View all →
    </button>
  </div>

  <div
    class="border-t"
    style="border-color: var(--border-subtle)"
  >
    <div
      v-for="transaction in [
        {
          name: 'Salary',
          category: 'Income',
          amount: '+$4,200',
          type: 'income',
        },
        {
          name: 'Rent',
          category: 'Housing',
          amount: '-$1,450',
          type: 'expense',
        },
        {
          name: 'Grocery Store',
          category: 'Food',
          amount: '-$124.50',
          type: 'expense',
        },
      ]"
      :key="transaction.name"
      class="group flex items-center justify-between px-5 py-3.5 transition-colors"
      style="border-bottom: 1px solid var(--border-subtle)"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-transform duration-200 group-hover:scale-105"
          style="background: var(--bg-surface-hover)"
        >
          <span
            :style="{
              color:
                transaction.type === 'income'
                  ? 'var(--income)'
                  : 'var(--text-secondary)',
            }"
          >
            {{ transaction.type === "income" ? "↗" : "↘" }}
          </span>
        </div>

        <div>
          <p
            class="text-xs sm:text-sm font-semibold"
            style="color: var(--text-primary)"
          >
            {{ transaction.name }}
          </p>

          <p
            class="mt-0.5 text-[10px] sm:text-xs"
            style="color: var(--text-muted)"
          >
            {{ transaction.category }}
          </p>
        </div>
      </div>

      <span
        class="text-xs sm:text-sm font-semibold"
        :style="{
          color:
            transaction.type === 'income'
              ? 'var(--income)'
              : 'var(--text-primary)',
        }"
      >
        {{ transaction.amount }}
      </span>
    </div>
  </div>
</div>

</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================= -->
      <!-- FEATURES -->
      <!-- ========================= -->

      <section id="features" class="px-4 sm:px-6 py-28 sm:py-36">
        <div class="mx-auto max-w-7xl">
          <div class="max-w-2xl mb-14">
            <p
              class="text-sm font-semibold uppercase tracking-widest"
              style="color: var(--accent)"
            >
              Everything in one place
            </p>

            <h2
              class="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
              style="color: var(--text-primary)"
            >
              Understand your money
              <span class="gradient-text">at a glance.</span>
            </h2>

            <p
              class="mt-5 text-base leading-7"
              style="color: var(--text-secondary)"
            >
              FinFlow turns your everyday financial activity into a clear,
              visual picture of how your money moves.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <!-- Feature 1 -->
            <div class="glass-card glass-card-hover rounded-2xl p-6 sm:p-7">
              <div
                class="h-11 w-11 rounded-xl flex items-center justify-center"
                style="
                  background: var(--accent-glow);
                  color: var(--accent-bright);
                "
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.7"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h3
                class="mt-6 text-lg font-semibold"
                style="color: var(--text-primary)"
              >
                Track every transaction
              </h3>

              <p
                class="mt-3 text-sm leading-6"
                style="color: var(--text-secondary)"
              >
                Keep your income and expenses organized in one simple place.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="glass-card glass-card-hover rounded-2xl p-6 sm:p-7">
              <div
                class="h-11 w-11 rounded-xl flex items-center justify-center"
                style="background: var(--income-bg); color: var(--income)"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.7"
                    d="M7 12l3 3 7-7M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h3
                class="mt-6 text-lg font-semibold"
                style="color: var(--text-primary)"
              >
                Categorize your spending
              </h3>

              <p
                class="mt-3 text-sm leading-6"
                style="color: var(--text-secondary)"
              >
                See exactly where your money goes with organized spending
                categories.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="glass-card glass-card-hover rounded-2xl p-6 sm:p-7">
              <div
                class="h-11 w-11 rounded-xl flex items-center justify-center"
                style="background: var(--gold-glow); color: var(--gold)"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.7"
                    d="M3 3v18h18M7 16l4-5 3 3 5-7"
                  />
                </svg>
              </div>

              <h3
                class="mt-6 text-lg font-semibold"
                style="color: var(--text-primary)"
              >
                Visualize your financial flow
              </h3>

              <p
                class="mt-3 text-sm leading-6"
                style="color: var(--text-secondary)"
              >
                Turn raw transactions into charts and summaries that actually
                make sense.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================= -->
      <!-- HOW IT WORKS -->
      <!-- ========================= -->

      <section id="how-it-works" class="px-4 sm:px-6 pb-28 sm:pb-36">
        <div class="mx-auto max-w-7xl">
          <div class="glass-card rounded-3xl p-8 sm:p-12 lg:p-16 text-center">
            <p
              class="text-sm font-semibold uppercase tracking-widest"
              style="color: var(--accent)"
            >
              Simple by design
            </p>

            <h2
              class="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
              style="color: var(--text-primary)"
            >
              Your finances,
              <br />
              without the complexity.
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 text-left">
              <div>
                <span class="text-sm font-bold" style="color: var(--accent)">
                  01
                </span>

                <h3
                  class="mt-3 text-lg font-semibold"
                  style="color: var(--text-primary)"
                >
                  Add your transactions
                </h3>

                <p
                  class="mt-2 text-sm leading-6"
                  style="color: var(--text-secondary)"
                >
                  Record money coming in and going out.
                </p>
              </div>

              <div>
                <span class="text-sm font-bold" style="color: var(--accent)">
                  02
                </span>

                <h3
                  class="mt-3 text-lg font-semibold"
                  style="color: var(--text-primary)"
                >
                  Organize your spending
                </h3>

                <p
                  class="mt-2 text-sm leading-6"
                  style="color: var(--text-secondary)"
                >
                  Categorize transactions and keep everything structured.
                </p>
              </div>

              <div>
                <span class="text-sm font-bold" style="color: var(--accent)">
                  03
                </span>

                <h3
                  class="mt-3 text-lg font-semibold"
                  style="color: var(--text-primary)"
                >
                  Understand your flow
                </h3>

                <p
                  class="mt-2 text-sm leading-6"
                  style="color: var(--text-secondary)"
                >
                  Use visual summaries to understand your financial picture.
                </p>
              </div>
            </div>

            <button
              type="button"
              class="btn-primary mt-12 rounded-xl px-7 py-3.5 text-sm"
              @click="goToRegister"
            >
              Start using FinFlow →
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- ========================= -->
    <!-- FOOTER -->
    <!-- ========================= -->

    <footer
      class="relative z-10 border-t px-4 sm:px-6 py-8"
      style="border-color: var(--border-subtle)"
    >
      <div
        class="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl text-lg text-white shadow-lg font-bold animate-pulse-glow"
          style="
            background: linear-gradient(
              135deg,
              var(--accent),
              var(--accent-bright)
            );
            box-shadow: 0 4px 16px var(--accent-glow);
          "
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

        <p class="text-xs" style="color: var(--text-muted)">
          Take control of your financial flow.
        </p>
      </div>
    </footer>
  </div>
</template>
