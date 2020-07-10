import React, { useState } from 'react';
import { Box, Avatar, IconButton, Menu, MenuItem, Typography, makeStyles, Button, Hidden } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../state/actions'
import FriendRequest from '../FriendRequest/FriendRequest'
import useFetchFriendRequests from '../../hooks/fetchFriendRequestsHook'

const useStyles = makeStyles((theme) => ({
    avatarColor: {
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
    },
    whiteText: {
        color: theme.palette.primary.contrastText,
    },
})
)

const CurrentUserNavbarItem = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isLoggedIn = useSelector(state => state.isLoggedIn)
    const user = useSelector(state => state.user)
    const styles = useStyles()
    const [menuOpen, setMenuOpen] = React.useState(false)
    const dispatch = useDispatch()
    const recivedFriendRequests = useFetchFriendRequests(user.id)
    const [friendRequestsAnchorEl, setFriendRequestsAnchorEl] = useState(null)
    const [friendRequestsMenuOpen, setFriendRequestsMenuOpen] = useState(false)
    const history = useHistory()

    const handleClick = (e) => {
        setAnchorEl(e.target)
        setMenuOpen(true)
    };

    const handleClose = () => {
        setMenuOpen(false)
    };

    const handleLogout = () => {
        dispatch(logout())
        history.push("/login")
    }

    const showFriendRequests = () => {
        setFriendRequestsMenuOpen(true)
    }
    const hideFriendRequests = () => {
        setFriendRequestsMenuOpen(false)
    }

    return isLoggedIn ? (

        <Box width={1} display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
            <Button aria-controls="friend-requests-menu"
                aria-haspopup="true" onClick={showFriendRequests}
                ref={r => setFriendRequestsAnchorEl(r)}
            >
                <Typography className={styles.whiteText}>{recivedFriendRequests.length}</Typography>
            </Button>
            <Menu
                id="friend-requests-menu"
                anchorEl={friendRequestsAnchorEl}
                keepMounted
                open={friendRequestsMenuOpen}
                onClose={hideFriendRequests}>
                {
                    recivedFriendRequests.length === 0 ?
                        <Box px={2} component={Typography}>No friend requests</Box>
                        :
                        recivedFriendRequests
                            .map(fr =>
                                <MenuItem key={fr.sender} component={FriendRequest} friendRequest={fr} />
                            )}


            </Menu>
            <Avatar alt="User"
                src={`${process.env.REACT_APP_SERVER_ADDRESS}/api/users/${user.id}/photo`}
                className={styles.avatarColor}
                onClick={handleClick}

            >
                {user.username[0].toUpperCase()}
            </Avatar>
            <Hidden smDown>
                <Box component={"span"} ml={1} onClick={handleClick}>
                    {user.firstName && user.lastName ?
                        <Typography >{`${user.firstName} ${user.lastName}`}</Typography>
                        :
                        <Typography >{user.username}</Typography>}
                </Box>

                <IconButton
                    aria-label="profile menu"
                    aria-controls="profile-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    className={styles.whiteText}
                >
                    <MoreVertIcon />

                </IconButton>
            </Hidden>
            <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                keepMounted
                open={menuOpen}
                onClose={handleClose}>
                <MenuItem component={Link} onClick={handleClose} key="profile" to="/profile">
                    Profile
                            </MenuItem>
                <MenuItem key="logout" onClick={handleLogout}>
                    Logout
                    </MenuItem>
            </Menu>
        </Box>
    ) : ''
}

export default CurrentUserNavbarItem