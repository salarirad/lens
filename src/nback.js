import React, { useRef, useEffect, useState, Fragment } from 'react';
import { Button, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown/with-html';
import { 
  Star, 
  RadioButtonUnchecked as Circle,
  CheckBoxOutlineBlank as Rectangle,
  ChangeHistory as Triangle,
  PanTool as Hand,
  SportsSoccer as Ball,
  Watch,
  School,
  FreeBreakfast as Cup,
  Add,
  Block,
  Check as Correct,
  Clear as Incorrect
} from '@material-ui/icons';
import { shuffle } from './utils/random';

//FIXME these are realtime variables, so I keep them out of the component's state.
let clock

export default function NBack({content, onStore, onValidate}) {
  //props: title, text
  
  const { t } = useTranslation();

  const { text, trials, stimuliDuration, fixationDuration, feedbackDuration, nback, figures } = content;

  const components = {
    star: Star,
    circle: Circle,
    triangle: Triangle,
    rectangle: Rectangle,
    hand: Hand,
    ball: Ball,
    watch: Watch,
    school: School,
    cup: Cup
  };

  const response = useRef(null);
  const [state, setState] = useState({
    finished: false,
    trial: null,
    step: null,
    trialResponses: [],
    taskStartedAt: Date.now(),
    respondedAt: null,
    stimuli: null
  });

  useEffect(() => {
    /**
     * callback to handle keypress events
     */
    const handleKeyPress = (event) => {
      const { key, keyCode } = event;

      // ignore invalid keys and invalid trial steps
      if (state.step !== 'stimuli' || !(keyCode === 32 || key === ' '))
        return;

      const current = state.stimuli[state.trial - 1];
      handleResponse(current);
    }
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };

  },[state]);

  useEffect(() => {
    // generate stimuli stream
    if (state.stimuli===null) {
      let stim = [...Array(trials).keys()].map((i,t) => {
        return figures[i < figures.length ? i : i % figures.length ]
      });
      console.log(stim);
      setState({...state, stimuli: shuffle(stim)});
    }
  },[state]);

  useEffect(() => {
    // # FIXATION
    if (state.step === 'fixation') {
      clearTimeout(clock);
      clock = setTimeout(() => {
        setState({
          ...state,
          trial: state.trial + 1,
          trialStartedAt: Date.now(),
          step: 'stimuli'
        });
      }, fixationDuration);
    }

    // # FEEDBACK
    if (state.step === 'feedback') {
      clearTimeout(clock);


      // if(state.choice[state.trial-1]===null){
      //   const _correct = state.trial>nback ? state.stimuli[state.trial - 1] !== state.stimuli[state.trial - (nback+1)] : true;
      //   const respondedAt = Date.now();
      //   setState({
      //     ...state,
      //     correct: _correct,
      //     respondedAt: respondedAt,
      //     trialResponses: [...state.trialResponses, {
      //       'trial': state.trial,
      //       'stimuli': state.stimuli[state.trial - 1],
      //       'choice': "no-action",
      //       'correct': _correct,
      //       'respondedAt': respondedAt,
      //       'trialStartedAt': state.trialStartedAt,
      //       'rt': respondedAt - state.trialStartedAt
      //     }]
      //   });    
      // } 

      clock = setTimeout(() => {
        setState({ ...state, step: 'fixation' })
      }, feedbackDuration)
    }

    if (state.step === 'stimuli') {
      clearTimeout(clock); 

      clock = setTimeout(() => {
        setState({
          ...state,
          trialResponses: [...state.trialResponses, {
            'trial': state.trial,
            'stimuli': state.stimuli[state.trial - 1],
            'choice': null,
            'correct': null,
            'respondedAt': null,
            'trialStartedAt': state.trialStartedAt,
            'rt': null
          }],
          timeouts: state.timeouts + 1,
          correct: false,
          step: (feedbackDuration > 0) ? 'feedback' : 'fixation'
        });
      }, stimuliDuration)
    }

    if (state.trial > trials.total) {
      console.log('------------ FINISHED -------')
      setState({ ...state, finished: true, taskFinishedAt: Date.now() })
    }

    // on finish
    if (state.finished) {
      clearTimeout(clock);

      // timestamps
      let response = { trials: state.trialResponses };
      response.taskStartedAt = state.taskStartedAt;
      response.taskFinishedAt = state.taskFinishedAt;
      response.taskDuration = state.taskFinishedAt - state.taskStartedAt;
      onStore({
        'view': content,
        'response': response
      }, true); // store + next
    }

  }, [state] );

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

  const handleResponse = (selected) => {
    const respondedAt = Date.now(); //timestamp
    clearTimeout(clock);
    const _correct = state.trial>nback ? state.stimuli[state.trial - 1]===state.stimuli[state.trial - (nback+1)] : true;

    setState({
      ...state,
      correct: _correct,
      respondedAt: respondedAt,
      trialResponses: [...state.trialResponses, {
        'trial': state.trial,
        'stimuli': state.stimuli[state.trial - 1],
        'choice': selected,
        'correct': _correct,
        'respondedAt': respondedAt,
        'trialStartedAt': state.trialStartedAt,
        'rt': respondedAt - state.trialStartedAt
      }],
      step: (feedbackDuration > 0) ? 'feedback' : 'fixation'
    });
  }

  const renderFigure = (figure) => {
    if(!components[figure]){
      console.log('renderFigure: ',figure);
      return(
        <Grid item container direction='row' justifyContent='space-around' alignItems='center'>
          <div onClick={() => handleResponse('block')} className='single-stimulus'> <Block fontSize='large' className='yellow ts-icon' /> </div>
        </Grid>
      );
    }
    const FigureCompoentnt = components[figure];
    return(
      <Grid item container direction='row' justifyContent='space-around' alignItems='center'>
        <div onClick={() => handleResponse(figure)} className='single-stimulus'> <FigureCompoentnt fontSize='large' className='yellow ts-icon' /> </div>
      </Grid>
    )
  }

  const renderFeedback = () => {
    return (
      <Grid item container direction='row' justifyContent='space-around' alignItems='center'>
        {state.correct && <Correct fontSize='large' className='correct ts-icon' />}
        {!state.correct && <Incorrect fontSize='large' className='incorrect ts-icon' />}
      </Grid>
    )
  }

  const renderFixation = () => {
    return (
      <Grid item container direction="row" justifyContent="space-around" alignItems="center">
        <Add fontSize='large' className='fixation ts-icon' />
      </Grid>
    );
  }

  // start screen
  if (state.trial === null) {
    return (
      <Grid container direction='column' spacing={2} alignItems='center' justifyContent='flex-start' className='Text-container'>
        <Grid item><Markdown source={t('nback.are_you_ready')} escapeHtml={false} className='markdown-text' /></Grid>
        <Grid item>
          <Button variant='outlined' onClick={() => startTask()}>{t('nback.start')}</Button>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container direction='column' spacing={2} alignItems='stretch' justifyContent='flex-start' className='nback-container'>
      <Grid item>
        <Markdown source={t(content.text)} escapeHtml={false} className='markdown-text' />
      </Grid>
      
      {state.step === 'stimuli'  && renderFigure(state.stimuli[state.trial-1])}
      {state.step === 'feedback' && renderFeedback()}
      {state.step === 'fixation' && renderFixation()}

    </Grid>
  );
}
