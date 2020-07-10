import { axios } from '../../axios'


const fetchReceivedFriendRequests = (userId, token) => {
    const actionObj = {
        type: 'FETCH_RECEIVED_FRIEND_REQUESTS',
        payload: {
            isSuccessful: false
        }
    }
    return axios.get(`/users/${userId}/friend-requests`, {
        headers:{
            Authorization: token
        }
    }).then(({ data }) => {
        actionObj.payload.isSuccessful = true
        actionObj.payload.friendRequests = data
        return actionObj
    }).catch(() => actionObj)

}

const refuseFriendRequest = (friendRequest) => {
    const actionObj = {
        type: 'REFUSE_FRIEND_REQUEST',
        payload: {
            isSuccessful: false,
            friendRequest: friendRequest
        }
    }
    return axios.delete(`/friend-requests/${friendRequest.sender}/${friendRequest.recipient}`).then(()=>{
        actionObj.payload.isSuccessful = true
        return actionObj
    }).catch(()=>actionObj)
}

const acceptFriendRequest = (friendRequest) => {
    const actionObj = {
        type: 'ACCEPT_FRIEND_REQUEST',
        payload: {
            isSuccessful: false,
            friendRequest: friendRequest
        }
    }
    return axios.post(`/friend-requests/accept`, friendRequest).then(({data})=>{
        actionObj.payload.isSuccessful = true
        actionObj.payload.friendship = data
        return actionObj
    }).catch(()=>actionObj)
}

export { fetchReceivedFriendRequests, refuseFriendRequest, acceptFriendRequest }