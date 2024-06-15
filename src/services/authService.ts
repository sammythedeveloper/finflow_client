import api from './api';
import type { AuthResponse, RegisterResponse } from '../types';

export const authService = {
  login(email: string, password: string) {
    return api.post<AuthResponse>('/auth/signin', { email, password });
  },

  register(username: string, email: string, password: string) {
    return api.post<RegisterResponse>('/auth/signup', { username, email, password });
  },
};
