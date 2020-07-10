import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, Button, TextField, DialogActions, Fab } from '@material-ui/core'
import PostAddIcon from '@material-ui/icons/PostAdd';
import './post-status-dialog.css'
import { useDispatch, useSelector } from 'react-redux';
import { addNewStatus } from '../../state/actions'
import { useForm } from 'react-hook-form';

function PostStatusDialog() {
    const [open, setOpen] = useState(false)
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const { register, handleSubmit, errors } = useForm()
    const [form, setForm ] = useState(null)

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        form.reset()
    }
    const onSubmit = async (data) => {
        dispatch(await addNewStatus(user.id, data.contents))
        form.reset()
        setOpen(false)
    }
    return (
        <div>
            <Fab color="secondary" onClick={handleClickOpen} aria-label="post" className="dialog-fab">
                <PostAddIcon />
            </Fab>

            <Dialog open={open} fullWidth maxWidth={"md"} onClose={handleClose} aria-labelledby="post-status-dialog-title">
                <form onSubmit={handleSubmit(onSubmit)} ref={r=>setForm(r)}>
                    <DialogTitle id="post-status-dialog-title">Post status</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="content"
                            label="Content"
                            type="text"
                            fullWidth
                            multiline
                            rows={6}
                            inputProps={{
                                name: "contents",
                                ref: register({
                                    required: "Cant post empty status"
                                })
                            }}
                            error={errors.content ? true : false}
                            helperText={errors.content ? errors.content.message : ''}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" type="reset">
                            Cancel
                </Button>
                        <Button color="primary" type="submit">
                            Post
                </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}
export default PostStatusDialog