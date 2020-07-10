import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { addAuthTokenInterceptor, removeAuthTokenInterceptor } from '../axios'

const useAddAxiosInterceptor = ()=>{
    const user = useSelector(state => state.user)
    
    useEffect(()=>{
        if(user.token){
            addAuthTokenInterceptor(user.token)
        }
        else removeAuthTokenInterceptor()
    }, [user.token])
}

export default useAddAxiosInterceptor