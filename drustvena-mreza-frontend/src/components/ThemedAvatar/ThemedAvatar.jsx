import React from 'react'
import { Avatar, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    avatarColor: {
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
    }
})
)

const ThemedAvatar = ({ src = "", text}) => {
    const styles = useStyles()
    return (
    <Avatar
        className={styles.avatarColor}
        src={src}>
        {text}
    </Avatar>)
}

export default ThemedAvatar