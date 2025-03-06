import { useState } from 'react'
import { axiosUser } from '@/lib/axios/noUser'





export function useLogin(username:string, password:string){
        
    const [loading, loadingHandler] = useState(false);
    const login = async () =>  {
    
        loadingHandler(true)
        const response = await axiosUser.post("/user/login",
        {username,
        password}
        )
        const serverData = response.data.items
        // set response of server on state
        items_listHandler(serverData)
        loadingHandler(false)
    };
    const create_items_data = async (formData: any) =>  {
    
        loadingHandler(true)
        // create backend form
        const data = Object.fromEntries(formData);
        const response = await axiosUser.post("items/691d50/", data)
        const serverData = response.data.items
        // set response of server on state
        loadingHandler(false)
    };
    const update_items_data = async (formData: any) =>  {
    
        loadingHandler(true)
        // create backend form
        const data = Object.fromEntries(formData);
        const response = await axiosUser.put("items/691d50/", data)
        const serverData = response.data.items
        // set response of server on state
        loadingHandler(false)
    };
    const delete_items_data = async () =>  {
    
        loadingHandler(true)
        const response = await axiosUser.delete("items/691d50/")
        const serverData = response.data.items
        // set response of server on state
        loadingHandler(false)
    };
    
    
    
    
    
    
    
    
    
    
    return { loading, items_list, login, create_items_data, update_items_data, delete_items_data }
    }