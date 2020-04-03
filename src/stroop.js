import React, {useState, useEffect, Fragment} from 'react';


import { Box, Button, Grid, Typography, Divider} from '@material-ui/core';

import { 
  Add,
  Check as Correct,
  Clear as Incorrect
} from '@material-ui/icons';

import Image from 'material-ui-image';

import Markdown from 'react-markdown';


import './stroop.css';

//FIXME these are realtime variables, so I keep them out of the component's state.
let taskStartedAt, taskFinishedAt, trialStartedAt, stimuliAt, respondedAt

export default function Stroop({content, onStore, onFinish, showStudyNav}) {

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
    if (trial>=trials.length) {
      taskFinishedAt = Date.now(); //timestamp
      setTimeout(() => {
        setFinished(true);
      }, feedbackDuration);
    }

  }, [trial])
  

  const showFixation = () => {
    setStep('fixation');
    setTrial(t => t+1);
    clearTimeout(clock);

    trialStartedAt = Date.now(); //timestamp

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

    let crt = true //(choice.word === trial[].color)
    setCorrect(crt)

    responses.trials.push({
      'trial': trial,
      'stimulus': trials[trial-1],
      'choice': choice,
      'correct': crt,
      'respondedAt': respondedAt,
      'trialStartedAt': trialStartedAt,
      'stimuliAt': stimuliAt,
      'rt': respondedAt - stimuliAt
    });

    setResponses(responses)

    showFeedback();
  }

  const renderStimulus = (stimulus) => {
    let [word, color] = stimulus.split(',')
    return (
      <Grid container item direction='column' alignItems='center' justify='flex-start'>
      <Typography className='stroop-stimulus' variant='h1' style={{color: color}}>
        {word}
      </Typography>
      </Grid>

    );
  }

  const renderChoices = (choices) => {
    
    return (
      <Grid item container direction='row' justify='space-around' alignItems='stretch'>
      {choices.map((choice,i) => {
        let [word, color] = choice.split(',')
        return (
          <Box width='49%'>
          <Button key={i} style={{color: color}} onClick={() => handleResponse(choice)} size="large" fullWidth variant='text'>
            {word}
          </Button>
          </Box>
        );
      })}
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
      <Grid container direction='column' spacing={2} alignItems='center' justify='flex-start'>
        <Grid item><Markdown source="Are you ready?" escapeHtml={false} /></Grid>
        <Grid item>
          <Button onClick={() => startTask()}>Yes</Button>
        </Grid>

      </Grid>
    )
  }

  //const render = () => {
    return (
        <Grid item container direction='column' spacing={2} alignItems='stretch' justify='flex-start' className='Text-container stroop-board'>
          <Grid item>
            <Markdown source={text} escapeHtml={false} />
          </Grid>

          {step === 'stimuli' && renderStimulus(trials[trial-1].stimulus) }
          {step === 'stimuli' && renderChoices(trials[trial-1].choices) }

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
