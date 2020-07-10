import React from 'react'
import { Box, Typography, List, ListItem, Grid, Avatar, Paper, makeStyles } from '@material-ui/core'
import useUser from '../../hooks/loadUserHook'

const useStyles = makeStyles((theme) => ({
    avatar: {
        width: 180,
        height: 180,
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main
    }
}))

const UserProfile = (props)=>{
    const classes = useStyles();
    const { userId } = props.match.params
    const user = useUser(userId)
    

    return user ? (<Grid container alignItems="center" justify="center">
    <Grid item xs={10} sm={10} md={6} lg={4}>
        <Paper className="profile-paper">
            <List>
                <ListItem>
                    <Box display="flex" width={1} flexDirection="row" flexWrap="nowrap" justifyContent="center" alignItems="center">
                        <Avatar alt="user profile picture" src={`${process.env.REACT_APP_SERVER_ADDRESS}/api/users/${user.id}/photo`} className={classes.avatar}>
                            <Typography variant="h1" component="h4">{user.username[0].toUpperCase()}</Typography>
                        </Avatar>
                    </Box>
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
            </List>
        </Paper>
    </Grid>
    
</Grid>) : ''
}

export default UserProfile