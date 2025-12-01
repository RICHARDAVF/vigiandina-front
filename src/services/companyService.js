import { api } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
export const companyService = {
    get: async () => {
        try {
            const response = await api.get(API_ENDPOINTS.COMPANIES.LIST)
            return response

        } catch (error) {
            throw error
        }
    },
    update: async (id, data) => {
        try {
            const response = await api.patch(API_ENDPOINTS.COMPANIES.UPDATE.replace("{pk}", id), data)
            return response
        } catch (error) {
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await api.delete(API_ENDPOINTS.COMPANIES.DELETE.replace("{pk}", id))
            return response
        } catch (error) {
            throw error
        }
    }
}