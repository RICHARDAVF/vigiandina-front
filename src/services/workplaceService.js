import { api } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
export const workplaceService = {
    list:async(page,pageSize,query)=>{
        try{
            const url = API_ENDPOINTS.WORKPLACES.LIST.replace("{page}",page).replace("{page_size}",pageSize).replace("{query}",query)
            const response = await api.get(url)
            return response
        }catch(error){
            throw error
        }
    },
    create:async(data)=>{
        try{
            const response = await api.post(API_ENDPOINTS.WORKPLACES.CREATE,data)
            return response
            
        }catch(error){
            throw error
        }
    },
    createMasive:async(data)=>{
        try{
            const response = await api.post(API_ENDPOINTS.WORKPLACES.CREATE_MASIVE,data)
            return response
            
        }catch(error){
            throw error
        }
    },
    patch:async(data,id)=>{
        try{
            const response = await api.patch(API_ENDPOINTS.WORKPLACES.PATCH.replace("{pk}",id),data)
            return response
        }catch(error){
            throw error
        }
    },
    search:async(query)=>{
        try{
            const response = await api.get(API_ENDPOINTS.WORKPLACES.SEARCH.replace("{query}",query))
            return response
        }catch(error){
            throw error
        }
    },
}