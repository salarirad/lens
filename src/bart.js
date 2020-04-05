import React, {useState, useEffect, Fragment, useRef} from 'react';

import {Button, Fab, Grid, Typography, Divider} from '@material-ui/core';

import {Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent} from '@material-ui/core';

import { useTranslation } from 'react-i18next';

import './bart.css';

export default function BART({content, onStore, onNext, showStudyNav}) {
  
  const { t } = useTranslation();
  const {reward, maxPumps, safePumps, trials} = content;

  const response = useRef({})
  const [state, setState] = useState({
    pumps: 0,
    finished: false,
    trial: 1,
    totalScore: 0,
    trialResponses: [],
    dialogIsOpen: false,
    taskStartedAt: Date.now()
  });

  // on mount and unmount
  useEffect(() => {
    showStudyNav(false);
    return () => {
      showStudyNav(true);
      onStore({
        'view': content,
        'response': response.current
      });
    }
  },[]);
  
  // when finished, store responses and proceed to the next view
  useEffect(() => {
    if (state.finished && !state.dialogIsOpen) {
      const now = Date.now()
      // add timestamps
      response.current.trials = state.trialResponses;
      response.current.taskStartedAt = state.taskStartedAt;
      response.current.taskFinishedAt = now;
      response.current.taskDuration = now - state.taskStartedAt;
      onNext();
    }
  }, [state]);

  /**
   * Store trial responses, then proceed to the next trial or finish the game
   * @param {*} cashed either cashed or exploded
   * @param {*} explosionProbability last probability of balloon getting exploded
   */
  const newTrial = (cashed, explosionProbability) => {
    setState({
      ...state, 
      dialogIsOpen: true,
      trialResponses: [...state.trialResponses, {
        trial: state.trial,
        risk: 100 / (maxPumps - state.pumps + 1),
        pumps: state.pumps,
        explosionProbability: explosionProbability,
        score: cashed? state.pumps * reward : 0,
        result: cashed? "cashed" : "exploded"
      }],
      finished: (state.trial>=trials),
      pumps: 0,
      trial: state.trial+1,
      totalScore: state.totalScore + (cashed?state.pumps*reward:0)
    });
  }

  /**
   * action to inflate the baloon
   */
  const onInflate = () => {

    let risk = 100 / (maxPumps - state.pumps + 1);
    let prob = Math.ceil(Math.random() * 100);

    console.log(risk, prob)
    if ((prob <= risk) && state.pumps > safePumps) {
      newTrial(false, prob);
    } else {
      setState({
        ...state,
        pumps: state.pumps+1
      });
    }
  };

  /**
   * action to cash in the reward
   */
  const onCashIn = () => {
    newTrial(true);
  };
  
  /**
   * render a dialog that shows trial summary.
   */
  const renderDialog = () => {
    return (
    <Dialog
      open={state.dialogIsOpen}
      onClose={() => setState({...state, dialogIsOpen: false})}
      disableBackdropClick
      disableEscapeKeyDown
      aria-labelledby="dialog-title"
    >
        <DialogTitle id="dialog-title"><b>{state.trialResponses[state.trialResponses.length - 1].result==='cashed'?t('bart.cashed_title'):t('bart.exploded_title')}</b></DialogTitle>
        <DialogContent>
          <DialogContentText>
          {t('bart.trial_score_report', {score: state.trialResponses[state.trialResponses.length - 1].score})}
          {t('bart.total_score_report', {score: state.trialResponses.map(r => r.score).reduce((a,b) => a+b, 0)})}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setState({...state, dialogIsOpen: false})} color="primary" autoFocus size='large'>
            {state.trial<=trials?t('bart.next_trial'):t('next')}
          </Button>
        </DialogActions>
      </Dialog>);
  }

  /**
   * Render BART component (main render)
   */
  //const render = () => {
    return (
      <Fragment>
        {state.dialogIsOpen && renderDialog()}
  
        <Grid container direction='column' spacing={2} justify="space-between" alignItems='stretch'>
  
        <Grid item container direction='row' justify="space-around" alignItems='center'>
  
          {state.trial<=trials && 
            <Grid item><Grid container direction='column' justify="space-around" alignItems='center'>
              {t('bart.next_reward')}<Typography variant="h4">{state.pumps * reward}</Typography>
            </Grid></Grid>
          }
  
          {state.trial<=trials && 
            <Grid item><Grid container direction='column' justify="space-around" alignItems='center'>
                <Typography color='textSecondary' variant='caption'>{t('bart.trial_label',{trial:state.trial, trials:trials})}</Typography>
            </Grid></Grid>
          }
  
            <Grid item><Grid container direction='column' justify="space-around" alignItems='center'>
              {t('bart.total_points')}<Typography variant="h4">{state.totalScore}</Typography>
            </Grid></Grid>
        </Grid>
  
        <Grid item><Divider /></Grid>

        <Grid item container direction="row" justify="space-around" alignItems='center'>
          <Fab onClick={onInflate} color='primary'>{t('bart.pump')}</Fab>
          <Fab onClick={onCashIn} color='primary'>{t('bart.cash')}</Fab>
        </Grid>

        
        <Grid item container direction="column" alignContent='center'> 
          <div className="bubble-container" style={{
            width: (state.pumps+1) * 20,
            height: (state.pumps+1) * 20,
            transition: (state.pumps===0)?'':'width 1s, height 1s' //explosition and pumping effects
          }}>
            <figure className="bubble"></figure>
          </div>
        </Grid>
  
  
        </Grid>
      </Fragment>
  
    );
  //} //.render()

}
