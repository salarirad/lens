import React, { useEffect, useState } from 'react';

import {Grid, Button} from '@material-ui/core';
import Markdown from 'react-markdown';
import {useTranslation} from 'react-i18next';

export default function Submission({submission, studyId, submissionNote}) {

  const {t} = useTranslation();
  const submissionApi = `http://cut-lens.herokuapp.com/v1/${studyId}/responses`;

  const [state, setState] = useState({
    submissionCode: undefined,
    debug: process.env.NODE_ENV !== 'production',
  });

  // submit and set submissionCode
  useEffect(() => {
    if (state.submissionCode === undefined) {
      fetch(submissionApi, {
        method: 'post',
        //mode: 'no-cors',
        body: JSON.stringify(submission),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(resp => resp.json())
        .then(respJson => setState({...state, submissionCode: respJson.submissionCode}))
        .catch(error => console.error('Error:', error));
    }
  },[state]);

  return (
    <Grid container direction='column' className='Text-container'>
      
      {state.submissionCode &&
      <Grid item xs className="submission-container">
        <Markdown source={t(submissionNote, {submissionCode: state.submissionCode})} escapeHtml={false} />
      </Grid>
      }

      {state.debug && 
      <Grid item xs>
        <pre>{JSON.stringify(submission, null, 2)}</pre>
      </Grid>
      }

    </Grid>
  );
}
