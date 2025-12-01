import { api } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
export const collaboratorService = {

    get: async (page, pageSize, query) => {
        try {
            const url = API_ENDPOINTS.COLLABORATORS.LIST + `?page=${page}&page_size=${pageSize}&query=${query || ''}`
            const response = await api.get(url)
            return response

        } catch (error) {
            throw error
        }
    },
    getById: async (id) => {
        try {
            const url = API_ENDPOINTS.COLLABORATORS.GET.replace("{pk}", id);
            const response = await api.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },
    search: async (query) => {
        try {
            const response = await api.get(API_ENDPOINTS.COLLABORATORS.SEARCH.replace("{query}", query))
            return response
        } catch (error) {
            throw error
        }
    },
    update: async (id, data) => {
        try {
            const response = await api.patch(API_ENDPOINTS.COLLABORATORS.UPDATE.replace("{pk}", id), data)
            return response
        } catch (error) {
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await api.delete(API_ENDPOINTS.COLLABORATORS.DELETE.replace("{pk}", id))
            return response
        } catch (error) {
            throw error
        }
    }
}