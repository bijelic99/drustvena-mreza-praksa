const usersFriendsStatuses = (state = [], action) => {
    switch(action.type) {
        case 'FETCH_FRIEND_STATUSES':{
            if(action.payload.isSuccessful){
                state = action.payload.statuses
            }
            return state
        }
        case 'LOGOUT':{
            return []
        }
        default: return state
    }
}


export default usersFriendsStatuses