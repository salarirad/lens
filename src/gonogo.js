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


import './gonogo.css';

export default function GoNoGo({content, onStore, onFinish, showStudyNav}) {

  const {text, trials, stimuliDuration, fixationDuration, choices, timeoutsBeforeReset, feedbackDuration} = content;

  const [finished, setFinished] = useState(false);
  const [responses, setResponses] = useState({startTimestamp: null, trial: []});
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
      console.log(stim)
    }
  },[stimuli]);

  // when finished, store responses and proceed to the next view
  useEffect(() => {
    if (finished) {
      clearTimeout(clock);
      onFinish();
      onStore(responses);
      showStudyNav(true);
    }
  }, [finished]);

  useEffect(() => {
    if (trial>trials.total)
      setFinished(true);
  }, [trial])
  

  const showFixation = () => {
    setStep('fixation');
    clearTimeout(clock);
    setClock(
      setTimeout(() => {
        showStimuli();
      }, fixationDuration)
    );
  }
  const showStimuli = () => {
    setStep('stimuli');
    clearTimeout(clock);
    setCorrect(false);
    setClock(
      setTimeout(() => {
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
    setTrial(1);
    showFixation();
  }

  const handleResponse = (choice) => {
    clearTimeout(clock);
    //store response
    setTrial(trial+1);
    showFeedback();
  }

  const renderStimulus = (stimulus) => {
    return (
      <Fragment>
      {stimulus==='star' && <Star fontSize='large' onClick={() => handleResponse(0)} className='star gng-icon' />}
      {stimulus==='empty' && <div onClick={() => handleResponse(0)} className='empty gng-icon'> </div>}
      {stimulus==='circle' && <Circle fontSize='large' onClick={() => handleResponse(0)} className='circle gng-icon' />}
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
        <Grid item><Markdown source="Are you ready?" escapeHtml={false} /></Grid>
        <Grid item>
          <Button onClick={() => startTask()}>Yes</Button>
        </Grid>

      </Grid>

    )
  }

  //const render = () => {
    return (
        <Grid item container direction='column' spacing={2} alignItems='stretch' justify='flex-start' className='Text-container'>
          <Grid item>
            <Markdown source={text} escapeHtml={false} />
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
