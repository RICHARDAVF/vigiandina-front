import { api } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
export const companyService = {
    get:async()=>{
        try{
            const response = await api.get(API_ENDPOINTS.COMPANIES.LIST)
            return response
            
        }catch(error){
            throw error
        }
    },}