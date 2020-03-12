import React, { useEffect, useState, Fragment } from 'react';
import { Typography, Divider, Box, TextField, Grid } from '@material-ui/core';

export default function Text(props) {

  const [data] = useState({value: props.content.text});
  //props: title, text, placeholder, help, required, pattern

  //to store data on pressing next
  useEffect(() => {
    // store data as a cleanup side-effect (on WillUnmount)
    return () => { props.onNext(data) };
  },[data, props]);

  return (
    <Grid container direction='column' spacing={2} alignItems='stretch' justify='flex-start' className='Text-container'>
      <Grid item>
        <Typography>{props.content.text}</Typography>
      </Grid>
      <Grid item>
        <TextField label={props.content.placeholder} variant="filled" fullWidth />
      </Grid>
    </Grid>
  );
}
