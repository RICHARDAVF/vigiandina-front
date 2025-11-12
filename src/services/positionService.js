import { api } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
export const positionService = {
    get:async()=>{
        try{
            const response = await api.get(API_ENDPOINTS.POSITIONS.LIST)
            return response
            
        }catch(error){
            throw error
        }
    },}