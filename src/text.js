import React, { useRef, useEffect, useState, Fragment } from 'react';
import { Typography, Divider, Box, TextField, Grid } from '@material-ui/core';

import { useTranslation } from 'react-i18next';

import Markdown from 'react-markdown';

export default function Text({content, onStore}) {
  //props: title, text, placeholder, help, required, pattern, instruction

  const { t } = useTranslation();

  const response = useRef(null);
  const [state, setState] = useState({
    response: response.current
  });

  //to store data on pressing next
  useEffect(() => {
    // store data as a cleanup side-effect (on WillUnmount)
    return () => { onStore(response.current) };
  },[]);


  const handleChange = (e) => {
    response.current = e.target.value
    setState({...state, response: response.current});
  }


  return (
    <Grid container direction='column' spacing={2} alignItems='stretch' justify='flex-start' className='Text-container'>
      <Grid item>
        <Markdown source={t(content.text)} escapeHtml={false} />
      </Grid>
      {!(content.instruction || false) &&
        <Grid item>
          <TextField label={t(content.placeholder)} variant="filled" fullWidth onChange={handleChange} />
        </Grid>
      }
    </Grid>
  );
}
