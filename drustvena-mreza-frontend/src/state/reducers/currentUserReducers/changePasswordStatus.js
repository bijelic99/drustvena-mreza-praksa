const changePasswordStatus = (state = null, action) => {
    switch(action.type) {
        case 'CHANGE_PASSWORD':{
            
            return action.payload.isSuccessful 
        }
        case 'RESET_CHANGE_PASSWORD':{
            return null
        }
        default: return state
    }
}

export default changePasswordStatus