const loginStatus = (state = null, action) => {
    switch(action.type) {
        case 'LOGIN':{
            return action.payload.isSuccessful
        }
        case 'RESET_LOGIN_STATUS':{
            return null
        }
        default: return state
    }
}

export default loginStatus