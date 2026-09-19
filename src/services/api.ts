import axios from "axios";
import { useAuthStore } from "../stores/auth";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Supabase access token
api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore();
    const token = auth.token;

    console.log("API REQUEST:", config.url);
    console.log("TOKEN EXISTS:", !!token);
    console.log("TOKEN LENGTH:", token?.length);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// TEMPORARY: don't logout on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("API 401:", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
