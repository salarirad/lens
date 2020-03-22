import React, {useState, useEffect, Fragment} from 'react';


import { Grid, Typography, Divider} from '@material-ui/core';

import Image from 'material-ui-image';

import {Markdown} from 'react-markdown';

import './gonogo.css';

export default function GoNoGo({content, onStore, onFinish, showStudyNav}) {

  const {text, trials, ISI, ITI, showFixation, choices, timeoutsBeforeForcedTerminate} = content;

  const [finished, setFinished] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [responses, setResponses] = useState([]);
  const [fixation, setFixation] = useState(false);
  const [trialPeriod, setTrialPeriod] = useState(0);

  useEffect(() => {
    showStudyNav(false);
    //TODO
    const interval = setInterval(() => {
      console.log(trialPeriod);
      setTrialPeriod(trialPeriod + 1);
    }, ISI);
    return () => clearInterval(interval);
  });

  // when finished, store responses and proceed to the next view
  useEffect(() => {
    if (finished) {
      onFinish();
      onStore(responses);
      showStudyNav(true);
    }
  }, [finished]);

  const select = () => {
    //TODO stop trial timer
    //TODO generate response and append it to the state
    //TODO show fixation and start a timer for a new trial
    //TODO trial++ and start a new trial
  }

  //const render = () => {
    return (
      <Grid container direction='column' spacing={2} justify="space-between" alignItems='stretch'>
        <Grid item>
          <Markdown source={text} escapeHtml={false} />
        </Grid>

        {trialPeriod === 0 &&
          <Grid item container direction="row">
            <Grid item>
              <Image onClick={() => select(0)} src={`/public/${choices[0].value}.png`}/>
            </Grid>
            <Grid item><Divider /></Grid>
            <Grid item>
              <Image onClick={() =>select(1)} src={`/public/${choices[1].value}.png`}/>
            </Grid>
          </Grid>
        }
        {trialPeriod === 1 && 
          <Grid item>Feedback</Grid>
        }
        {trialPeriod === 2 && 
          <Grid item>Fixation</Grid>
        }

      </Grid>
    );
  //} //.render()

}
