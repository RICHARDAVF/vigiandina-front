import { API_ENDPOINTS } from '@/utils/constants';
import { api } from './api';

export const parkingService = {
    list: async (page = 1, pageSize = 10, query = '') => {
        try {
            const response = await api.get(API_ENDPOINTS.PARKING.LIST.replace("{page}",page).replace("{page_size}",pageSize).replace("{query}",query));
            return response
        } catch (error) {
            throw error
        }
    },
    list_available:async()=>{
        try {
            const response = await api.get(API_ENDPOINTS.PARKING.LIST_AVAILABLE);
            return response
        } catch (error) {
            throw error
        }
    }
};
