import { api } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

export const unityService = {
    list: async (page = 1, pageSize = 10, query = '') => {
        try {
            const url = API_ENDPOINTS.UNITYS.LIST
                .replace("{page}", page)
                .replace("{page_size}", pageSize)
                .replace("{query}", query);
            return await api.get(url);
        } catch (error) {
            throw error;
        }
    },
    create: async (data) => {
        try {
            const response = await api.post(API_ENDPOINTS.UNITYS.CREATE, data);
            if (response?.id) {
                return { success: true, data: response, message: "Unidad creada correctamente" };
            }
            const errorMsg = response?.detail || response?.unidad?.[0] || "Error al crear unidad";
            return { success: false, error: errorMsg };
        } catch (error) {
            return { success: false, error: "Error al crear unidad" };
        }
    },
    update: async (id, data) => {
        try {
            const url = API_ENDPOINTS.UNITYS.UPDATE.replace("{pk}", id);
            const response = await api.patch(url, data);
            if (response?.id) {
                return { success: true, data: response, message: "Unidad actualizada correctamente" };
            }
            const errorMsg = response?.detail || "Error al actualizar unidad";
            return { success: false, error: errorMsg };
        } catch (error) {
            return { success: false, error: "Error al actualizar unidad" };
        }
    },
    delete: async (id) => {
        try {
            const url = API_ENDPOINTS.UNITYS.DELETE.replace("{pk}", id);
            await api.delete(url);
            return { success: true, message: "Unidad eliminada correctamente" };
        } catch (error) {
            return { success: false, error: "Error al eliminar unidad" };
        }
    },
};
