import { combineReducers } from 'redux'
import registrationStatus from './registration'
import user from './currentUserReducers/user'
import isLoggedIn from './currentUserReducers/isLoggedIn'
import loginStatus from './currentUserReducers/loginStatus'
import changePasswordStatus from './currentUserReducers/changePasswordStatus'
import sentFriendRequests from './currentUserReducers/sentFriendRequests'
import friendships from './currentUserReducers/friendships'
import receivedFriendRequests from './currentUserReducers/receivedFriendRequests'
import usersStatuses from './statusReducers/usersStatuses'
import usersFriendsStatuses from './statusReducers/usersFriendsStatuses'
import statusLikes from './statusReducers/statusLikes'

const reducers = combineReducers({
    registrationStatus,
    user,
    isLoggedIn,
    loginStatus,
    changePasswordStatus,
    sentFriendRequests,
    friendships,
    receivedFriendRequests,
    usersStatuses, 
    usersFriendsStatuses,
    statusLikes 
})

export default reducers