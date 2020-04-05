import React, {useEffect, useState, useRef} from 'react';

import {Grid, Radio, RadioGroup, FormControlLabel, Divider} from '@material-ui/core';

import Markdown from 'react-markdown';
import {useTranslation} from 'react-i18next';

export default function Matrix({content, onStore}) {

  const {t} = useTranslation();
  const {questions, choices, id} = content;

  const response = useRef({
    values: Array.from({ length: questions.length })
  });

  useEffect(() => {
    return () => {
      onStore({
        'view': content,
        'response': response.current
      })
    };
  },[]);

  
  const renderChoice = (c, index) => {
    return (
      <Grid item xs key={index}>
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
    response.current.values[index] = e.target.value;
  }

  const renderQuestion = (q, index) => {
    return (
      <RadioGroup key={index} name={`q${index}`} value={response.current.values[index]} onChange={(e) => handleChange(e, index)}>
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
