import { API_ENDPOINTS } from "@/utils/constants";
import { api } from "./api";
export const userService = {
    list: async () => {
        try {
            const response = await api.get(API_ENDPOINTS.USERS.LIST)
            return response
        } catch (error) {
            throw error
        }
    },
    update: async (id, data) => {
        try {
            const response = await api.patch(API_ENDPOINTS.USERS.UPDATE.replace("{pk}", id), data)
            return response
        } catch (error) {
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await api.delete(API_ENDPOINTS.USERS.DELETE.replace("{pk}", id))
            return response
        } catch (error) {
            throw error
        }
    }
}