import React from 'react';

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

export default function BART(props) {
  
  const inflat = () => {
    setRoundReward((pumps - props.initialPumps + 1) * props.reward);
    setPumps(pumps+1);
    setExplosionProbability(Math.ceil(Math.random() * 100));
  
    useEffect(() => {
      risk = 100 / (props.maxPumps - pumps + 1)
      if ((explosionProbability < risk) && pumps > initialPumps) {
        explode();
      }
    }, [pumps, roundScore, explosionProbability]);
  
    if ((random < risk) && this.pumps > this.initialPumps) {
      this.explode();
    }
  
  }
  
  const nextRound = () => {
    this.setResponses(responses.concat([{
      round: round,
      risk: 100 / (props.maxPumps - pumps + 1),
      pumps: pumps - props.initialPumps,  //`pump` here is not the same as `state.pumps`! It's just for reporting.
      explosionProbability: explosionProbability,
      score: roundScore,
      result: cashed? "cashed" : "exploded"
    }]));

    this.setResponses(_responses);

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
  
  const explode = () => {
    setRoundScore(0);
    setCashed(false);
    setPumps(props.initialPumps);
  
    useEffect(() => {
      nextRound();
    }, [roundScore, pumps])
  }
  
  const cashIn = () => {
    setTotalScore(totalScore + roundScore);
    setCashed(true);
  
    useEffect(() => {
      nextRound();
    }, [totalScore, cashed]);
  }
  
  const showScore = () => {
    // set ScoreModel button text to "Next" or "Finish"
    // if "finished" call props.onFinish
  }

}



<md-toolbar layout="column" layout-align="center center">
  <div class="md-toolbar-tools" flex layout="row" layout-align="space-around center">
        <div>
          <span md-colors="{color: 'amber'}" class="md-caption">{{'bart.successful_pumps' | translate}}</span>
          <span class="md-title">{{$ctrl.pumps-$ctrl.initialPumps | number: 0 | persianDigits}}</span>
        </div>
        <div>
          <span md-colors="{color: 'amber'}" class="md-caption">{{'bart.total_score' | translate}}</span>
          <span class="md-title">{{$ctrl.total | number | persianDigits}}</span>
        </div>
  </div>

</md-toolbar>

<md-content flex layout="column" layout-align="end center" class="bottom-fabs">
    <div flex layout="column" layout-align="center center">
      <div class="ui basic stage segment" ng-style="$ctrl.balloonSize">
        <figure class="ball bubble"></figure>
      </div>
    </div>
    <div flex="none"></div>
    <md-button class="md-primary md-fab md-fab-bottom-right" ng-hide="$ctrl.isFinished" ng-click="$ctrl.inflate()">{{'bart.inflate_button' | translate}}</md-button>
    <md-button md-no-ink ng-disabled="true" class="md-fab-bottom-center" style="padding-bottom:30px">
      {{'bart.round' | translate}} {{$ctrl.toBePrintedRound | number | persianDigits}} {{'bart.of' | translate}} {{$ctrl.element.rounds | number | persianDigits}}
    </md-button>
    <md-button class="md-fab md-fab-bottom-left" ng-hide="$ctrl.isFinished" ng-click="$ctrl.cashIn()">{{'bart.cash_in_button' | translate}}</md-button>
</md-content>
