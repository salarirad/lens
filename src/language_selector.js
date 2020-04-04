import React, { Fragment } from 'react';

import {Link, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import theme from './utils/theme';

import {Grid, Paper, ThemeProvider, CssBaseline, Container} from '@material-ui/core';

import Markdown from 'react-markdown';

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
          <Link to={`/${studyId}/en`}>English</Link><br />
          <Link to={`/${studyId}/fa`}>Farsi</Link>
          </Paper>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
