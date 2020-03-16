import React, {useState, useEffect, Fragment} from 'react';


import {Button, Fab, Grid, Typography, Divider} from '@material-ui/core';

import './gonogo.css';

export default function GoNoGo({content, onStore, onFinish, showStudyNav}) {

  const {trials, fixationDuration, choices, trainingTrials, maxTimeoutTrials} = content;

  const [finished, setFinished] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    showStudyNav(false);
  });

  // when finished, store responses and proceed to the next view
  useEffect(() => {
    if (finished) {
      onFinish();
      onStore(responses);
      showStudyNav(true);
    }
  }, [finished]);

  const render = () => {
    return (
      <Grid direction='column'>
        <Grid>
          {props.content.text}
        </Grid>
        <Grid direction='row'>
          <Grid></Grid>
          <Grid><Divider />or fixation:<Button onClick={() => setFinished(true)}>Next</Button></Grid>
          <Grid></Grid>
        </Grid>
      </Grid>
    );
  }

  return render();
}
