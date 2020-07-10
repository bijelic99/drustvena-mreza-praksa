const usersStatuses = (state = [], action) => {
    switch (action.type) {
        case 'ADD_NEW_STATUS': {
            if (action.payload.isSuccessful) {
                state.push(action.payload.post)
            }
            return state
        }
        case 'FETCH_USERS_STATUSES': {
            if (action.payload.isSuccessful) {
                return action.payload.statuses
            }
            return state
        }
        case 'EDIT_STATUS': {
            if (action.payload.isSuccessful) {
                return [...state.filter(status => status.id !== action.payload.status.id), action.payload.status]
            }
            else return state
        }
        case 'DELETE_STATUS': {
            if (action.payload.isSuccessful) {
                return state.filter(status => status.id !== action.payload.status.id)
            }
            else return state
        }
        case 'LOGOUT': {
            return []
        }
        default: return state
    }
}

export default usersStatuses