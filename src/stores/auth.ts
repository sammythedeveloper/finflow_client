import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { authService } from "../services/authService";
import { supabase } from "../lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", () => {
  const session = ref<Session | null>(null);
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialized = ref(false);

  const isAuthenticated = computed(() => !!session.value);
  const token = computed(() => session.value?.access_token ?? null);
  const userEmail = computed(() => user.value?.email ?? null);

  const username = computed(() => {
    return (
      (user.value?.user_metadata?.username as string) ||
      user.value?.email?.split("@")[0] ||
      null
    );
  });

  // Initialize session on app load
  const init = async () => {
    if (initialized.value) return;

    loading.value = true;

    try {
      const { data } = await supabase.auth.getSession();

      session.value = data.session;
      user.value = data.session?.user ?? null;

      supabase.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession;
        user.value = newSession?.user ?? null;
      });
    } finally {
      loading.value = false;
      initialized.value = true;
    }
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      const data = await authService.login(email.trim(), password);

      session.value = data.session;
      user.value = data.user;

      return true;
    } catch (err: any) {
      const message = err?.message?.toLowerCase() || "";

      if (
        message.includes("invalid login credentials") ||
        message.includes("invalid credentials") ||
        message.includes("invalid email") ||
        message.includes("invalid password")
      ) {
        error.value = "Invalid email or password.";
      } else if (message.includes("email not confirmed")) {
        error.value = "Please confirm your email before signing in.";
      } else if (message.includes("too many requests")) {
        error.value = "Too many login attempts. Please wait a moment and try again.";
      } else {
        error.value = "Unable to sign in. Please try again.";
      }

      return false;
    } finally {
      loading.value = false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const data = await authService.register(
        name.trim(),
        email.trim(),
        password
      );

      // Email confirmation is enabled
      if (!data.session) {
        error.value =
          "Account created. Please check your email to confirm your account.";

        return false;
      }

      session.value = data.session;
      user.value = data.user;

      return true;
    } catch (err: any) {
      const message = err?.message?.toLowerCase() || "";

      if (
        message.includes("password") &&
        (
          message.includes("weak") ||
          message.includes("minimum") ||
          message.includes("characters")
        )
      ) {
        error.value =
          "Your password is too weak. Please choose a stronger password.";
      } else if (
        message.includes("user already registered") ||
        message.includes("already registered") ||
        message.includes("already exists")
      ) {
        error.value = "An account with this email already exists.";
      } else if (message.includes("invalid email")) {
        error.value = "Please enter a valid email address.";
      } else if (message.includes("too many requests")) {
        error.value =
          "Too many signup attempts. Please wait a moment and try again.";
      } else {
        error.value = "Unable to create your account. Please try again.";
      }

      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    await authService.logout();

    session.value = null;
    user.value = null;
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    session,
    user,
    loading,
    error,
    initialized,
    isAuthenticated,
    token,
    userEmail,
    username,
    init,
    login,
    register,
    logout,
    clearError,
  };
});