import React, {useState, useEffect, Fragment} from 'react';

import {Button, Grid} from '@material-ui/core';

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

export default function BART({content, onFinish}) {
  
  const {reward, maxPumps, initialPumps, rounds} = content;

  const [pumps, setPumps] = useState(0);
  const [finished, setFinished] = useState(false);
  const [cashed, setCashed] = useState(false);
  const [round, setRound] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [explosionProbability, setExplosionProbability] = useState(0);
  const [responses, setResponses] = useState([]);

  const inflate = () => {
    setPumps(pumps+1);
    setExplosionProbability(Math.ceil(Math.random() * 100));
  }

  useEffect(() => {
    let risk = 100 / (maxPumps - pumps + 1)
    if ((explosionProbability < risk) && pumps > initialPumps) {
      explode();
    }
  }, [pumps, explosionProbability, maxPumps, initialPumps]);
  
  // rounds is updated
  useEffect(() => {
    if (round > rounds) {
      setFinished(true);
      finish();
    }
  }, [round, rounds]);

  const nextRound = () => {
    setResponses(responses.concat([{
      round: round,
      risk: 100 / (maxPumps - pumps + 1),
      pumps: pumps - initialPumps,  //`pump` here is not the same as `state.pumps`! It's just for reporting.
      explosionProbability: explosionProbability,
      score: roundScore,
      result: cashed? "cashed" : "exploded"
    }]));

    setRound(round+1);
    setPumps(initialPumps);
  }
  
  const explode = () => {
    setRoundScore(0);
    setCashed(false);
    setPumps(initialPumps);
  }

  const cashIn = () => {
    setTotalScore(totalScore + roundScore);
    setCashed(true);
    nextRound();
  }

  const finish = () => {
    onFinish(responses);
    //TODO
  }
  
  const showScore = () => {
    // set ScoreModel button text to "Next" or "Finish"
    // if "finished" call props.onFinish
  }

  return (
    <Fragment>
      <md-toolbar layout="column" layout-align="center center">
      <Grid container direction="row" layout-align="space-around center">
            <div>
              <span>Round Score</span>
              <span>{roundScore}</span>
            </div>
            <div>
              <span>Total Score</span>
              <span>{totalScore}</span>
            </div>
      </Grid>
      
      </md-toolbar>
      
      <Grid container direction="column">
        <div direction="column" layout-align="center center">
          <div className="bubble-container"> {/* set baloon size */}
            <figure className="bubble"></figure>
          </div>
        </div>
      </Grid>
      <Grid container direction="row" justify="space-around">
        <Button onClick={inflate}>Inflate</Button>
        <Button disabled>
          Round {round} of {rounds}
        </Button>
        {! finished &&
          <Button onClick={cashIn}>Cash In</Button>
        }
      </Grid>
    </Fragment>
  );

}
