import React, {useState, useEffect} from 'react';

import {useParams} from 'react-router-dom';

import {Container, ThemeProvider, CssBaseline, LinearProgress, Grid, Paper} from '@material-ui/core';

import theme from './utils/theme';

import Navigation from './navigation';
import Text from './text';
import Matrix from './matrix';
import Submission from './submission';
import BART from './bart';
import GoNoGo from './gonogo';
import Stroop from './stroop';
import { useTranslation } from 'react-i18next';

export default function Study(props) {

  const {t, i18n} = useTranslation();
  let {lang, studyId} = useParams();

  const [state, setState] = useState({
    subject: undefined,
    session: undefined,
    progress: 0,
    finished: false,
    loading: false,
    view: {},
    currentViewIndex: 0,
    responses: [],
    experiment: {}
  })

  const storeData = (data, autoNext=false) => {
    console.log('study.storeData', data);

    if (autoNext) {
      onNext();
    }
    
    setState(prev => {
      return {
        ...prev,
        responses: [...prev.responses, data],
        loading: false
      }
    });
  }

  const onNext = () => {
    console.log('study.onNext');



    setState(prev => {
      const nextViewIndex = prev.currentViewIndex + 1;

      if (nextViewIndex < prev.experiment.views.length) {  
        return {
          ...prev,
          loading: true,
          progress: 100 * nextViewIndex / prev.experiment.views.length,
          view: prev.experiment.views[nextViewIndex],
          currentViewIndex: nextViewIndex
        }
      } else { //finished
        return {
          ...prev,
          progress: 100,
          finished: true,
          loading: false
        }
      }
    })

  }
  
  const renderView = (view) => {

    if (state.finished) {
      return (
        <Submission submission={{responses: state.responses}} studyId={studyId} submissionNote={state.experiment.submissionNote} />
      );
    }

    switch(view?.type) {
      case 'text':
        return <Text onStore={storeData} content={view} key={view.id}>{props.children}</Text>;
      case 'bart':
        return <BART onStore={storeData} content={view} key={view.id} />;
      case 'gonogo': 
        return <GoNoGo onStore={storeData} content={view} key={view.id} />;
      case 'stroop': 
        return <Stroop onStore={storeData} content={view} key={view.id} />;
      case 'matrix':
        return <Matrix onStore={storeData} content={view} key={view.id} ></Matrix>
      default:
        return <div>Not Implemented!</div>;
    }

  }
  
  const startExperiment = (experiment) => {
    console.log("starting experiment", experiment);
    setState(prev => {
      return {
        ...prev,
        experiment: experiment,
        currentViewIndex: 0,
        view: experiment.views[0]
      }
    });
  }

  //load experiment
  useEffect(() => {
    i18n.changeLanguage(lang);
    fetch(process.env.PUBLIC_URL + `/experiments/${studyId}.json`)
      .then(resp => resp.json())
      .then(experiment => startExperiment(experiment));
  },[studyId]);

  //render
  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />

      <LinearProgress variant="determinate" value={state.progress} />

    <Container maxWidth="sm" className='study-container'>
      <Grid container
        spacing={2}
        direction="column"
        justify="flex-start"
        alignItems="stretch"
      >
        <Grid item>
          <Paper className='view-container'>
          {!state.finished && state.loading && <div>{t('loading')}</div>}
          {!state.loading && renderView(state.view)}
          </Paper>
        </Grid>
        {!['gonogo','bart','stroop'].includes(state.view.type) && !state.loading &&
        <Grid item>
          <Navigation onNext={onNext} finished={state.finished} redirectTo={state.experiment.redirectTo} />
        </Grid>
        }
      </Grid>
    </Container>
    </ThemeProvider>
  );
}
