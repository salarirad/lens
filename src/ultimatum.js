import React, { useRef, useEffect, useState, Fragment } from 'react';
import { Typography, Button, Divider, Box, TextField, Grid } from '@material-ui/core';

import { useTranslation } from 'react-i18next';

export default function Ultimatum({content, onStore}) {
  //props:   rule.text , help.text , itemsBox.text , playerBox.text, othersBox.text
  //props:   initialAmount ,initialAmountRandomize ,initialAmountMin ,initialAmountMax , trials

  //i18n:

  const { t } = useTranslation();

  const response = useRef(null);
  const [state, setState] = useState({
    trialResponses: [],
    finished: false,
    taskStartedAt: Date.now(),
    trial: null
  });

  useEffect(() => {
    return () => {
      onStore({
        'view': content,
        'response': response
      }, true)
    };
  },[]);

  // when finished, store responses and proceed to the next view
  useEffect(() => {
    if (state.finished) {
      const now = Date.now()
      // add timestamps
      let response = {trials: state.trialResponses};
      response.taskStartedAt = state.taskStartedAt;
      response.taskFinishedAt = now;
      response.taskDuration = now - state.taskStartedAt;
      onStore({
        'view': content,
        'response': response
      }, true); // store + next
    }
  }, [state]);

  const testAction = () => {
    console.log('testAction', state)
  }

  /***
   * Main render part of the dictator function
   *
   */
  return (
    <Grid container direction='column' spacing={2} alignItems='stretch' justify='flex-start' className='Text-container'>
      <Grid item>
        <Typography variant="h4">{t('rule.text')}</Typography>
      </Grid>

      <Grid item container direction="row" justify="space-around" alignItems='center'>
        <Button size='large' color='primary' variant='outlined' onClick={testAction}>{t('test')}</Button>
      </Grid>

    </Grid>
  );
}
