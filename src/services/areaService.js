import { API_ENDPOINTS } from "@/utils/constants";
import { api } from "./api";
export const areaService = {
    list:async(page,pageSize,query)=>{
        try{
            const response = await api.get(API_ENDPOINTS.AREAS.LIST.replace("{page}",page).replace("{page_size}",pageSize).replace("{query}",query))
            return response
        }catch(error){
            throw error
        }
    }
}