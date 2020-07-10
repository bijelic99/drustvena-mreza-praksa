const statusLikes = (state = [], action) => {
    switch (action.type) {
        case 'LIKE_STATUS': {
            if (action.payload.isSuccessful) {
                state = [...state, action.payload.likedStatus]
            }
            return state
        }
        case 'DISLIKE_STATUS': {
            if (action.payload.isSuccessful) {
                const dislikedStatus = action.payload.dislikedStatus
                state = state
                    .filter(statusLike =>
                        statusLike.statusId !== dislikedStatus.statusId
                    )
            }
            return state
        }
        case 'FETCH_STATUS_LIKES': {
            if (action.payload.isSuccessful) {
                state = action.payload.statusLikes
            }
            return state
        }
        case 'LOGOUT':{
            return []
        }
        default: return state
    }
}

export default statusLikes