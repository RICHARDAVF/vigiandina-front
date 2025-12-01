import { API_ENDPOINTS } from '@/utils/constants';
import { api } from './api';

export const unityService = {
    list: async (page = 1, pageSize = 10, query = '') => {
        try {
            const response = await api.get(API_ENDPOINTS.UNITYS.LIST.replace("{page}",page).replace("page_size",pageSize).replace("{query}",query));
            return response
        } catch (error) {
            throw error
        }
    },
    // Puedes añadir más métodos como create, retrieve, update, delete aquí
};
