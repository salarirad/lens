import React, {useState, useEffect, Fragment} from 'react';

import {Button, Grid, Toolbar, AppBar, Typography} from '@material-ui/core';

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

  useEffect(() => {
    if (finished) {
      onFinish();
      onStore(responses);
      showStudyNav(true);
    }
  }, [finished]);

  // round changed
  const newRound = (cashed, explosionProbability) => {
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
  
  return (
    <Fragment>
      <AppBar position="relative">
      <Toolbar disableGutters variant='dense'>
            <Typography variant="h6">
              <span>Round Score: {pumps * reward}</span>
            </Typography>
            <Typography variant="h6">
              <span>Total Score: {totalScore}</span>
            </Typography>
      </Toolbar>
      
      </AppBar>
      
      <Grid container direction="column">
        <div direction="column" layout-align="center center">
          <div className="bubble-container"> {/* set baloon size */}
            <figure className="bubble"></figure>
          </div>
        </div>
      </Grid>
      <Grid container direction="row" justify="space-around">
        <Button onClick={onInflate}>Inflate</Button>
        <Button disabled>
          Round {round} of {rounds}
        </Button>
        <Button onClick={onCashIn}>Cash In</Button>
      </Grid>
    </Fragment>
  );

}
