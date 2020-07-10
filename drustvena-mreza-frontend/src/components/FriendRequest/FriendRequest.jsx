import React from 'react'
import { Box, ButtonGroup, IconButton, Link } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Check'
import ClearIcon from '@material-ui/icons/Clear'
import { Link as RouterLink } from 'react-router-dom'
import useLoadUser from  '../../hooks/loadUserHook'
import { useDispatch } from 'react-redux'
import { refuseFriendRequest as refuseFriendRequestAction, acceptFriendRequest as acceptFriendRequestAction } from '../../state/actions'

const FriendRequest = ({ friendRequest }) => {
    const user = useLoadUser(friendRequest.sender)
    const dispatch = useDispatch()

    const refuseFriendRequest = async (e) => {
        e.stopPropagation()
        dispatch(await refuseFriendRequestAction(friendRequest))
    }

    const acceptFriendRequest = async (e) => {
        e.stopPropagation()
        dispatch(await acceptFriendRequestAction(friendRequest))
    }

    return user ? (
        <Box pl={2} display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
            <Box pr={2}>
                <Link component={RouterLink} to={`/users/${user.id}`}>
                    {user.username}
                </Link>
            </Box>
            <ButtonGroup>
                <IconButton color="primary" onClick={acceptFriendRequest}>
                    <AddIcon />
                </IconButton>
                <IconButton color="primary" onClick={refuseFriendRequest}>
                    <ClearIcon />
                </IconButton>
            </ButtonGroup>
        </Box>
    ) : ''
}

export default FriendRequest