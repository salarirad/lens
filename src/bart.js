import React, {useState, useEffect, Fragment} from 'react';

import {Button, Fab, Grid, Typography, Divider} from '@material-ui/core';

import {Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent} from '@material-ui/core';

/*TODO
state = {
  totalScore: 0.0,
  pumps: 0,
  round: 1,
  roundScore: 0,
  isFinished: false,
  cashed: false,
  explosionProbability: 0
  responses: {
  },
  baloonTransition: 'all 0.5s ease-out'
}

props.reward
props.maxPumps
props.initialPumps
props.onFinish
props.rounds
*/

import './bart.css';

export default function BART({content, onStore, onFinish, showStudyNav}) {
  
  useEffect(() => {
    showStudyNav(false);
  });

  const {reward, maxPumps, initialPumps, rounds} = content;

  const [pumps, setPumps] = useState(0);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [responses, setResponses] = useState([]);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  useEffect(() => {
    if (finished && !dialogIsOpen) {
      onFinish();
      onStore(responses);
      showStudyNav(true);
    }
  }, [finished, dialogIsOpen]);

  // round changed
  const newRound = (cashed, explosionProbability) => {

    setDialogIsOpen(true);

    setResponses(responses.concat([{
      round: round,
      risk: 100 / (maxPumps - pumps + 1),
      pumps: pumps,
      explosionProbability: explosionProbability,
      score: cashed? pumps * reward : 0,
      result: cashed? "cashed" : "exploded"
    }]));

    setFinished(round >= rounds);
    setPumps(0);  
    setRound(round+1);
  }

  // inflate
  const onInflate = () => {

    let risk = 100 / (maxPumps - pumps + 1);
    let prob = Math.ceil(Math.random() * 100);

    if ((prob >= risk) && pumps > initialPumps) {
      newRound(false, prob);
    } else {
      setPumps(pumps+1);
    }
  };

  const onCashIn = () => {
    let score = pumps * reward;
    setTotalScore(totalScore + score);
    newRound(true);
  };
  
  let bubbleStyle = {
    width: (pumps+1) * 20,
    height: (pumps+1) * 20,
    transition: (pumps===0)?'':'width 1s, height 1s' //explosition and pumping effects
  };

  const renderDialog = () => {
    return (
    <Dialog
      open={dialogIsOpen}
      onClose={() => setDialogIsOpen(false)}
      disableBackdropClick
      disableEscapeKeyDown
    >
        <DialogTitle >{responses[responses.length - 1].result=='cashed'?'You Cashed!':'Balloon Exploded!'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
          You are rewarded with {responses[responses.length - 1].score} points.
          In total you have {responses.map(r => r.score).reduce((a,b) => a+b, 0)} points.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogIsOpen(false)} color="primary" autoFocus>
            {responses.length<=rounds?'Continue':'Finish'}
          </Button>
        </DialogActions>
      </Dialog>);
  }

  return (
    <Fragment>
      {dialogIsOpen && renderDialog()}

      <Grid container direction='column' spacing={2} justify="space-between" alignItems='stretch'>

      <Grid item container direction='row' justify="space-around" alignItems='center'>

          <Grid item><Grid container direction='column' justify="space-around" alignItems='center'>
            Next Reward<Typography variant="h4">{pumps * reward}</Typography>
          </Grid></Grid>

          <Grid item><Grid container direction='column' justify="space-around" alignItems='center'>
            <Button disabled variant='text'>
              Round {round} of {rounds}
            </Button>
          </Grid></Grid>

          <Grid item><Grid container direction='column' justify="space-around" alignItems='center'>
            Total Points<Typography variant="h4">{totalScore}</Typography>
          </Grid></Grid>
      </Grid>

      <Grid item><Divider /></Grid>

      <Grid item container direction="row" justify="space-around" alignItems='center'>
        <Fab onClick={onInflate} color='primary'>Pump</Fab>
        <Fab onClick={onCashIn} color='primary'>Cash</Fab>
      </Grid>

      <Grid item container direction="column" alignContent='center'> 
        <div className="bubble-container" style={bubbleStyle}>
          <figure className="bubble"></figure>
        </div>
      </Grid>


      </Grid>
    </Fragment>

  );

}
