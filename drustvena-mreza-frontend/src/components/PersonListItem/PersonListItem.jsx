import React, { useState, useEffect } from 'react';
import './person-list-item.css'
import { Box, Paper, ButtonGroup, Link, IconButton, Avatar, makeStyles } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom'
import Add from '@material-ui/icons/Add'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import { useSelector, useDispatch } from 'react-redux';
import { sendFriendRequest as sendFriendRequestAction, deleteFriendship } from '../../state/actions'

const useStyles = makeStyles((theme) => ({
    avatarColor: {
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
    }
})
)

function PersonListItem({ person }) {
    const styles = useStyles()
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [addBtnDisabled, setAddBtnDisabled] = useState(false)
    const [deleteBtnDisabled, setDeleteBtnDisabled] = useState(false)
    const [isFriend, setIsFriend] = useState(false)
    const friendships = useSelector(state => state.friendships)

    const sendFriendRequest = async () => {
        dispatch(await sendFriendRequestAction(user.id, person.id))
        setAddBtnDisabled(true)
    }

    const removeFriend = async () => {
        dispatch(await deleteFriendship(user.id, person.id))
        setDeleteBtnDisabled(true)
    }

    useEffect(() => {
        if ([...new Set(friendships.map(fsp => [fsp.firstUser, fsp.secondUser]).flat())
        ].includes(person.id)) setIsFriend(true)
        else setIsFriend(false)
    }, [friendships.length, friendships, dispatch, person.id])

    return (
        <Box component={Paper} p={2} py={2} mt={1} width={1} display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
            <Box display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
                <Box component={Avatar} className={styles.avatarColor} mr={1} src={`${process.env.REACT_APP_SERVER_ADDRESS}/api/users/${person.id}/photo`}>{person.username[0].toUpperCase()}</Box>
                <Link component={RouterLink} to={`/users/${person.id}`}>
                    {person.firstName && person.lastName ? `${person.firstName} ${person.lastName}` : person.username}
                </Link>
            </Box>

            {!person.currentUser ?
                <ButtonGroup>
                    {isFriend ?
                        <IconButton onClick={removeFriend} disabled={deleteBtnDisabled}><DeleteOutline /></IconButton>
                        :
                        <IconButton onClick={sendFriendRequest} disabled={addBtnDisabled}><Add /></IconButton>}
                </ButtonGroup> : ''}
        </Box>

    );
}

export default PersonListItem;
