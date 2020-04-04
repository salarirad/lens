import React, {useState, useEffect, Fragment} from 'react';


import { Button, Grid, Typography, Divider} from '@material-ui/core';

import { 
  Star, 
  RadioButtonUnchecked as Circle, 
  Add,
  Check as Correct,
  Clear as Incorrect
} from '@material-ui/icons';

import Image from 'material-ui-image';

import Markdown from 'react-markdown';

import {sample, shuffle} from './utils/random';
import { useTranslation } from 'react-i18next';

import './gonogo.css';

//FIXME these are realtime variables, so I keep them out of the component's state.
let taskStartedAt, taskFinishedAt, trialStartedAt, stimuliAt, respondedAt

export default function GoNoGo({content, onStore, onFinish, showStudyNav}) {

  const {t} = useTranslation();
  const {text, trials, stimuliDuration, fixationDuration, choices, timeoutsBeforeReset, feedbackDuration} = content;

  const [finished, setFinished] = useState(false);
  const [responses, setResponses] = useState({taskStartedAt: null, taskFinishedAt: null, trials: []});
  const [trial, setTrial] = useState(null);
  const [step, setStep] = useState(null); // null, stimuli, fixation, feedback
  const [correct, setCorrect] = useState(null);
  const [clock, setClock] = useState(null);
  const [stimuli,setStimuli] = useState(null);

  useEffect(() => {
    showStudyNav(false);
  });

  useEffect(() => {
    if (stimuli===null) {
      let stim = [...Array(trials.total).keys()].map((i,t) => {
        if (i<trials.leftGo)
          return 'left-go'
        if (i<trials.go)
          return 'right-go'
        if (i<trials.go + (trials.left - trials.leftGo))
          return 'left-nogo'
        return 'right-nogo'
      }) 
      stim = shuffle(stim)
      setStimuli(stim)
    }
  },[stimuli]);

  // when finished, store responses and proceed to the next view
  useEffect(() => {
    if (finished) {
      clearTimeout(clock);
      onFinish();

      // add timestamps
      let finalResponses = responses;
      finalResponses.taskStartedAt = taskStartedAt;
      finalResponses.taskFinishedAt = taskFinishedAt;
      finalResponses.taskDuration = taskFinishedAt - taskStartedAt;

      onStore(finalResponses);
      showStudyNav(true);
    }
  }, [finished]);

  useEffect(() => {
    if (trial>trials.total) {
      taskFinishedAt = Date.now(); //timestamp
      setTimeout(() => {
        setFinished(true);
      }, feedbackDuration);
    }

  }, [trial])
  

  const showFixation = () => {
    setStep('fixation');
    setTrial(t => t+1);

    trialStartedAt = Date.now(); //timestamp

    clearTimeout(clock);
    setClock(
      setTimeout(() => {
        showStimuli();
      }, fixationDuration)
    );
  }
  const showStimuli = () => {
    setStep('stimuli');

    stimuliAt = Date.now(); //timestamp

    clearTimeout(clock);
    setCorrect(false);
    setClock(
      setTimeout(() => {
        setResponses(r => {
          r.trials.push({
            'stimuli': stimuli[trial-1],
            'choice': null,
            'correct': null,
            'respondedAt': null,
            'trialStartedAt': trialStartedAt,
            'stimuliAt': stimuliAt,
            'rt': null
          })
          return r;
        });
        showFeedback();
      }, stimuliDuration)
    );
  }

  const showFeedback = () => {
    setStep('feedback');
    clearTimeout(clock);
    setClock(
      setTimeout(() => {
        showFixation();
      }, feedbackDuration)
    );
  }

  const startTask = () => {
    setTrial(0);
    taskStartedAt = Date.now(); //timestamp
    showFixation();
  }

  const handleResponse = (choice) => {
    respondedAt = Date.now(); //timestamp

    clearTimeout(clock);

    let crt = (choice===choices.go && !stimuli[trial-1].endsWith('nogo')) || 
              (choice==='empty' && stimuli[trial-1].endsWith('nogo'))
    setCorrect(crt)

    responses.trials.push();

    setResponses(r => {
      r.trials.push({
        'stimuli': stimuli[trial-1],
        'choice': choice,
        'correct': crt,
        'respondedAt': respondedAt,
        'trialStartedAt': trialStartedAt,
        'stimuliAt': stimuliAt,
        'rt': respondedAt - stimuliAt
      })
      return r;
    });

    showFeedback();
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
        {correct && <Correct fontSize='large' className='correct gng-icon' />}
        {!correct && <Incorrect fontSize='large' className='incorrect gng-icon' />}
      </Grid>
    )

  }

  // start screen
  if (trial === null) {
    return (
      <Grid container direction='column' spacing={2} alignItems='center' justify='flex-start' className='Text-container'>
        <Grid item><Markdown source={t('gonogo.ready_question')} escapeHtml={false} /></Grid>
        <Grid item>
          <Button onClick={() => startTask()}>{t('yes')}</Button>
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

          {step === 'stimuli' && renderStimuli(stimuli[trial-1])}

          {step === 'feedback' && renderFeedback()}

          {step === 'fixation' && 
            <Grid item container direction="row" justify="space-around" alignItems="center">
              <Add fontSize='large' className='fixation gng-icon' />
            </Grid>
          }

        </Grid>

    );
  //} //.render()

}
