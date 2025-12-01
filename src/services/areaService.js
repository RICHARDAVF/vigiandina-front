import { API_ENDPOINTS } from "@/utils/constants";
import { api } from "./api";
export const areaService = {
    list: async (page, pageSize, query) => {
        try {
            const response = await api.get(API_ENDPOINTS.AREAS.LIST.replace("{page}", page).replace("{page_size}", pageSize).replace("{query}", query))
            return response
        } catch (error) {
            throw error
        }
    },
    create: async (data) => {
        try {
            const response = await api.post(API_ENDPOINTS.AREAS.CREATE, data);
            return { success: true, data: response.data, message: "Área creada correctamente" };
        } catch (error) {
            return { success: false, error: error.response?.data?.detail || "Error al crear área" };
        }
    },
    update: async (id, data) => {
        try {
            const url = API_ENDPOINTS.AREAS.UPDATE.replace("{pk}", id);
            const response = await api.patch(url, data);
            return { success: true, data: response.data, message: "Área actualizada correctamente" };
        } catch (error) {
            return { success: false, error: error.response?.data?.detail || "Error al actualizar área" };
        }
    },
    delete: async (id) => {
        try {
            const url = API_ENDPOINTS.AREAS.DELETE.replace("{pk}", id);
            await api.delete(url);
            return { success: true, message: "Área eliminada correctamente" };
        } catch (error) {
            return { success: false, error: error.response?.data?.detail || "Error al eliminar área" };
        }
    }
}