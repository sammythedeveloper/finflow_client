import { supabase } from "../lib/supabase";

const API_URL = import.meta.env.VITE_API_URL;

async function syncLocalUser(accessToken: string) {
  const response = await fetch(`${API_URL}/api/Auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to sync user with backend: ${response.status} ${errorText}`
    );
  }

  return response.json();
}

export const authService = {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Sync Supabase user with the local Users table
    if (data.session?.access_token) {
      await syncLocalUser(data.session.access_token);
    }

    return data;
  },

  async register(username: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) throw error;

    // Sync local user when Supabase returns a session 
    if (data.session?.access_token) {
      await syncLocalUser(data.session.access_token);
    }

    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};
