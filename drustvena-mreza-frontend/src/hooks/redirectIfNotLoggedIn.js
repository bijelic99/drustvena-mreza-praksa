import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const useRedirectIfNotLoggedIn = ()=>{
    const isLoggedIn = useSelector(state => state.isLoggedIn)
    const history = useHistory()

    useEffect(()=>{
        if(!isLoggedIn) history.push('/login')
    }, [isLoggedIn, history])
}

export default useRedirectIfNotLoggedIn