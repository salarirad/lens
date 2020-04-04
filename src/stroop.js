import React, {useState, useEffect, Fragment} from 'react';


import { Box, Button, Grid, Typography, Divider} from '@material-ui/core';

import { 
  Add,
  Check as Correct,
  Clear as Incorrect,
} from '@material-ui/icons';

import Image from 'material-ui-image';

import Markdown from 'react-markdown';


import './stroop.css';

//FIXME these are realtime variables, so I keep them out of the component's state.
let clock

export default function Stroop({content, onStore, onFinish, showStudyNav}) {

  const {text, trials, stimulusDuration, fixationDuration, choices, timeoutsBeforeReset, feedbackDuration} = content;

  const [state, setState] = useState({
    trialResponses: [],
    finished: false,
    trial: null,
    step: null,
    correct: null
  })

  useEffect(() => {
    showStudyNav(false);
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

    } else if (state.step === 'stimulus') {
      console.log('stroop: stimulus');
      clearTimeout(clock);
      clock = setTimeout(() => {
        setState({
          ...state,
          step: 'feedback',
          trialResponses: [...state.trialResponses, {
            ...trials[state.trial-1], 
            trial: state.trial,
            choice: null,
            correct: null,
            respondedAt: null,
            trialStartedAt: state.trialStartedAt,
            rt: null}
          ]
        });
      }, stimulusDuration);
    } else if (state.step === 'feedback') {
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
      onFinish();

      // add timestamps
      let finalResponses = {trials:state.trialResponses};
      finalResponses.taskStartedAt = state.taskStartedAt;
      finalResponses.taskFinishedAt = state.taskFinishedAt;
      finalResponses.taskDuration = state.taskFinishedAt - state.taskStartedAt;

      onStore(finalResponses);
      showStudyNav(true);
    }

    if (state.trial>=trials.length) {
      setState({...state, taskFinishedAt: Date.now(), finished: true})
    }

  }, [state]);

  const startTask = () => {
    setState({
      ...state,
      trial:0,
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
        ...trials[state.trial-1],
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
          <Box width='49%' key={i} >
          <Button style={{color: color}} onClick={() => handleResponse(choice)} size="large" fullWidth variant='text'>
            {word}
          </Button>
          </Box>
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

  // start screen
  if (state.trial === null) {
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
