import React, { Fragment } from 'react';

import {Link, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import theme from './utils/theme';

import {Grid, Paper, ThemeProvider, CssBaseline, Container} from '@material-ui/core';

import Markdown from 'react-markdown/with-html';

import {languages} from './utils/i18n';

import './index.css'

export default function LanguageSelector(props) {

  const {t, i18n} = useTranslation();
  let {studyId} = useParams();


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Container maxWidth="sm" className='study-container'>
        <Grid item container
          spacing={2}
          direction="column"
          justify="flex-start"
          alignItems="stretch"
        >
          <Paper className='languages-container'>

          <Markdown source={t('language_selector.text')} escapeHtml={false} />
          <Grid container direction='column'>
          {Object.entries(languages).map(([key, val]) => 
            <Grid item key={key}><Link to={`/${studyId}/${key}`}>{val}</Link></Grid>
          )}
          </Grid>
          </Paper>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
