import { api } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
export const collaboratorService = {
    get:async()=>{
        try{
            const response = await api.get(API_ENDPOINTS.COLLABORATORS.LIST)
            return response
            
        }catch(error){
            throw error
        }
    },}