import React, { useState, useEffect } from 'react';
import './status.css'
import { Card, CardHeader, CardContent, Typography, CardActions, IconButton, Box, Link, Menu, MenuItem } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import { Link as RouterLink } from 'react-router-dom'
import useLoadUser from '../../hooks/loadUserHook'
import ThemedAvatar from '../ThemedAvatar/ThemedAvatar'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux';
import { likeStatus, dislikeStatus, deleteStatus, editStatus } from '../../state/actions'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import EditStatusDialog from '../EditStatusDialog/EditStatusDialog'

function Status({ status }) {

  const user = useLoadUser(status.userId)
  const currentUser = useSelector(state => state.user)
  const likedStatuses = useSelector(state => state.statusLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null)
  const [actionMenuVisible, setActionMenuVisible] = useState(false)
  const dispatch = useDispatch()
  const [editDialogVisible, setEditDialogVisible] = useState(false)

  useEffect(() => {
    if (likedStatuses.map(ls => ls.statusId).includes(status.id)) setIsLiked(true)
    else setIsLiked(false)
  }, [likedStatuses.length, status.id, likedStatuses])

  const likeDislikeStatus = async () => {
    if (isLiked) dispatch(await dislikeStatus(currentUser.id, status.id))
    else dispatch(await likeStatus(currentUser.id, status.id))
  }

  const actionMenuOpen = (e) => {
    setActionsAnchorEl(e.target)
    setActionMenuVisible(true)
  }
  const actionMenuClose = () => {
    setActionMenuVisible(false)
  }

  const deleteStatusClicked = async () => {
    dispatch(await deleteStatus(status))
    actionMenuClose()
  }

  const onEdit = async (data) => {
    dispatch(await editStatus({ ...status, contents: data.contents }))
    setEditDialogVisible(false)
    actionMenuClose()
  }

  return status && user ? (
    <Box component={Card} mt={1} width={1}>
      <CardHeader
        avatar={
          <ThemedAvatar
            src={`${process.env.REACT_APP_SERVER_ADDRESS}/api/users/${user.id}/photo`}
            text={user.username[0].toUpperCase()} />
        }
        title={
          <Link component={RouterLink} to={`/users/${user.id}`}>
            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
          </Link>
        }
        subheader={moment(status.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
        action={

          user.id === currentUser.id ?
            <span>
              < IconButton aria-label="settings"
                aria-controls="actions-menu"
                aria-haspopup="true"
                onClick={actionMenuOpen}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="actions-menu"
                anchorEl={actionsAnchorEl}
                keepMounted
                open={actionMenuVisible}
                onClose={actionMenuClose}
              >
                <MenuItem onClick={()=>setEditDialogVisible(true)}>Edit</MenuItem>
                <MenuItem onClick={deleteStatusClicked}>Delete</MenuItem>
              </Menu>
              <EditStatusDialog
                status={status}
                open={editDialogVisible}
                onSubmit={onEdit}
                handleClose={() => setEditDialogVisible(false)} />
            </span>



            : ''
        }
      />
      <CardContent>
        <Typography variant="body2" color="textPrimary" component="p">
          {status.contents}
        </Typography>
      </CardContent>

      <CardActions>
        <IconButton aria-label="Like" onClick={likeDislikeStatus}>
          {isLiked ? <FavoriteIcon color="primary"/> : <FavoriteBorderIcon  color="primary"/>}
        </IconButton>
      </CardActions>
    </Box>
  ) : '';
}

export default Status;
