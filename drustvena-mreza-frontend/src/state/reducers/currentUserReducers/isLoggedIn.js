const isLoggedIn = (state = false, action) => {
    switch(action.type) {
        case 'LOGIN':{
            if(action.payload.isSuccessful && action.payload.user){
                state = true
            }
            return state 
        }
        case 'LOGOUT':{
            return false
        }
        default: return state
    }
}

export default isLoggedIn