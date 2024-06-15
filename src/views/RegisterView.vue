<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const username = ref('');
const email = ref('');
const password = ref('');

const handleRegister = async () => {
  const success = await auth.register(username.value, email.value, password.value);
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
        <h1 class="text-2xl font-bold text-white tracking-tight">Create your account</h1>
        <p class="text-sm text-gray-400 mt-1">Start tracking your finances today</p>
      </div>

      <form class="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 space-y-4" @submit.prevent="handleRegister">
        <div v-if="auth.error" class="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
          {{ auth.error }}
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-400 uppercase mb-1.5">Username</label>
          <input
            v-model="username"
            type="text"
            required
            placeholder="Name"
            class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
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
            minlength="6"
            placeholder="••••••••"
            class="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          :disabled="auth.loading"
          class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg"
        >
          {{ auth.loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-400 mt-6">
        Already have an account?
        <router-link to="/login" class="text-emerald-400 hover:text-emerald-300 font-medium">Sign in</router-link>
      </p>
    </div>
  </div>
</template>
