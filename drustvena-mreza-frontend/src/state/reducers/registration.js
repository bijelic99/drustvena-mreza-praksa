const registrationStatus = (state = null, action) => {
    switch(action.type) {
        case 'REGISTRATION':{
            return action.payload.isSuccess
        }
        case 'REGISTRATION_STATUS_RESET' :{
            return null
        }
        default: return state
    }
}

export default registrationStatus