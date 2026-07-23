import { API_ENDPOINTS } from "@/utils/constants";
import { api } from "./api";

export const userConfigService = {
  // --- Empresas por usuario ---
  listUserEmpresas: async () => {
    const response = await api.get(API_ENDPOINTS.USER_CONFIG.USER_EMPRESAS_LIST);
    return response;
  },
  createUserEmpresa: async (data) => {
    const response = await api.post(API_ENDPOINTS.USER_CONFIG.USER_EMPRESAS_CREATE, data);
    return response;
  },
  deleteUserEmpresa: async (id) => {
    const response = await api.delete(
      API_ENDPOINTS.USER_CONFIG.USER_EMPRESAS_DELETE.replace("{pk}", id)
    );
    return response;
  },

  // --- Supervisores ---
  listUserSupervisor: async () => {
    const response = await api.get(API_ENDPOINTS.USER_CONFIG.USER_SUPERVISOR_LIST);
    return response;
  },
  createUserSupervisor: async (data) => {
    const response = await api.post(API_ENDPOINTS.USER_CONFIG.USER_SUPERVISOR_CREATE, data);
    return response;
  },
  deleteUserSupervisor: async (id) => {
    const response = await api.delete(
      API_ENDPOINTS.USER_CONFIG.USER_SUPERVISOR_DELETE.replace("{pk}", id)
    );
    return response;
  },
  getSupervisedUsers: async () => {
    const response = await api.get(API_ENDPOINTS.USER_CONFIG.USER_SUPERVISED_LIST);
    return response;
  },
};
