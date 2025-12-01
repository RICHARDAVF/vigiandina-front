import { api } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
export const attendanceService = {
    list: async (page, pageSize, query) => {
        try {
            const url = API_ENDPOINTS.ATTENDANCE.LIST + `?page=${page}&page_size=${pageSize}&query=${query || ''}`;
            const response = await api.get(url)
            return response
        } catch (error) {
            throw error
        }
    },
    create: async (data) => {
        try {
            const response = await api.post(API_ENDPOINTS.ATTENDANCE.CREATE, data)
            return response
        } catch (error) {
            throw error
        }
    },
    update: async (id, data) => {
        try {
            const response = await api.patch(API_ENDPOINTS.ATTENDANCE.UPDATE.replace("{pk}", id), data)
            return response
        } catch (error) {
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await api.delete(API_ENDPOINTS.ATTENDANCE.DELETE.replace("{pk}", id))
            return response
        } catch (error) {
            throw error
        }
    }
}