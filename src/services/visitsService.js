import { api } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";

export const visitsService = {
    list: async (page, pageSize, query) => {
        try {
            const url = API_ENDPOINTS.VISITS.LIST.replace("{page}", page).replace("{page_size}", pageSize).replace("{query}", query)
            const response = await api.get(url)
            return response
        } catch (error) {
            throw error
        }
    },
    create: async (data) => {
        try {
            const response = await api.post(API_ENDPOINTS.VISITS.CREATE, data)
            return response

        } catch (error) {
            throw error
        }
    },
    createMasive: async (data) => {
        try {
            const response = await api.post(API_ENDPOINTS.VISITS.CREATE_MASIVE, data)
            return response

        } catch (error) {
            throw error
        }
    },
    patch: async (data, id) => {
        try {
            const response = await api.patch(API_ENDPOINTS.VISITS.PATCH.replace("{pk}", id), data)
            return response
        } catch (error) {
            throw error
        }
    },
    get_update: async (id) => {
        try {
            // Reuse the PATCH endpoint with GET to retrieve a single visit
            const response = await api.get(API_ENDPOINTS.VISITS.PATCH.replace("{pk}", id))
            return response
        } catch (error) {
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await api.delete(API_ENDPOINTS.VISITS.DELETE.replace("{pk}", id))
            return response
        } catch (error) {
            throw error
        }
    },
    search: async (query) => {
        try {
            const response = await api.get(API_ENDPOINTS.VISITS.SEARCH.replace("{query}", query))
            return response
        } catch (error) {
            throw error
        }
    }
}