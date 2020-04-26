import React, {useEffect, useState, useRef, Fragment} from 'react';

import {Grid, Radio, RadioGroup, FormControlLabel, Divider} from '@material-ui/core';

import Markdown from 'react-markdown/with-html';
import {useTranslation} from 'react-i18next';

export default function Matrix({content, onStore, onValidate}) {

  const {t} = useTranslation();
  const {questions, choices, direction, text } = content;

  const response = useRef({
    values: Array.from({ length: questions.length })
  });

  useEffect(() => {
    if (content.requiredQuestions.length>0)
      onValidate(false);
    
    window.scrollTo({top: 0, behavior: "smooth"});
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
          labelPlacement={direction==='vertical'?'end':'bottom'}
        />
      </Grid>
    )
  }

  const handleChange = (e, index) => {
    response.current.values[index] = e.target.value;

    const n_null = response.current.values.filter((v,i) => {
      console.log(v,i)
      return content.requiredQuestions.includes(i) && (v === null || v===undefined)
    }).length
    console.log('n_null', n_null)
    onValidate(n_null === 0)
  }

  const renderQuestion = (q, index) => {
    return (
      <Grid item key={index} className='matrix-question-container'>
      <RadioGroup name={`q${index}`} value={response.current.values[index]} onChange={(e) => handleChange(e, index)}>
      <Markdown source={t(q)} escapeHtml={false} className='markdown-text' />
      <Grid container 
        direction={direction==='vertical'?'column':'row'} 
        alignItems='flex-start' 
        justify="space-between">
        {choices.map((c, j) => renderChoice(c, j))}
      </Grid>
      </RadioGroup>
      </Grid>
    ) 
  }

  return (
    <Grid container direction='column' alignItems='stretch' justify='flex-start' className='Text-container'>
      {text && 
      <Grid item>
        <Markdown source={t(text)} escapeHtml={false} className='markdown-text' />
      </Grid>
      }
      {questions
        .map((q,i) => renderQuestion(q,i))
        .reduce((q1, q2) => [q1,<Divider key={Math.random().toString()} className='matrix-spacer'/>,q2])}
    </Grid>
  );
}
