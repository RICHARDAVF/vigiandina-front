import axios from 'axios';
import { api } from './api';
import { storage } from './storage';
import { API_ENDPOINTS } from '@/utils/constants';

export const authService = {
  login: async (credentials) => {
    try {
      const request = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${API_ENDPOINTS.AUTH.LOGIN}`,credentials)
      const response = request.data
      if(response.success){
        storage.setToken(response.tokens.access)
        storage.setRefreshToken(response.tokens.refresh)
        storage.setUser(response.user)
        return {success:true,user:response.user}
      }
      throw new Error("Error en el login")
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      // Opcional: llamar al endpoint de logout en el backend
      // await api.post(API_ENDPOINTS.LOGOUT);
      
      storage.clearAll();
      return { success: true };
    } catch (error) {
      // Limpiar storage incluso si falla la llamada al backend
      storage.clearAll();
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = storage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post(API_ENDPOINTS.REFRESH, { refreshToken });
      
      if (response.success) {
        const { token } = response.data;
        storage.setToken(token);
        return { success: true, token };
      }

      throw new Error('Error refreshing token');
    } catch (error) {
      storage.clearAll();
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      // Intenta obtener el usuario del storage primero
      const storedUser = storage.getUser();
      if (storedUser) {
        return storedUser;
      }

      // Si no está en storage, consulta al backend
      // const response = await api.get(API_ENDPOINTS.ME);
      // return response.data.user;
      
      return null;
    } catch (error) {
      throw error;
    }
  },

  checkAuth: () => {
    const token = storage.getToken();
    const user = storage.getUser();
    return !!(token && user);
  },
};