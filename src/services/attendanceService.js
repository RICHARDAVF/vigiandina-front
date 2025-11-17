import { api } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
export const attendanceService = {
    create:async(data)=>{
        try{
            const response = await api.post(API_ENDPOINTS.ATTENDANCE.CREATE,data)
            return response
            
        }catch(error){
            throw error
        }
    },
    patch:async(data,id)=>{
        try{
            const response = await api.patch(API_ENDPOINTS.ATTENDANCE.PATCH.replace("{pk}",id),data)
            return response
        }catch(error){
            throw error
        }
    },
    get_update:async(id)=>{
        try{
            const response = await api.get(API_ENDPOINTS.ATTENDANCE.PATCH.replace("{pk}",id))
            return response
        }catch(error){
            throw error
        }
    }
}