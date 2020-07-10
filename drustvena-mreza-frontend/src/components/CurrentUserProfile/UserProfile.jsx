import React, { useState, useEffect } from 'react';
import { Snackbar, Grid, Typography, List, ListItem, Paper, Box, IconButton, Collapse, CardContent, Button, TextField, Avatar, makeStyles } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert'
import './user-profile.css'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import EditIcon from '@material-ui/icons/Edit'
import PersonList from '../PersonList/PersonList';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword as changePasswordAction, resetChangePassword, fetchUsersStatuses } from '../../state/actions'
import useLoadUsersFriends from '../../hooks/loadUserFriendsHook'
import StatusList from '../StatusList/StatusList'

const useStyles = makeStyles((theme) => ({
    avatar: {
        width: 180,
        height: 180,
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main
    }
}))

function UserProfile() {
    const classes = useStyles();
    const [expandedFriendsList, setExpandedFriendsList] = React.useState(false);
    const [expandedChangePassword, setExpandedChangePassword] = React.useState(false);
    const { register, handleSubmit, errors } = useForm()
    const [newPassword, setNewPassword] = React.useState('')
    const dispatch = useDispatch()
    const changePasswordStatus = useSelector(state => state.changePasswordStatus)
    const user = useSelector(state => state.user)
    const friendList = useLoadUsersFriends(user.id)
    const [expandedPostList, setExpandedPostList] = useState(false)
    const usersStatuses = useSelector(state => state.usersStatuses)

    const handleExpandClick = () => {
        setExpandedFriendsList(!expandedFriendsList);
    };

    const handleChangePasswordExpandClick = () => {
        setExpandedChangePassword(!expandedChangePassword);
    };

    const changePassword = async (data) => {
        dispatch(await changePasswordAction(user.id, data))
    }

    const handlePostsExpand = () => {
        setExpandedPostList(!expandedPostList)
    }

    useEffect(() => {
        (async () => dispatch(await fetchUsersStatuses(user.id)))()
    }, [user.id, dispatch])

    return (
        <Grid container alignItems="center" justify="center">
            <Grid item xs={10} sm={10} md={6} lg={4}>
                <Paper className="profile-paper">
                    <List>
                        <ListItem>
                            <Box display="flex" width={1} flexDirection="row" flexWrap="nowrap" justifyContent="center" alignItems="center">
                                <Avatar alt="user profile picture" src={`${process.env.REACT_APP_SERVER_ADDRESS}/api/users/${user.id}/photo`} className={classes.avatar}>
                                    <Typography variant="h1" component="h4">{user.username[0].toUpperCase()}</Typography>
                                </Avatar>
                            </Box>

                            <IconButton className="edit-profile-picture">
                                <EditIcon />
                            </IconButton>
                        </ListItem>
                        <ListItem>
                            <Box display="flex" width={1} flexDirection="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
                                <Typography>Username:</Typography>
                                <Typography>{user.username}</Typography>
                            </Box>
                        </ListItem>
                        <ListItem>
                            <Box display="flex" width={1} flexDirection="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
                                <Typography>Email:</Typography>
                                <Typography>{user.email}</Typography>
                            </Box>
                        </ListItem>
                        <ListItem>
                            <Box display="flex" width={1} flexDirection="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
                                <Typography>Firstname:</Typography>
                                <Typography>{user.firstName || ''}</Typography>
                            </Box>
                        </ListItem>
                        <ListItem>
                            <Box display="flex" width={1} flexDirection="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
                                <Typography>Lastname:</Typography>
                                <Typography>{user.lastName || ''}</Typography>
                            </Box>
                        </ListItem>


                        <ListItem>
                            <Box display="flex" width={1} flexDirection="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
                                <Typography>Change password</Typography>
                                <IconButton
                                    onClick={handleChangePasswordExpandClick}
                                    aria-expanded={expandedChangePassword}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                            </Box>
                        </ListItem>
                        <Collapse in={expandedChangePassword} timeout="auto" unmountOnExit className="friends-collapse">
                            <CardContent component="form" noValidate onSubmit={handleSubmit(changePassword)}>
                                <Box display="flex" width={1} flexDirection="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center" mb={2}>

                                    <TextField fullWidth id="current-password-text-field" label="Current password" type="password"
                                        inputProps={{
                                            name: "currentPassword",
                                            ref: register({
                                                required: "Password is required"
                                            })
                                        }}
                                        error={errors.currentPassword ? true : false}
                                        helperText={errors.currentPassword ? errors.currentPassword.message : ''}
                                    />
                                </Box>
                                <Box display="flex" width={1} flexDirection="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center" mb={2}>

                                    <TextField fullWidth id="new-password-text-field" label="New password" type="password"
                                        inputProps={{
                                            name: "newPassword",
                                            ref: register({
                                                required: "Field is required"
                                            })
                                        }}
                                        onChange={e => setNewPassword(e.target.value)}
                                        error={errors.newPassword ? true : false}
                                        helperText={errors.newPassword ? errors.newPassword.message : ''}
                                    />
                                </Box>
                                <Box display="flex" width={1} flexDirection="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center" mb={2}>

                                    <TextField fullWidth id="repeat-new-password-text-field" label="Repeat new password" type="password"
                                        inputProps={{
                                            name: "repeatNewPassword",
                                            ref: register({
                                                required: "Field is required",
                                                validate: {
                                                    sameAsPassword: value => value === newPassword ? null : 'Needs to match new password'
                                                }

                                            })
                                        }}
                                        error={errors.repeatNewPassword ? true : false}
                                        helperText={errors.repeatNewPassword ? errors.repeatNewPassword.message : ''}
                                    />
                                </Box>
                                <Box display="flex" width={1} flexDirection="row" flexWrap="nowrap" justifyContent="flex-end" alignItems="center">
                                    <Button variant="contained" color="secondary" type="submit">Change</Button>
                                </Box>
                            </CardContent>
                        </Collapse>
                        <ListItem>
                            <Box display="flex" width={1} flexDirection="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
                                <Typography>Friend list</Typography>
                                <IconButton
                                    onClick={handleExpandClick}
                                    aria-expanded={expandedFriendsList}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>

                            </Box>
                        </ListItem>
                        <Collapse in={expandedFriendsList} timeout="auto" unmountOnExit>
                            <CardContent>
                                <PersonList items={friendList} showListEmpty={true} />
                            </CardContent>
                        </Collapse>
                        <ListItem>
                            <Box display="flex" width={1} flexDirection="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
                                <Typography>My statuses</Typography>
                                <IconButton
                                    onClick={handlePostsExpand}
                                    aria-expanded={expandedPostList}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>

                            </Box>
                        </ListItem>
                        <Collapse in={expandedPostList} timeout="auto" unmountOnExit>
                            <CardContent>
                                <StatusList items={usersStatuses} />
                            </CardContent>
                        </Collapse>
                    </List>

                </Paper>
            </Grid>
            <Snackbar open={changePasswordStatus !== null} autoHideDuration={5000} onClose={() => dispatch(resetChangePassword())}>
                {changePasswordStatus ?
                    <MuiAlert elevation={6} variant="filled" severity={'success'} onClose={() => dispatch(resetChangePassword())}>
                        Password changed successfully
                    </MuiAlert>
                    :
                    <MuiAlert elevation={6} variant="filled" severity={'warning'} onClose={() => dispatch(resetChangePassword())}>
                        There was an error, password wasn't changed
                    </MuiAlert>
                }

            </Snackbar>
        </Grid>
    );
}

export default UserProfile;
