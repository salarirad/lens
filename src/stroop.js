import React, {useState, useEffect, useRef} from 'react';


import { Box, Button, Grid, Typography, Divider} from '@material-ui/core';

import { 
  Add,
  Check as Correct,
  Clear as Incorrect,
} from '@material-ui/icons';

import Image from 'material-ui-image';

import Markdown from 'react-markdown';

import {useTranslation} from 'react-i18next';

import './stroop.css';

//FIXME keep this var as a ref
let clock

export default function Stroop({content, onStore}) {

  const {rule, colors, words, trials, stimulusDuration, fixationDuration, choices, timeoutsBeforeReset, feedbackDuration} = content;
  const {t} = useTranslation();
  const separator = ''; // character that separates word and color in trials[i].stimulus and trials[i].choices

  const [state, setState] = useState({
    trialResponses: [],
    finished: false,
    trial: null,
    step: null,
    correct: null,
    timeouts: 0
  });

  // when finished, store responses and proceed to the next view
  useEffect(() => {

    if (state.step==='fixation') {
      console.log('stroop: fixation');
      clock = setTimeout(() => {
        setState({
          ...state,
          step: 'stimulus',
          trial: state.trial+1, 
          trialStartedAt: Date.now()
        });
      }, fixationDuration)
      //return clearTimeout(clock);
    }

    if (state.step === 'stimulus') {
      clearTimeout(clock);

      if (state.timeouts<timeoutsBeforeReset) {
        clock = setTimeout(() => {
          setState({
            ...state,
            step: 'feedback',
            trialResponses: [...state.trialResponses, {
              trial: state.trial,
              choice: null,
              correct: null,
              respondedAt: null,
              trialStartedAt: state.trialStartedAt,
              rt: null}
            ],
            timeouts: state.timeouts + 1,
            correct: false
          });
        }, stimulusDuration);
      } else {
        setState({...state, step: 'reset', timeouts: 0})
      }
    }

    if (state.step === 'feedback') {
        clearTimeout(clock);
        clock = setTimeout(() => {
          setState({
            ...state,
            step: 'fixation',
          });
        }, feedbackDuration);
    }

    if (state.finished) {
      clearTimeout(state.clock);
      
      // add timestamps
      let response = {trials: state.trialResponses};
      response.taskStartedAt = state.taskStartedAt;
      response.taskFinishedAt = state.taskFinishedAt;
      response.taskDuration = state.taskFinishedAt - state.taskStartedAt;
      onStore({
        'view': content,
        'response': response
      }, true); // store + next
    }

    if (state.trial>=trials.length) {
      setState({...state, taskFinishedAt: Date.now(), finished: true})
    }

  }, [state]);

  const startTask = () => {
    setState({
      ...state,
      trial: 0,
      timeouts: 0,
      trialResponses: [],
      step:'fixation', 
      taskStartedAt: Date.now() //timestamp
    });
  }

  const handleResponse = (choice) => {
    let respondedAt = Date.now(); //timestamp
    let correct = true //(choice.word === trial[].color)

    clearTimeout(clock);

    setState({
      ...state,
      step: 'feedback',
      trialResponses: [...state.trialResponses,{
        trial: state.trial,
        choice: choice,
        correct: correct,
        respondedAt: respondedAt,
        trialStartedAt: state.trialStartedAt,
        rt: respondedAt - state.trialStartedAt
      }]
    })
  }

  const renderStimulus = (stimulus) => {
    let [word, color] = stimulus.split('')
    return (
      <Grid container item direction='column' alignItems='center' justify='flex-start'>
      <Typography className='stroop-stimulus' variant='h1' style={{color: colors[color]}}>
        {t(words[word])}
      </Typography>
      </Grid>

    );
  }

  const renderChoices = (choices) => {
    
    return (
      <Grid container direction='row' justify='space-between' alignItems='stretch' className='stroop-choices'>
      {choices.map((choice,i) => {
        let [word, color] = choice.split('')
        return (
          <Grid item xs key={i}>
          <Button style={{color: colors[color]}} onClick={() => handleResponse(choice)} size="large" fullWidth variant='text'>
            {t(words[word])}
          </Button>
          </Grid>
        );
      })}
      </Grid>
    )
  }

  const renderFeedback = () => {
    let {correct} = state;
    return (
      <Grid item container direction='row' justify='space-around' alignItems='center'>
        {correct && <Correct fontSize='large' className='correct gng-icon' />}
        {!correct && <Incorrect fontSize='large' className='incorrect gng-icon' />}
      </Grid>
    )

  }

  const renderStartScreen = () => {
    return (
      <Grid container direction='column' spacing={2} alignItems='center'>
        <Grid item><Markdown source={t('stroop.are_you_ready')} escapeHtml={false} /></Grid>
        <Grid item>
          <Button variant='text' color='primary' onClick={() => startTask()}>{t('yes')}</Button>
        </Grid>

      </Grid>
    )
  }

  const renderResetScreen = () => {
    return (
      <Grid container direction='column' spacing={2} alignItems='center' justify='flex-start' className='Text-container'>
        <Grid item><Markdown source={t('stroop.too_many_timeouts')} escapeHtml={false} /></Grid>
        <Grid item>
          <Button variant='text' color='primary' onClick={() => startTask()}>{t('stroop.restart')}</Button>
        </Grid>
      </Grid>
    )
  }

  // show reset screen on timeouts reaching a threshold
  if (state.step === 'reset') {
    return renderResetScreen();
  }

  if (state.trial === null) {
    return renderStartScreen();
  }

  
  //const render = () => {
    return (
        <Grid item container direction='column' spacing={2} alignItems='stretch' justify='flex-start' className='Text-container stroop-board'>
          <Grid item>
            <Markdown source={t(rule)} escapeHtml={false} />
          </Grid>

          {state.step === 'stimulus' && renderStimulus(trials[state.trial-1].stimulus) }
          {state.step === 'stimulus' && renderChoices(trials[state.trial-1].choices) }

          {state.step === 'feedback' && renderFeedback()}

          {state.step === 'fixation' && 
            <Grid item container direction="row" justify="space-around" alignItems="center">
              <Add fontSize='large' className='fixation gng-icon' />
            </Grid>
          }

        </Grid>

    );
  //} //.render()

}
