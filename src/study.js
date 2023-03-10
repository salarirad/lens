import React, {useRef, useState, useEffect} from 'react';

import {useParams,useLocation} from 'react-router-dom';

import {Container, ThemeProvider, CssBaseline, LinearProgress, Grid, Paper, Snackbar} from '@material-ui/core';
import {Alert} from '@material-ui/lab';

import {ltrTheme, rtlTheme} from './utils/theme';
import {languages} from './utils/i18n';

import Navigation from './navigation';
import Text from './text';
import Matrix from './matrix';
import Submission from './submission';
import BART from './bart';
import GoNoGo from './gonogo';
import Stroop from './stroop';
import Ultimatum from './ultimatum';
import Dictator from './dictator';
import { useTranslation } from 'react-i18next';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Study(props) {

  const {t, i18n} = useTranslation();
  let {lang, studyId} = useParams();

  // prolific shits
  let query = useQuery();

  const theme = (languages[lang].direction === 'rtl')?rtlTheme:ltrTheme;
  const responseIsValid = useRef(false);

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

  const [notification, setNotification] = useState(undefined);

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

  const updateViewProgress = (currentViewProgressPct) => {

    const currentViewProgress = currentViewProgressPct  / 100.0

    setState(prev => {
      return {
        ...prev,
        progress: 100 * (prev.currentViewIndex + currentViewProgress) / 
                  prev.experiment.views.length
                  
      }
    });
  }

  const onNext = () => {

    if ((state.view.required || state.view.requiredQuestions?.length>0) && !responseIsValid.current) {
      setNotification(t('errors.required'))
      return;
    }

    responseIsValid.current = false;

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
        <Submission submission={{
          PROLIFIC_PID: query.get('PROLIFIC_PID'),
          STUDY_ID: query.get('STUDY_ID'),
          SESSION_ID: query.get('SESSION_ID'),
          startedAt: state.startedAt,
          responses: state.responses}}
          studyId={studyId} submissionNote={state.experiment.submissionNote} />
      );
    }

    switch(view?.type) {
      case 'text':
        return <Text onStore={storeData} content={view} key={view.id} onValidate={(r) => responseIsValid.current = r} />;
      case 'bart':
        return <BART onStore={storeData} content={view} key={view.id} />;
      case 'gonogo': 
        return <GoNoGo onStore={storeData} onProgress={updateViewProgress} content={view} key={view.id} />;
      case 'stroop': 
        return <Stroop onStore={storeData} content={view} key={view.id} />;
      case 'matrix':
        return <Matrix onStore={storeData} content={view} key={view.id} onValidate={(r) => responseIsValid.current = r} />
      case 'ultimatum':
        return <Ultimatum onStore={storeData} content={view} key={view.id} onNotification={setNotification} />;
      case 'dictator':
        return <Dictator onStore={storeData} content={view} key={view.id} onNotification={setNotification} />;
      default:
        return <div>Not Implemented!</div>;
    }

  }
  
  const startExperiment = (experiment) => {
    console.log("starting experiment", experiment);
    console.log("prolific pid : ",query.get('PROLIFIC_PID'))
    setState(prev => {
      return {
        ...prev,
        startedAt: Date.now(),
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
      <div dir={languages[lang].direction}>
        <CssBaseline />

        <LinearProgress variant="determinate" value={state.progress} />

        <Container maxWidth="sm" className='study-container'>
          <Grid container
            spacing={2}
            direction="column"
            justifyContent="flex-start"
            alignItems="stretch"
            className='study-grid-container'
          >
            <Snackbar 
              open={notification !== undefined} 
              autoHideDuration={5000} 
              onClose={() => setNotification(undefined)}
            >
              <Alert onClose={() => setNotification(undefined)} severity="error">{t(notification)}</Alert>
            </Snackbar>

            <Grid item>
              <Paper className='view-container'>
              {!state.finished && state.loading && <div>{t('loading')}</div>}
              {!state.loading && renderView(state.view)}
              </Paper>
            </Grid>
            {!['gonogo','bart','stroop','ultimatum','dictator'].includes(state.view.type) && !state.loading &&
            <Grid item>
              <Navigation onNext={onNext} finished={state.finished} redirectTo={state.experiment.redirectTo} />
            </Grid>
            }
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  );
}
