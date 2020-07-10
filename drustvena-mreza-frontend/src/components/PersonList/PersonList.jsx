import React from 'react';
import './person-list.css'
import { Grid, Typography } from '@material-ui/core';
import PersonListItem from '../PersonListItem/PersonListItem';


function PersonList({ items, showListEmpty = false }) {
    return (
        <Grid container direction="row" alignContent="center" justify="center">
            {items.map(item => <PersonListItem key={item.id} person={item} />)}
            {items.length === 0 && showListEmpty ? <Typography>List empty</Typography> : ''}
        </Grid>

    );
}

export default PersonList;
