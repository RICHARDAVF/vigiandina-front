import axiosInstance from '@/lib/axios';

export const api = {
  get: async (url, config = {}) => {
    try {
      const response = await axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      return error.response;
    }
  },

  post: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      return error.response?.data;
    }
  },

  put: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      return error.response?.data;
    }
  },

  delete: async (url, config = {}) => {
    try {
      const response = await axiosInstance.delete(url, config);
      return response.data;
    } catch (error) {
      return error.response?.data;
    }
  },

  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await axiosInstance.patch(url, data, config);
      return response.data;
    } catch (error) {
      return error.response?.data;
    }
  },
};