import {  useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchReceivedFriendRequests } from '../state/actions'

const useFetchFriendRequests = (userId) => {
    const friendRequests = useSelector(state => state.receivedFriendRequests)
    const dispatch = useDispatch()
    const token = useSelector(state=>state.user.token)

    useEffect(  ()=>{
        const fetchUsers = async ()=>{
            dispatch(await fetchReceivedFriendRequests(userId, token))
        } 
        fetchUsers()
    }, [userId, dispatch, token])

    return friendRequests
}

export default useFetchFriendRequests