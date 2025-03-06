import { VisitType } from '@/lib/types'
import { useState } from 'react'
import { axiosUser } from '@/lib/axios/noUser'




export type visit_ae978bType = Pick<VisitType, "client"|"service"|"datetime">

export function useVisit_ae978b(){
        
    const [loading, loadingHandler] = useState(false);
    const [visit_list, visit_listHandler] = useState<visit_ae978bType[]>([]);
    const get_visit_list_list = async () =>  {
    
        loadingHandler(true)
        const response = await axiosUser.get("visit/ae978b/")
        const serverData = response.data.visit
        // set response of server on state
        visit_listHandler(serverData)
        loadingHandler(false)
    };
    const create_visit_data = async (formData: any) =>  {
    
        loadingHandler(true)
        // create backend form
        const data = Object.fromEntries(formData);
        const response = await axiosUser.post("visit/ae978b/", data)
        const serverData = response.data.visit
        // set response of server on state
        loadingHandler(false)
    };
    
    
    
    
    
    
    return { loading, visit_list, get_visit_list_list, create_visit_data }
    }