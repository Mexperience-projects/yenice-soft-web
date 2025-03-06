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
        const token = response.data["access"]
        const refresh = response.data["refresh"]
        // set response of server on state
        localStorage.setItem("token", token)
        localStorage.setItem("refresh", refresh)
        loadingHandler(false)
    };
    return { loading, login}
    }