import React, {useEffect, useState, Fragment} from 'react';

import {Grid, Radio, RadioGroup, FormControlLabel, Divider} from '@material-ui/core';

import Markdown from 'react-markdown';
import {useTranslation} from 'react-i18next';

export default function Matrix({content, onStore}) {

  const {t} = useTranslation();
  const {questions, choices, id} = content;
  
  const [state, setState] = useState({
    responses: Array.from({ length: questions.length })
  });

  useEffect(() => {
    return () => { onStore(state.responses) };
  },[]);
  

  const renderChoice = (c, index) => {
    return (
      <Grid item xs>
        <FormControlLabel
          control={<Radio />}
          value={c}
          label={t(c)}
          labelPlacement="bottom"
        />
      </Grid>
    )
  }

  const handleChange = (e, index) => {
    let newResponses = state.responses;
    newResponses[index] = e.target.value;
    setState({...state,
      responses: newResponses
      })
    console.log(e.target.value, index);
  }

  const renderQuestion = (q, index) => {
    return (
      <RadioGroup name={`q${index}`} value={state.responses[index]} onChange={(e) => handleChange(e, index)}>
      <Markdown source={t(q)} escaleHtml/>
      <Grid container direction='row' alignItems='flex-start' justify="space-between">
        {choices.map((c, j) => renderChoice(c, j))}
      </Grid>
      <Divider />
      </RadioGroup>
    ) 
  }

  return (
    <div className="matrix-container">
    {questions.map((q,i) => renderQuestion(q,i))}
    </div>
  );
}
