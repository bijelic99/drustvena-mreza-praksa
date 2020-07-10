const user = (state = {token: ""}, action) => {
    switch (action.type) {
        case 'LOGIN': {
            if (action.payload.isSuccessful && action.payload.user) {
                state = {
                    ...action.payload.user,
                    rememberMe: action.payload.rememberMe,
                    token: action.payload.token
                }


            }
            return state
        }
        case 'LOGOUT': {
            return {user: null, rememberMe: false, token: null}
        }
        case 'SET_USERS_FRIENDS': {
            state.friends = action.payload.friends
            return state
        }
        case 'REMOVE_FRIEND': {
            if (state.friends) {
                if (action.payload.isSuccessful)
                    state.friends = state.friends.filter(fsp =>
                        !(
                            (fsp.firstUser === action.payload.firstUserId && fsp.secondUser === action.payload.secondUserId)
                            ||
                            (fsp.firstUser === action.payload.secondUserId && fsp.secondUser === action.payload.firstUserId)
                        )
                    )
            }
            else state.friends = []

            return state
        }
        default: return state
    }
}

export default user