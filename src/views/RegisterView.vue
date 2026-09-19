<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const auth = useAuthStore();

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);

const passwordRules = computed(() => ({
  length: password.value.length >= 8,
  uppercase: /[A-Z]/.test(password.value),
  lowercase: /[a-z]/.test(password.value),
  number: /[0-9]/.test(password.value),
  special: /[^A-Za-z0-9]/.test(password.value),
}));

const passwordIsStrong = computed(() => {
  return Object.values(passwordRules.value).every(Boolean);
});

const passwordsMatch = computed(() => {
  return (
    confirmPassword.value.length > 0 && password.value === confirmPassword.value
  );
});

const passwordStrength = computed(() => {
  const passed = Object.values(passwordRules.value).filter(Boolean).length;

  if (password.value.length === 0) {
    return {
      label: "",
      width: "0%",
    };
  }

  if (passed <= 2) {
    return {
      label: "Weak",
      width: "35%",
    };
  }

  if (passed <= 4) {
    return {
      label: "Almost there",
      width: "70%",
    };
  }

  return {
    label: "Strong",
    width: "100%",
  };
});

const handleRegister = async () => {
  auth.clearError();

  if (!passwordIsStrong.value) {
    auth.error =
      "Please choose a stronger password that meets all the requirements.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    auth.error = "Passwords do not match.";
    return;
  }

  const success = await auth.register(
    username.value,
    email.value,
    password.value
  );

  if (success) {
    router.push({ name: "Dashboard" });
  }
};

const clearError = () => {
  auth.clearError();
};
</script>

<template>
  <div
    class="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden"
  >
    <!-- Ambient glow -->
    <div
      class="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none"
    ></div>

    <div
      class="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] rounded-full bg-emerald-600/5 blur-[140px] pointer-events-none"
    ></div>

    <div class="relative z-10 w-full max-w-md">
      <!-- Brand -->
      <div class="text-center mb-8">
        <div
          class="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-2xl text-white mx-auto shadow-lg shadow-emerald-500/30 mb-4"
        >
          $
        </div>

        <h1 class="text-2xl font-bold text-white tracking-tight">
          Create your account
        </h1>

        <p class="text-sm text-gray-400 mt-1">
          Start tracking your finances today
        </p>
      </div>

      <!-- Form -->
      <form
        class="bg-emerald-950/30 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 space-y-4 shadow-2xl shadow-emerald-950/30"
        @submit.prevent="handleRegister"
      >
        <!-- Error -->
        <div
          v-if="auth.error"
          class="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl flex items-start gap-2"
        >
          <span class="mt-0.5">⚠</span>
          <span>{{ auth.error }}</span>
        </div>

        <!-- Username -->
        <div>
          <label
            class="block text-xs font-semibold text-emerald-400 uppercase mb-1.5"
          >
            Name
          </label>

          <input
            v-model="username"
            @input="clearError"
            type="text"
            required
            autocomplete="name"
            placeholder="Your name"
            class="w-full px-4 py-2.5 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
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
            @input="clearError"
            type="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
            class="w-full px-4 py-2.5 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>

        <!-- Password -->
        <div>
          <label
            class="block text-xs font-semibold text-emerald-400 uppercase mb-1.5"
          >
            Password
          </label>

          <div class="relative">
            <input
              v-model="password"
              @input="clearError"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="new-password"
              placeholder="Create a strong password"
              class="w-full px-4 py-2.5 pr-20 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />

            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-emerald-400 transition-colors"
            >
              {{ showPassword ? "Hide" : "Show" }}
            </button>
          </div>

          <!-- Password strength -->
          <div v-if="password" class="mt-3">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs text-gray-500"> Password strength </span>

              <span
                class="text-xs font-medium"
                :class="
                  passwordStrength.label === 'Strong'
                    ? 'text-emerald-400'
                    : 'text-gray-400'
                "
              >
                {{ passwordStrength.label }}
              </span>
            </div>

            <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                class="h-full bg-emerald-500 rounded-full transition-all duration-300"
                :style="{ width: passwordStrength.width }"
              ></div>
            </div>

            <!-- Requirements -->
            <div class="mt-3 space-y-1.5">
              <div
                class="flex items-center gap-2 text-xs"
                :class="
                  passwordRules.length ? 'text-emerald-400' : 'text-gray-500'
                "
              >
                <span>{{ passwordRules.length ? "✓" : "○" }}</span>
                <span>At least 8 characters</span>
              </div>

              <div
                class="flex items-center gap-2 text-xs"
                :class="
                  passwordRules.uppercase ? 'text-emerald-400' : 'text-gray-500'
                "
              >
                <span>{{ passwordRules.uppercase ? "✓" : "○" }}</span>
                <span>One uppercase letter</span>
              </div>

              <div
                class="flex items-center gap-2 text-xs"
                :class="
                  passwordRules.lowercase ? 'text-emerald-400' : 'text-gray-500'
                "
              >
                <span>{{ passwordRules.lowercase ? "✓" : "○" }}</span>
                <span>One lowercase letter</span>
              </div>

              <div
                class="flex items-center gap-2 text-xs"
                :class="
                  passwordRules.number ? 'text-emerald-400' : 'text-gray-500'
                "
              >
                <span>{{ passwordRules.number ? "✓" : "○" }}</span>
                <span>One number</span>
              </div>

              <div
                class="flex items-center gap-2 text-xs"
                :class="
                  passwordRules.special ? 'text-emerald-400' : 'text-gray-500'
                "
              >
                <span>{{ passwordRules.special ? "✓" : "○" }}</span>
                <span>One special character</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label
            class="block text-xs font-semibold text-emerald-400 uppercase mb-1.5"
          >
            Confirm Password
          </label>

          <input
            v-model="confirmPassword"
            @input="clearError"
            type="password"
            required
            autocomplete="new-password"
            placeholder="Enter your password again"
            class="w-full px-4 py-2.5 bg-emerald-950/40 border rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all"
            :class="
              confirmPassword && !passwordsMatch
                ? 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20'
                : 'border-emerald-500/20 focus:border-emerald-500/60 focus:ring-emerald-500/20'
            "
          />

          <p
            v-if="confirmPassword && !passwordsMatch"
            class="text-xs text-red-400 mt-1.5"
          >
            Passwords do not match.
          </p>

          <p v-if="passwordsMatch" class="text-xs text-emerald-400 mt-1.5">
            ✓ Passwords match
          </p>
        </div>

        <!-- Button -->
        <button
          type="submit"
          :disabled="auth.loading"
          class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
        >
          <svg
            v-if="auth.loading"
            class="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>

          {{ auth.loading ? "Creating account..." : "Create Account" }}
        </button>
      </form>

      <!-- Login -->
      <p class="text-center text-sm text-gray-400 mt-6">
        Already have an account?

        <router-link
          to="/login"
          class="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          Sign in
        </router-link>
      </p>
    </div>
  </div>
</template>
