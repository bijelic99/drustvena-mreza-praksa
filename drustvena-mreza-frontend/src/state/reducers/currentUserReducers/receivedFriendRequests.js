const receivedFriendRequests = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_RECEIVED_FRIEND_REQUESTS': {
            if (action.payload.isSuccessful) state = action.payload.friendRequests
            return state
        }
        case 'REFUSE_FRIEND_REQUEST':
        case 'ACCEPT_FRIEND_REQUEST': {
            if (action.payload.isSuccessful) return state
                .filter(fr =>
                    fr.sender !== action.payload.friendRequest.sender)
            return state
        }
        case 'LOGOUT': {
            return []
        }
        default: return state
    }
}

export default receivedFriendRequests