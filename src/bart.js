import React, {useState, useEffect, Fragment} from 'react';

import {Button, Fab, Grid, Typography, Divider} from '@material-ui/core';

import {Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent} from '@material-ui/core';

import { useTranslation } from 'react-i18next';

import './bart.css';

export default function BART({content, onStore, onFinish, showStudyNav}) {
  
  useEffect(() => {
    showStudyNav(false);
  });

  const { t } = useTranslation();
  const {reward, maxPumps, initialPumps, trials} = content;

  const [pumps, setPumps] = useState(0);
  const [finished, setFinished] = useState(false);
  const [trial, setTrial] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [responses, setResponses] = useState([]);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  // when finished, store responses and proceed to the next view
  useEffect(() => {
    if (finished && !dialogIsOpen) {
      onFinish();
      onStore(responses);
      showStudyNav(true);
    }
  }, [finished, dialogIsOpen]);

  /**
   * Store trial responses, then proceed to the next trial or finish the game
   * @param {*} cashed either cashed or exploded
   * @param {*} explosionProbability last probability of balloon getting exploded
   */
  const newTrial = (cashed, explosionProbability) => {
    setDialogIsOpen(true);

    setResponses(responses.concat([{
      trial: trial,
      risk: 100 / (maxPumps - pumps + 1),
      pumps: pumps,
      explosionProbability: explosionProbability,
      score: cashed? pumps * reward : 0,
      result: cashed? "cashed" : "exploded"
    }]));

    setFinished(trial >= trials);
    setPumps(0);  
    setTrial(trial+1);
  }

  /**
   * action to inflate the baloon
   */
  const onInflate = () => {

    let risk = 100 / (maxPumps - pumps + 1);
    let prob = Math.ceil(Math.random() * 100);

    if ((prob >= risk) && pumps > initialPumps) {
      newTrial(false, prob);
    } else {
      setPumps(pumps+1);
    }
  };

  /**
   * action to cash in the reward
   */
  const onCashIn = () => {
    let score = pumps * reward;
    setTotalScore(totalScore + score);
    newTrial(true);
  };
  
  let bubbleStyle = {
    width: (pumps+1) * 20,
    height: (pumps+1) * 20,
    transition: (pumps===0)?'':'width 1s, height 1s' //explosition and pumping effects
  };

  /**
   * render a dialog that shows trial summary.
   */
  const renderDialog = () => {
    return (
    <Dialog
      open={dialogIsOpen}
      onClose={() => setDialogIsOpen(false)}
      disableBackdropClick
      disableEscapeKeyDown
      aria-labelledby="dialog-title"
    >
        <DialogTitle id="dialog-title"><b>{responses[responses.length - 1].result==='cashed'?t('bart.cashed_title'):t('bart.exploded_title')}</b></DialogTitle>
        <DialogContent>
          <DialogContentText>
          {t('bart.trial_score_report', {score: responses[responses.length - 1].score})}
          {t('bart.total_score_report', {score: responses.map(r => r.score).reduce((a,b) => a+b, 0)})}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogIsOpen(false)} color="primary" autoFocus size='large'>
            {trial<=trials?t('bart.next_trial'):t('next')}
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
        {dialogIsOpen && renderDialog()}
  
        <Grid container direction='column' spacing={2} justify="space-between" alignItems='stretch'>
  
        <Grid item container direction='row' justify="space-around" alignItems='center'>
  
          {trial<=trials && 
            <Grid item><Grid container direction='column' justify="space-around" alignItems='center'>
              {t('bart.next_reward')}<Typography variant="h4">{pumps * reward}</Typography>
            </Grid></Grid>
          }
  
          {trial<=trials && 
            <Grid item><Grid container direction='column' justify="space-around" alignItems='center'>
                <Typography color='textSecondary' variant='caption'>{t('bart.trial_label',{trial:trial, trials:trials})}</Typography>
            </Grid></Grid>
          }
  
            <Grid item><Grid container direction='column' justify="space-around" alignItems='center'>
              {t('bart.total_points')}<Typography variant="h4">{totalScore}</Typography>
            </Grid></Grid>
        </Grid>
  
        <Grid item><Divider /></Grid>

  
        <Grid item container direction="column" alignContent='center'> 
          <div className="bubble-container" style={bubbleStyle}>
            <figure className="bubble"></figure>
          </div>
        </Grid>

        <Grid item container direction="row" justify="space-around" alignItems='center'>
          <Fab onClick={onInflate} color='primary'>{t('bart.pump')}</Fab>
          <Fab onClick={onCashIn} color='primary'>{t('bart.cash')}</Fab>
        </Grid>
  
  
        </Grid>
      </Fragment>
  
    );
  //} //.render()

}
