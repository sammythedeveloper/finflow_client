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
  <div class="min-h-screen bg-gray-950 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-2xl text-white mx-auto shadow-lg shadow-emerald-500/30 mb-4">
          $
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Welcome to FinFlow</h1>
        <p class="text-sm text-gray-400 mt-1">Sign in to manage your finances</p>
      </div>

      <form class="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-4" @submit.prevent="handleLogin">
        <div v-if="auth.error" class="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
          {{ auth.error }}
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          :disabled="auth.loading"
          class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg"
        >
          {{ auth.loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-400 mt-6">
        Don't have an account?
        <router-link to="/register" class="text-emerald-400 hover:text-emerald-300 font-medium">Create one</router-link>
      </p>
    </div>
  </div>
</template>
