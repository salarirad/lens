import React, { useState, useEffect, Fragment } from 'react';


import { Button, Grid, Divider} from '@material-ui/core';

import { 
  Star, 
  RadioButtonUnchecked as Circle, 
  Add,
  Check as Correct,
  Clear as Incorrect
} from '@material-ui/icons';

import Markdown from 'react-markdown/with-html';

import { shuffle } from './utils/random';
import { useTranslation } from 'react-i18next';

import './taskswitch.css';

export default function TaskSwitch({content, onStore, onProgress}) {

  const {t} = useTranslation();
  const {text, trials, stimuliDuration, fixationDuration, choices, timeoutsBeforeReset, feedbackDuration} = content;

  
  return (
    <Grid item container direction='column' spacing={2} alignItems='stretch' justifyContent='flex-start' className='taskswitch-container'>
      <Grid item>
        <Markdown source={t(text)} escapeHtml={false} className='markdown-text' />
      </Grid>



    </Grid>

  );

}
