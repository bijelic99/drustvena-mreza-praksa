import { useState, useEffect } from 'react'
import { axios } from '../axios'

const useUser = (userId) => {
    const [user, setUser] = useState(null)
    useEffect(()=>{
        axios.get(`/users/${userId}`).then(({ data }) => setUser(data)).catch(err => {
            console.log(err)
            setUser(null)
        })
    }, [userId])
    

    return user
}

export default useUser