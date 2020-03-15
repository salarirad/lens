import React, {useState, useEffect, Fragment} from 'react';


import {Button, Fab, Grid, Typography, Divider} from '@material-ui/core';

import './gonogo.css';


export default function GoNoGo({content, onStore, onFinish, showStudyNav}) {

  const [finished, setFinished] = useState(false);
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
      <div>go/nogo is not implemented yet...
        <Button onClick={() => setFinished(true)}>Next</Button>
      </div>
    );
  }

  return render();
}
