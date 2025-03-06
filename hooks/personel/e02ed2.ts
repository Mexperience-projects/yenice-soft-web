import { PersonelType } from '@/lib/types'
import { useState } from 'react'
import { axiosUser } from '@/lib/axios/noUser'




export type personel_e02ed2Type = Pick<PersonelType, "name"|"description">

export function usePersonel_e02ed2(){
        
    const [loading, loadingHandler] = useState(false);
    const [personel_list, personel_listHandler] = useState<personel_e02ed2Type[]>([]);
    const get_personel_list_list = async () =>  {
    
        loadingHandler(true)
        const response = await axiosUser.get("personel/e02ed2/")
        const serverData = response.data.personel
        // set response of server on state
        personel_listHandler(serverData)
        loadingHandler(false)
    };
    const create_personel_data = async (formData: any) =>  {
    
        loadingHandler(true)
        // create backend form
        const data = Object.fromEntries(formData);
        const response = await axiosUser.post("personel/e02ed2/", data)
        const serverData = response.data.personel
        // set response of server on state
        loadingHandler(false)
    };
    const update_personel_data = async (formData: any) =>  {
    
        loadingHandler(true)
        // create backend form
        const data = Object.fromEntries(formData);
        const response = await axiosUser.put("personel/e02ed2/", data)
        const serverData = response.data.personel
        // set response of server on state
        loadingHandler(false)
    };
    const delete_personel_data = async () =>  {
    
        loadingHandler(true)
        const response = await axiosUser.delete("personel/e02ed2/")
        const serverData = response.data.personel
        // set response of server on state
        loadingHandler(false)
    };
    
    
    
    
    
    
    
    
    
    
    return { loading, personel_list, get_personel_list_list, create_personel_data, update_personel_data, delete_personel_data }
    }