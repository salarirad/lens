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
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [responses, setResponses] = useState([]);


  // round changed
  const newRound = (cashed, explosionProbability) => {
    setResponses(responses.concat([{
      round: round,
      risk: 100 / (maxPumps - pumps + 1),
      pumps: pumps - initialPumps,  //`pump` here is not the same as `state.pumps`! It's just for reporting.
      explosionProbability: explosionProbability,
      score: cashed? (maxPumps - pumps + 1) * reward : 0,
      result: cashed? "cashed" : "exploded"
    }]));

    setFinished(round >= rounds);
    setPumps(0);  
    setRound(round+1);

  }

  useEffect(() => {
    if (finished)
      onFinish(responses);
  }, [finished]);

  // inflate
  const onInflate = () => {
    console.log(`inflated`);
    let risk = 100 / (maxPumps - pumps + 1);
    let prob = Math.ceil(Math.random() * 100);

    console.log(prob, '>=', risk);

    if ((prob >= risk) && pumps > initialPumps) {
      newRound(false, prob);
    } else {
      setPumps(pumps+1);
    }
  };

  const onCashIn = () => {
    console.log(`cashed`);
    let score = pumps * reward;
    setTotalScore(totalScore + score);
    newRound(true);
  };
  
  return (
    <Fragment>
      <md-toolbar layout="column" layout-align="center center">
      <Grid container direction="row" layout-align="space-around center">
            <div>
              <span>Round Score</span>
              <span>{pumps * reward}</span>
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
        <Button onClick={onInflate}>Inflate</Button>
        <Button disabled>
          Round {round} of {rounds}
        </Button>
        {! finished &&
          <Button onClick={onCashIn}>Cash In</Button>
        }
      </Grid>
    </Fragment>
  );

}
