import { axios } from '../../axios'

const login = async ({ credentials, rememberMe }) => {
    const login = {
        type: 'LOGIN',
        payload: {
            rememberMe
        }
    }
    return axios.post('/login', credentials).then(({ data }) => {
        login.payload.isSuccessful = true
        login.payload.user = data.user
        login.payload.token = data.token
        return login
    }).catch(() => {
        login.payload.isSuccessful = false
        return login
    })
}
const resetLoginStatus = () => ({ type: 'RESET_LOGIN_STATUS' })

const changePassword = (userId, { currentPassword, newPassword }) => {
    const changePasswordAction = {
        type: 'CHANGE_PASSWORD',
        payload: {
            isSuccessful: false
        }
    }
    return axios.put(`users/${userId}/change-password`, { currentPassword, newPassword }).then(({ data }) => {
        changePasswordAction.payload.isSuccessful = true
        return changePasswordAction
    }).catch(err => {
        return changePasswordAction
    })
}
const resetChangePassword = () => ({ type: 'RESET_CHANGE_PASSWORD' })

const logout = () => ({ type: 'LOGOUT' })

const fetchFriendList = async (userId) => {
    const fetchFriendListAction = {
        type: 'SET_USERS_FRIENDS',
        payload: {
            isSuccessful: false,
            friends: []
        }
    }
    return axios.get(`/users/${userId}/friendships`).then(({ data }) => {
        fetchFriendListAction.payload.friends = data
        fetchFriendListAction.payload.isSuccessful = true
        return fetchFriendListAction
    }).catch(err => fetchFriendListAction)
}

const sendFriendRequest = async (senderUserId, recipientUserId) => {
    const actionObj = {
        type: 'SEND_FRIEND_REQUEST',
        payload: {
            isSuccessful: false
        }
    }

    return axios.post(`/friend-requests`, { sender: senderUserId, recipient: recipientUserId })
        .then(({ data }) => {
            actionObj.payload.isSuccessful = true
            actionObj.payload.friendRequest = data
            return actionObj
        }).catch(() => actionObj)
}

const deleteFriendship = (firstUserId, secondUserId) => {
    const actionObj = {
        type: 'REMOVE_FRIEND',
        payload: {
            isSuccessful: false
        }
    }
    return axios.delete(`/friendships/${firstUserId}/${secondUserId}`).then(() => {
        actionObj.payload.isSuccessful = true
        actionObj.payload.firstUserId = firstUserId
        actionObj.payload.secondUserId = secondUserId
        return actionObj
    }).catch(() => actionObj)

}



export {
    login,
    resetLoginStatus,
    changePassword,
    resetChangePassword,
    logout,
    fetchFriendList,
    sendFriendRequest,
    deleteFriendship
    
}