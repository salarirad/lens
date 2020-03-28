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

import './gonogo.css';

export default function GoNoGo({content, onStore, onFinish, showStudyNav}) {

  const {text, trials, stimuliDuration, fixationDuration, choices, timeoutsBeforeReset, feedbackDuration} = content;

  const [finished, setFinished] = useState(false);
  const [responses, setResponses] = useState({startTimestamp: null, trial: []});
  const [trial, setTrial] = useState(null);
  const [step, setStep] = useState(null); // null, stimuli, fixation, feedback
  const [correct, setCorrect] = useState(null);
  const [clock, setClock] = useState(null);

  useEffect(() => {
    showStudyNav(false);
  });

  // when finished, store responses and proceed to the next view
  useEffect(() => {
    if (finished) {
      clearTimeout(clock);
      onFinish();
      onStore(responses);
      showStudyNav(true);
    }
  }, [finished]);
  

  const fixation = () => {
    setStep('fixation');
    clearTimeout(clock);
    setClock(
      setTimeout(() => {
        stimuli();
      }, fixationDuration)
    );
  }
  const stimuli = () => {
    setStep('stimuli');
    clearTimeout(clock);
    setCorrect(false);
    setClock(
      setTimeout(() => {
        feedback();
      }, stimuliDuration)
    );
  }

  const feedback = () => {
    setStep('feedback');
    clearTimeout(clock);
    setClock(
      setTimeout(() => {
        fixation();
      }, feedbackDuration)
    );
  }

  const startTask = () => {
    setTrial(1);
    fixation();
  }

  const handleResponse = (choice) => {
    clearTimeout(clock);
    //store response
    setTrial(trial+1);
    fixation();
  }

  // start screen
  if (trial === null) {
    return (
      <Grid>
        Are you ready?
      <Button
        onClick={() => startTask()}
      >
        Yes
      </Button>
      </Grid>

    )
  }

  //const render = () => {
    return (
        <Grid item container direction='column' spacing={2} justify="space-between" alignItems='stretch'>
          <Grid item>
            <Markdown source={text} escapeHtml={false} />
          </Grid>

          {step === 'stimuli' &&
            <Grid item container direction="row" justify="space-around" alignItems="center">
                <Star fontSize='large' onClick={() => handleResponse(0)} className='star gng-icon' />
                <Divider orientation="vertical" flexItem />
                <Circle fontSize='large' onClick={() => handleResponse(0)} className='circle gng-icon' />
            </Grid>
          }
          {step === 'feedback' && 
            <Grid item container direction='row' justify='space-around' alignItems='center'>
              {correct && <Correct fontSize='large' className='correct gng-icon' />}
              {!correct && <Incorrect fontSize='large' className='incorrect gng-icon' />}
            </Grid>
          }
          {step === 'fixation' && 
            <Grid item container direction="row" justify="space-around" alignItems="center">
              <Add fontSize='large' className='fixation gng-icon' />
            </Grid>
          }

        </Grid>

    );
  //} //.render()

}
