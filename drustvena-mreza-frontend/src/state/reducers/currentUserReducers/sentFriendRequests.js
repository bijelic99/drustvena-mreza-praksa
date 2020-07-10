const sentFriendRequests = (state = [], action) => {
    switch(action.type) {
        case 'SEND_FRIEND_REQUEST':{
            if(action.payload.isSuccessful) state.push(action.payload.friendRequest)
            return state
        }
        case 'LOGOUT':{
            return []
        }
        default: return state
    }
}

export default sentFriendRequests