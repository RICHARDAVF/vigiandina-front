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
    },
    search:async(query)=>{
        try{
            const response = await api.get(API_ENDPOINTS.COLLABORATORS.SEARCH.replace("{query}",query))
            return response
        }catch(error){
            throw error
        }
    }
}