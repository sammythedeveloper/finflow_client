<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AnimatedBackground from '../components/AnimatedBackground.vue';
import ThemeToggle from '../components/ThemeToggle.vue';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const isRegister = computed(() => route.name === 'Register');

const username = ref('');
const email = ref('');
const password = ref('');

watch(isRegister, () => {
  auth.clearError();
});

const switchMode = (register: boolean) => {
  auth.clearError();
  router.push({ name: register ? 'Register' : 'Login' });
};

const handleSubmit = async () => {
  const success = isRegister.value
    ? await auth.register(username.value, email.value, password.value)
    : await auth.login(email.value, password.value);

  if (success) router.push({ name: 'Dashboard' });
};
</script>

<template>
  <div class="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
    <AnimatedBackground />

    <div class="absolute top-5 right-5 z-20">
      <ThemeToggle />
    </div>

    <div class="relative z-10 w-full max-w-[440px] animate-slide-up">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-2xl font-bold text-white animate-pulse-glow"
          style="background: linear-gradient(135deg, var(--accent), #3b82f6); box-shadow: 0 8px 32px var(--accent-glow);"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold tracking-tight gradient-text">FinFlow</h1>
        <p class="text-sm mt-2" style="color: var(--text-secondary);">
          {{ isRegister ? 'Begin your financial journey' : 'Welcome back, let\'s grow your wealth' }}
        </p>
      </div>

      <!-- Auth card -->
      <div class="glass-card rounded-3xl p-8 overflow-hidden">
        <!-- Mode toggle -->
        <div
          class="relative flex p-1 rounded-2xl mb-8"
          style="background: var(--bg-surface); border: 1px solid var(--border-subtle);"
        >
          <div
            class="absolute top-1 bottom-1 rounded-xl transition-all duration-400 ease-out"
            :style="{
              width: 'calc(50% - 4px)',
              left: isRegister ? 'calc(50% + 2px)' : '4px',
              background: 'linear-gradient(135deg, var(--accent), #3b82f6)',
              boxShadow: '0 4px 16px var(--accent-glow)',
            }"
          />
          <button
            type="button"
            class="relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-300"
            :style="{ color: !isRegister ? 'white' : 'var(--text-secondary)' }"
            @click="switchMode(false)"
          >
            Sign In
          </button>
          <button
            type="button"
            class="relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-300"
            :style="{ color: isRegister ? 'white' : 'var(--text-secondary)' }"
            @click="switchMode(true)"
          >
            Create Account
          </button>
        </div>

        <!-- Error -->
        <Transition name="fade-up">
          <div
            v-if="auth.error"
            class="mb-5 px-4 py-3 rounded-xl text-sm"
            style="background: var(--text-muted); color: var(--text-secondary); border: 1px solid var(--border-subtle);"
          >
            {{ auth.error }}
          </div>
        </Transition>

        <!-- Form with transition -->
        <form @submit.prevent="handleSubmit">
          <Transition name="fade-slide" mode="out-in">
            <div :key="isRegister ? 'register' : 'login'" class="space-y-4">
              <div v-if="isRegister" class="animate-slide-up opacity-0 stagger-1" style="animation-fill-mode: forwards;">
                <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--text-muted);">Username</label>
                <input v-model="username" type="text" required placeholder="Your name" class="input-field" />
              </div>

              <div class="animate-slide-up opacity-0 stagger-2" style="animation-fill-mode: forwards;">
                <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--text-muted);">Email</label>
                <input v-model="email" type="email" required placeholder="you@example.com" class="input-field" />
              </div>

              <div class="animate-slide-up opacity-0 stagger-3" style="animation-fill-mode: forwards;">
                <label class="block text-xs font-semibold uppercase tracking-wider mb-2" style="color: var(--text-muted);">Password</label>
                <input
                  v-model="password"
                  type="password"
                  required
                  :minlength="isRegister ? 6 : undefined"
                  placeholder="••••••••"
                  class="input-field"
                />
              </div>

              <div class="animate-slide-up opacity-0 stagger-4 pt-2" style="animation-fill-mode: forwards;">
                <button type="submit" :disabled="auth.loading" class="btn-primary w-full py-3 rounded-xl text-sm">
                  {{ auth.loading
                    ? (isRegister ? 'Creating account...' : 'Signing in...')
                    : (isRegister ? 'Create Account' : 'Sign In')
                  }}
                </button>
              </div>
            </div>
          </Transition>
        </form>
      </div>

      <p class="text-center text-xs mt-6" style="color: var(--text-muted);">
        Secure · Encrypted · Your data stays yours
      </p>
    </div>
  </div>
</template>
