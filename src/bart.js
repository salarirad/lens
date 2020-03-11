import React from 'react';

/*TODO
state = {
  totalScore: 0.0,
  pumps: 0,
  round: 1,
  currentRoundScore: 0,
  isFinished: false,
  cashedIn: false,
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

export default function BART(props) {
  
  const inflat = () => {
    setCurrentRoundReward((pumps - props.initialPumps + 1) * reward);
    setPumps(pumps+1);
  
    useEffect(() => {
      //TODO store random and risk in state
      random = getRandomInt(0,100);
      risk = 100 / (props.maxPumps - pumps + 1),
      
      _responses = responses.concat([{
        round: round,
        risk: risk,
        pumps: pumps - props.initialPumps,
        random: random,
        score: currentRoundScore
      }]);
  
      this.setResponses(_responses);
  
      if ((random < risk) && pumps > initialPumps) {
        explode();
      }
  
    }, [pumps, currentRoundScore]);
  
    if ((random < risk) && this.pumps > this.initialPumps) {
      this.explode();
    }
  
  }
  
  const nextRound = () => {
    //TODO store response
    setRound(round+1);
    setPumps(props.initialPumps);
  
    // rounds is updated
    useEffect(() => {
      if (this.round > props.rounds) {
        this.setFinished(true);
        this.finish();
      }  
    }, [round, pumps]);
  
  }
  
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  const explode = () => {
    setExploded(true);
    setCurrentRoundScore(0);
    setCashedIn(false);
    setPumps(props.initialPumps);
  
    useEffect(() => {
      nextRound();
    }, [exploded, currentRoundScore, pumps])
  }
  
  const cashIn = () => {
    setTotalScore(totalScore + currentRoundScore);
    setCashedIn(true);
  
    useEffect(() => {
      nextRound();
    }, [totalScore, cashedIn]);
  }
  
  const showScore = () => {
    // set ScoreModel button text to "Next" or "Finish"
    // if "finished" call props.onFinish
  }

}

