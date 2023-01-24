import React, { useRef, useEffect, useState, Fragment } from 'react';
import { Typography, Button, Divider, Box, TextField, Grid, Paper } from '@material-ui/core';
import Markdown from 'react-markdown/with-html';

import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";

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

  //test constant for static demo
  const amounts = [3,4,3]

  //test action experiment
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
      <RepositoryBox amount={amounts[0]} />
      <RepositoryBox amount={amounts[1]} />
      <RepositoryBox amount={amounts[2]} />

      <Grid item container direction="row" justify="space-around" alignItems='center'>
        <Button size='large' color='primary' variant='outlined' onClick={testAction}>{t('test')}</Button>
      </Grid>

    </Grid>
  );
}

{/*
  Container boxes for monetization interactions
*/}
function RepositoryBox(props){
  console.log(props);
  return (
    <Grid item xs={12}>
      <Paper className='view-container'>
        <Grid container>
          <Grid item xs={12}>
            <Typography>Pot</Typography>
          </Grid>
          <Grid item xs={12}>
              <MonetizedTokens amount={props.amount} />
          </Grid>
          <Grid item xs={12}> Total: {props.amount} </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

function MonetizedToken(props){
  return(
    <MonetizationOnIcon />
  );
}

function MonetizedTokens(props){
    const monetizedTokensList = [];
    for(let i=0; i < props.amount; i++) {
      monetizedTokensList.push(  <MonetizedToken value={i} key={i} />);
    }

  return(
    <div>{monetizedTokensList}</div>
  )

}

