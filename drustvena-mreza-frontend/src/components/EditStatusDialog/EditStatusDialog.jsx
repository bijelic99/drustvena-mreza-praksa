import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, Button, TextField, DialogActions } from '@material-ui/core'
import { useForm } from 'react-hook-form';

function EditStatusDialog({ open = false, handleClose, onSubmit, status }) {
    const { register, handleSubmit, errors } = useForm({ defaultValues: { contents: status.contents } })
    const [form, setForm] = useState(null)



    return (
        <div>

            <Dialog open={open} fullWidth maxWidth={"md"} onClose={handleClose} aria-labelledby="post-status-dialog-title">
                <form onSubmit={handleSubmit(onSubmit)} ref={r => setForm(r)}>
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
                            Edit
                </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}
export default EditStatusDialog