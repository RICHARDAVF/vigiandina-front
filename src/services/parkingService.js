import { api } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

export const parkingService = {
    list: async (page = 1, pageSize = 15, query = '') => {
        try {
            const url = API_ENDPOINTS.PARKING.LIST
                .replace("{page}", page)
                .replace("{page_size}", pageSize)
                .replace("{query}", query);
            return await api.get(url);
        } catch (error) {
            throw error;
        }
    },
    list_available: async () => {
        try {
            return await api.get(API_ENDPOINTS.PARKING.LIST_AVAILABLE);
        } catch (error) {
            throw error;
        }
    },
    create: async (data) => {
        try {
            const response = await api.post(API_ENDPOINTS.PARKING.CREATE, data);
            if (response?.id) {
                return { success: true, data: response, message: "Parqueo creado correctamente" };
            }
            const errorMsg = response?.detail || response?.numero?.[0] || "Error al crear parqueo";
            return { success: false, error: errorMsg };
        } catch (error) {
            return { success: false, error: "Error al crear parqueo" };
        }
    },
    update: async (id, data) => {
        try {
            const url = API_ENDPOINTS.PARKING.UPDATE.replace("{pk}", id);
            const response = await api.patch(url, data);
            if (response?.id) {
                return { success: true, data: response, message: "Parqueo actualizado correctamente" };
            }
            const errorMsg = response?.detail || "Error al actualizar parqueo";
            return { success: false, error: errorMsg };
        } catch (error) {
            return { success: false, error: "Error al actualizar parqueo" };
        }
    },
    delete: async (id) => {
        try {
            const url = API_ENDPOINTS.PARKING.DELETE.replace("{pk}", id);
            await api.delete(url);
            return { success: true, message: "Parqueo eliminado correctamente" };
        } catch (error) {
            return { success: false, error: "Error al eliminar parqueo" };
        }
    },
};
