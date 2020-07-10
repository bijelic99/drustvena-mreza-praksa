import { axios } from '../../axios'

const addNewStatus = (userId, contents) => {
    const actionData = {
        type: 'ADD_NEW_STATUS',
        payload: {
            isSuccessful: false
        }
    }

    return axios.post('/statuses', { userId, contents }).then(({ data }) => {
        actionData.payload.post = data
        actionData.payload.isSuccessful = true
        return actionData
    })
        .catch(() => actionData)
}

const fetchUserFriendStatuses = (userId, token) => {
    const actionData = {
        type: 'FETCH_FRIEND_STATUSES',
        payload: {
            isSuccessful: false
        }
    }

    return axios.get(`/users/${userId}/friends/statuses`, {
        headers:{
            Authorization: token
        }
    }).then(({ data }) => {
        actionData.payload.isSuccessful = true
        actionData.payload.statuses = data
        return actionData
    }).catch(() => actionData)
}

const likeStatus = (userId, statusId) => {
    const actionData = {
        type: 'LIKE_STATUS',
        payload: {
            isSuccessful: false
        }
    }

    return axios.post(`/status-likes`, { statusId, userId }).then(({ data }) => {
        actionData.payload.isSuccessful = true
        actionData.payload.likedStatus = data
        return actionData
    })
        .catch(() => actionData)
}

const dislikeStatus = (userId, statusId) => {
    const actionData = {
        type: 'DISLIKE_STATUS',
        payload: {
            isSuccessful: false
        }
    }

    return axios.delete(`/status-likes/${statusId}/${userId}`).then(() => {
        actionData.payload.isSuccessful = true
        actionData.payload.dislikedStatus = { statusId, userId }
        return actionData
    })
}

const fetchStatusLikes = (userId, token) => {
    const actionData = {
        type: 'FETCH_STATUS_LIKES',
        payload: {
            isSuccessful: false
        }
    }

    return axios.get(`/users/${userId}/status-likes`, {
        headers:{
            Authorization: token
        }
    }).then(({ data }) => {
        actionData.payload.isSuccessful = true
        actionData.payload.statusLikes = data
        return actionData
    })
        .catch(() => actionData)
}

const fetchUsersStatuses = (userId) => {
    const actionData = {
        type: 'FETCH_USERS_STATUSES',
        payload: {
            isSuccessful: false
        }
    }

    return axios.get(`/users/${userId}/statuses`).then(({ data }) => {
        actionData.payload.isSuccessful = true
        actionData.payload.statuses = data
        return actionData
    }).catch(() => actionData)
}

const editStatus = (status) => {
    const actionData = {
        type: 'EDIT_STATUS',
        payload: {
            isSuccessful: false
        }
    }

    return axios.put(`/statuses`, status).then(() => {
        actionData.payload.isSuccessful = true
        actionData.payload.status = status
        return actionData
    })
        .catch(() => actionData)
}

const deleteStatus = (status) => {
    const actionData = {
        type: 'DELETE_STATUS',
        payload: {
            isSuccessful: false
        }
    }

    return axios.delete(`/statuses/${status.id}`).then(() => {
        actionData.payload.isSuccessful = true
        actionData.payload.status = status
        return actionData
    })
        .catch(() => actionData)
}

export {
    addNewStatus,
    fetchUserFriendStatuses,
    likeStatus,
    dislikeStatus,
    fetchStatusLikes,
    fetchUsersStatuses,
    editStatus,
    deleteStatus
}