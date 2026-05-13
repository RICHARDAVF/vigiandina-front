import { api } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";

export const workplaceService = {
    list: async (page, pageSize, query = "") => {
        try {
            const url = API_ENDPOINTS.WORKPLACES.LIST
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
            const response = await api.post(API_ENDPOINTS.WORKPLACES.CREATE, data);
            if (response?.id) {
                return { success: true, data: response, message: "Puesto creado correctamente" };
            }
            const errorMsg = response?.detail || response?.puesto?.[0] || response?.unidad?.[0] || "Error al crear puesto";
            return { success: false, error: errorMsg };
        } catch (error) {
            return { success: false, error: "Error al crear puesto" };
        }
    },
    update: async (id, data) => {
        try {
            const url = API_ENDPOINTS.WORKPLACES.UPDATE.replace("{pk}", id);
            const response = await api.patch(url, data);
            if (response?.id) {
                return { success: true, data: response, message: "Puesto actualizado correctamente" };
            }
            const errorMsg = response?.detail || "Error al actualizar puesto";
            return { success: false, error: errorMsg };
        } catch (error) {
            return { success: false, error: "Error al actualizar puesto" };
        }
    },
    delete: async (id) => {
        try {
            const url = API_ENDPOINTS.WORKPLACES.DELETE.replace("{pk}", id);
            await api.delete(url);
            return { success: true, message: "Puesto eliminado correctamente" };
        } catch (error) {
            return { success: false, error: "Error al eliminar puesto" };
        }
    },
};
