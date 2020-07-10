import React from 'react';
import './status-list.css'
import { Grid } from '@material-ui/core';
import Status from '../Status/Status'

function StatusList({ items }) {
  return (
    <Grid container direction="row" alignContent="center" justify="center">
      {
        items.map(item => <Status key={item.id} status={item}/>)
      }


    </Grid>
  );
}

export default StatusList;
