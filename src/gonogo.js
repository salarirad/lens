import React, {useState, useEffect, Fragment, useRef} from 'react';


import { Button, Grid, Typography, Divider} from '@material-ui/core';

import { 
  Star, 
  RadioButtonUnchecked as Circle, 
  Add,
  Check as Correct,
  Clear as Incorrect
} from '@material-ui/icons';

import Markdown from 'react-markdown/with-html';

import {sample, shuffle} from './utils/random';
import { useTranslation } from 'react-i18next';

import './gonogo.css';

//FIXME these are realtime variables, so I keep them out of the component's state.
let clock

export default function GoNoGo({content, onStore}) {

  const {t} = useTranslation();
  const {text, trials, stimuliDuration, fixationDuration, choices, timeoutsBeforeReset, feedbackDuration} = content;

  const [state, setState] = useState({
    finished: false,
    trialResponses: [],
    taskStartedAt: null,
    taskFinishedAt: null,
    taskDuration: null,
    step: null,
    correct: null,
    stimuli: null,
    trialStartedAt: null,
    respondedAt: null,
    trial: null,
    timeouts: 0
  })

  useEffect(() => {

    // generate stimuli stream
    if (state.stimuli===null) {
      let stim = [...Array(trials.total).keys()].map((i,t) => {
        if (i<trials.leftGo)
          return 'left-go'
        if (i<trials.go)
          return 'right-go'
        if (i<trials.go + (trials.left - trials.leftGo))
          return 'left-nogo'
        return 'right-nogo'
      }) 
      setState({...state, stimuli: shuffle(stim)});
    }


    if (state.step === 'fixation') {
      clearTimeout(clock);  
      clock = setTimeout(() => {
          setState({...state, trial: state.trial+1, trialStartedAt: Date.now(), step: 'stimuli'});
        }, fixationDuration);
    }

    if (state.step === 'feedback') {
      clearTimeout(clock);
      clock = setTimeout(() => {
          setState({...state, step: 'fixation'})
        }, feedbackDuration)
    }

    if (state.step === 'stimuli') {
      clearTimeout(clock);

      if (state.timeouts<timeoutsBeforeReset) {
        clock = setTimeout(() => {
          setState({...state,
            trialResponses: [...state.trialResponses, {
              'trial': state.trial,
              'stimuli': state.stimuli[state.trial-1],
              'choice': null,
              'correct': null,
              'respondedAt': null,
              'trialStartedAt': state.trialStartedAt,
              'rt': null
            }],
            timeouts: state.timeouts + 1,
            correct: false,
            step: (feedbackDuration>0)?'feedback':'fixation'
          });
        }, stimuliDuration)
      } else {
        setState({...state, step: 'reset'})
      }
    }


    if (state.trial>trials.total) {
      setState({...state, finished: true, taskFinishedAt: Date.now()})
    }

    // on finish
    if (state.finished) {
      clearTimeout(state.clock);
      
      // timestamps
      let response = {trials: state.trialResponses};
      response.taskStartedAt = state.taskStartedAt;
      response.taskFinishedAt = state.taskFinishedAt;
      response.taskDuration = state.taskFinishedAt - state.taskStartedAt;
      onStore({
        'view': content,
        'response': response
      }, true); // store + next
    }

  },[state]);

  const startTask = () => {
    setState({
      ...state, 
      trialResponses: [], 
      trial: 0, 
      timeouts: 0, 
      step: 'fixation', 
      taskStartedAt: Date.now()
    })
  }

  const handleResponse = (choice) => {
    const respondedAt = Date.now(); //timestamp

    clearTimeout(clock);

    const _correct = (choice===choices.go && !state.stimuli[state.trial-1].endsWith('nogo')) || 
              (choice==='empty' && state.stimuli[state.trial-1].endsWith('nogo'))

    setState({
      ...state,
      correct: _correct,
      respondedAt: respondedAt,
      trialResponses: [...state.trialResponses, {
        'trial': state.trial,
        'stimuli': state.stimuli[state.trial-1],
        'choice': choice,
        'correct': _correct,
        'respondedAt': respondedAt,
        'trialStartedAt': state.trialStartedAt,
        'rt': respondedAt - state.trialStartedAt
      }],
      step: (feedbackDuration>0)?'feedback':'fixation'
    })
  }

  const renderStimulus = (stimulus) => {
    return (
      <Fragment>
      {stimulus==='star' && <Star fontSize='large' onClick={() => handleResponse('star')} className='star gng-icon' />}
      {stimulus==='empty' && <div onClick={() => handleResponse('empty')} className='empty gng-icon'> </div>}
      {stimulus==='circle' && <Circle fontSize='large' onClick={() => handleResponse('circle')} className='circle gng-icon' />}
      </Fragment>
    );
  }

  const renderStimuli = (trialType) => {
    return (
      <Grid item container direction="row" justify="space-around" alignItems="center">
        {trialType === 'left-go' && renderStimulus(choices.go)}
        {trialType === 'left-nogo' && renderStimulus(choices.nogo)}
        {(trialType !== 'left-go' && trialType !== 'left-nogo') && renderStimulus('empty')}
        <Divider orientation="vertical" flexItem />
        {trialType === 'right-go' && renderStimulus(choices.go)}
        {trialType === 'right-nogo' && renderStimulus(choices.nogo)}
        {(trialType !== 'right-go' && trialType !== 'right-nogo') && renderStimulus('empty')}
      </Grid>
    )
  }

  const renderFeedback = () => {
    return (
      <Grid item container direction='row' justify='space-around' alignItems='center'>
        {state.correct && <Correct fontSize='large' className='correct gng-icon' />}
        {!state.correct && <Incorrect fontSize='large' className='incorrect gng-icon' />}
      </Grid>
    )

  }

  // show reset screen on timeouts reaching a threshold
  if (state.step === 'reset') {
    return (
      <Grid container direction='column' spacing={2} alignItems='center' justify='flex-start' className='Text-container'>
        <Grid item><Markdown source={t('gonogo.too_many_timeouts')} escapeHtml={false} /></Grid>
        <Grid item>
          <Button variant='text' color='primary' onClick={() => startTask()}>{t('gonogo.restart')}</Button>
        </Grid>
      </Grid>

    )
  }

  // start screen
  if (state.trial === null) {
    return (
      <Grid container direction='column' spacing={2} alignItems='center' justify='flex-start' className='Text-container'>
        <Grid item><Markdown source={t('gonogo.are_you_ready')} escapeHtml={false} /></Grid>
        <Grid item>
          <Button variant='text' color='primary' onClick={() => startTask()}>{t('gonogo.start')}</Button>
        </Grid>

      </Grid>

    )
  }

  //const render = () => {
    return (
        <Grid item container direction='column' spacing={2} alignItems='stretch' justify='flex-start' className='Text-container'>
          <Grid item>
            <Markdown source={t(text)} escapeHtml={false} />
          </Grid>

          {state.step === 'stimuli' && renderStimuli(state.stimuli[state.trial-1])}

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
