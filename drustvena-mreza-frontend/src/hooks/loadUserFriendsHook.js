import { useState, useEffect } from 'react'
import { axios } from '../axios'
import { fetchFriendList } from '../state/actions'
import { useDispatch, useSelector } from 'react-redux'

const useLoadUsersFriends = (userId) => {

    const [friendList, setFriendList] = useState([])
    const friendships = useSelector(state=>state.friendships)
    const dispatch = useDispatch()


    useEffect(()=>{
        axios.get(`/users/${userId}/friendships/as-users`)
        .then(({data})=>setFriendList(data))
        .catch(()=>setFriendList([]))

    }, [userId, dispatch, friendships.length])

    useEffect(()=>{
        (async ()=> dispatch(await fetchFriendList(userId)))()
    }, [userId, dispatch])

    return friendList
}

export default useLoadUsersFriends