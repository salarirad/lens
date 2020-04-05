import React, { useEffect, useState } from 'react';

import {Grid, Button} from '@material-ui/core';
import Markdown from 'react-markdown';
import {useTranslation} from 'react-i18next';

export default function Submission({submission, submissionNote}) {

  const {t} = useTranslation()
  const [state, setState] = useState({
    submissionCode: null,
    debug: process.env.NODE_ENV !== 'production'
  });

  return (
    <Grid container direction='column' className='Text-container'>
      <Grid item xs className="submission-container">
        <Markdown source={t(submissionNote, {submissionCode: state.submissionCode || 'DEMO'})} escapeHtml={false} />
      </Grid>
      {state.debug && 
      <Grid item xs>
        <pre>{JSON.stringify(submission, null, 2)}</pre>
      </Grid>
      }
    </Grid>
  );
}
