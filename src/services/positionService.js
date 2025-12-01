import { api } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";

export const positionService = {
    get: async (page = 1, pageSize = 15) => {
        try {
            const response = await api.get(`${API_ENDPOINTS.POSITIONS.LIST}?page=${page}&page_size=${pageSize}`)
            return response
        } catch (error) {
            throw error
        }
    },
    create: async (data) => {
        try {
            const response = await api.post(API_ENDPOINTS.POSITIONS.CREATE, data);
            return { success: true, data: response.data, message: "Cargo creado correctamente" };
        } catch (error) {
            return { success: false, error: error.response?.data?.detail || "Error al crear cargo" };
        }
    },
    update: async (id, data) => {
        try {
            const url = API_ENDPOINTS.POSITIONS.UPDATE.replace("{pk}", id);
            const response = await api.patch(url, data);
            return { success: true, data: response.data, message: "Cargo actualizado correctamente" };
        } catch (error) {
            return { success: false, error: error.response?.data?.detail || "Error al actualizar cargo" };
        }
    },
    delete: async (id) => {
        try {
            const url = API_ENDPOINTS.POSITIONS.DELETE.replace("{pk}", id);
            await api.delete(url);
            return { success: true, message: "Cargo eliminado correctamente" };
        } catch (error) {
            return { success: false, error: error.response?.data?.detail || "Error al eliminar cargo" };
        }
    }
};