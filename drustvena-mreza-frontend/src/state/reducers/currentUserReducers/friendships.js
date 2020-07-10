const friendships = (state = [], action) => {
    switch (action.type) {
        case 'REMOVE_FRIEND': {
            return state.filter(fsp =>
                !(
                    (fsp.firstUser === action.payload.firstUserId && fsp.secondUser === action.payload.secondUserId)
                    ||
                    (fsp.firstUser === action.payload.secondUserId && fsp.secondUser === action.payload.firstUserId)
                )
            )
        }
        case 'ACCEPT_FRIEND_REQUEST': {
            if (action.payload.isSuccessful) state.push(action.payload.friendship)
            return state
        }
        case 'SET_USERS_FRIENDS': {
            if (action.payload.isSuccessful) return action.payload.friends
            else return state
        }
        case 'LOGOUT': {
            return []
        }
        default: return state
    }
}

export default friendships