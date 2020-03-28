import React, {useState, useEffect, Fragment} from 'react';


import { Button, Grid, Typography, Divider} from '@material-ui/core';

import Image from 'material-ui-image';

import Markdown from 'react-markdown';

import './gonogo.css';

export default function GoNoGo({content, onStore, onFinish, showStudyNav}) {

  const {text, trials, stimuliDuration, fixationDuration, choices, timeoutsBeforeReset, feedbackDuration} = content;

  const [finished, setFinished] = useState(false);
  const [responses, setResponses] = useState({startTimestamp: null, trial: []});
  const [trial, setTrial] = useState(null);
  const [step, setStep] = useState(null); // null, stimuli, fixation, feedback
  const [clock, setClock] = useState(null);

  useEffect(() => {
    showStudyNav(false);
  });

  // when finished, store responses and proceed to the next view
  useEffect(() => {
    if (finished) {
      clearInterval(clock);
      onFinish();
      onStore(responses);
      showStudyNav(true);
    }
  }, [finished]);
  

  const fixation = () => {
    setStep('fixation');
    setClock(
      setInterval(() => {
        stimuli();
      }, fixationDuration)
    );
  }
  const stimuli = () => {
    setStep('stimuli');
    setClock(
      setInterval(() => {
        feedback();
      }, feedbackDuration)
    );
  }

  const feedback = () => {
    setStep('feedback');
    setClock(
      setInterval(() => {
        fixation();
      }, 1000)
    );
  }

  const startTask = () => {
    setTrial(1);
    fixation();
  }



  const handleResponse = (choice) => {
    clearInterval(clock);
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
      <Grid container direction='column' spacing={2} justify="space-between" alignItems='stretch'>
        <Grid item>
          <Markdown source={text} escapeHtml={false} />
        </Grid>

        {step === 'stimuli' &&
          <Grid item container direction="row">
            <Grid item>
              <Image onClick={() => handleResponse(0)} src={`/public/${choices[0].value}.png`}/>
            </Grid>
            <Grid item><Divider /></Grid>
            <Grid item>
              <Image onClick={() => handleResponse(1)} src={`/public/${choices[1].value}.png`}/>
            </Grid>
          </Grid>
        }
        {step === 'feedback' && 
          <Grid item>Feedback</Grid>
        }
        {step === 'fixation' && 
          <Grid item>Fixation</Grid>
        }

      </Grid>
    );
  //} //.render()

}
