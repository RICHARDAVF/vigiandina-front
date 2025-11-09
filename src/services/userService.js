import { API_ENDPOINTS } from "@/utils/constants";
import { api } from "./api";
export const userService = {
    list:async()=>{
        try{
            const response = await api.get(API_ENDPOINTS.USERS.LIST)
            return response
        }catch(error){
            throw error
        }
    }
}