<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  const success = await auth.login(email.value, password.value);

  if (success) {
    router.push({ name: 'Dashboard' });
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">

    <!-- Green ambient glow -->
    <div
      class="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none"
    ></div>

    <div
      class="absolute bottom-[-200px] left-[-150px] w-[500px] h-[500px] rounded-full bg-emerald-600/5 blur-[140px] pointer-events-none"
    ></div>

    <div
      class="absolute top-1/2 right-[-200px] w-[450px] h-[450px] rounded-full bg-emerald-400/5 blur-[140px] pointer-events-none"
    ></div>

    <!-- Subtle green grid -->
    <div
      class="absolute inset-0 opacity-[0.025] pointer-events-none"
      style="
        background-image:
          linear-gradient(rgba(16, 185, 129, 0.8) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16, 185, 129, 0.8) 1px, transparent 1px);
        background-size: 70px 70px;
        mask-image: linear-gradient(to bottom, black, transparent);
        -webkit-mask-image: linear-gradient(to bottom, black, transparent);
      "
    ></div>

    <!-- Login -->
    <div class="relative z-10 w-full max-w-md">

      <!-- Brand -->
      <div class="text-center mb-8">

        <div
          class="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-2xl text-white mx-auto shadow-lg shadow-emerald-500/30 mb-4"
        >
          $
        </div>

        <h1 class="text-2xl font-bold text-white tracking-tight">
          Welcome to FinFlow
        </h1>

        <p class="text-sm text-gray-400 mt-1">
          Sign in to manage your finances
        </p>

      </div>

      <!-- Form -->
      <form
        class="
          bg-emerald-950/30
          backdrop-blur-xl
          border border-emerald-500/20
          rounded-2xl
          p-6
          space-y-4
          shadow-2xl
          shadow-emerald-950/30
        "
        @submit.prevent="handleLogin"
      >

        <!-- Error -->
        <div
          v-if="auth.error"
          class="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl"
        >
          {{ auth.error }}
        </div>

        <!-- Email -->
        <div>
          <label
            class="block text-xs font-semibold text-emerald-400 uppercase mb-1.5"
          >
            Email
          </label>

          <input
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="
              w-full
              px-4
              py-2.5
              bg-emerald-950/40
              border
              border-emerald-500/20
              rounded-xl
              text-sm
              text-white
              placeholder-gray-500
              focus:outline-none
              focus:border-emerald-500/60
              focus:ring-2
              focus:ring-emerald-500/20
              transition-all
            "
          />
        </div>

        <!-- Password -->
        <div>
          <label
            class="block text-xs font-semibold text-emerald-400 uppercase mb-1.5"
          >
            Password
          </label>

          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="
              w-full
              px-4
              py-2.5
              bg-emerald-950/40
              border
              border-emerald-500/20
              rounded-xl
              text-sm
              text-white
              placeholder-gray-500
              focus:outline-none
              focus:border-emerald-500/60
              focus:ring-2
              focus:ring-emerald-500/20
              transition-all
            "
          />
        </div>

        <!-- Button -->
        <button
          type="submit"
          :disabled="auth.loading"
          class="
            w-full
            py-2.5
            bg-emerald-600
            hover:bg-emerald-500
            disabled:opacity-50
            text-white
            font-semibold
            text-sm
            rounded-xl
            transition-all
            shadow-lg
            shadow-emerald-500/30
            hover:shadow-emerald-500/40
          "
        >
          {{ auth.loading ? 'Signing in...' : 'Sign In' }}
        </button>

      </form>

      <!-- Register -->
      <p class="text-center text-sm text-gray-400 mt-6">
        Don't have an account?

        <router-link
          to="/register"
          class="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          Create one
        </router-link>
      </p>

    </div>

  </div>
</template>