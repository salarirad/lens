import React, { Fragment } from 'react';

import {Button, Grid} from '@material-ui/core';

export default function Navigation(props) {

  return (
    <Grid container direction='row' justify='flex-end'>
      <Grid item>
        {!props.finished && 
          <Button variant="contained" color="primary" onClick={props.onNext}>Next</Button>
        }
      </Grid>
    
    </Grid>
  );
}