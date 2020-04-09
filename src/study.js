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

  const [subjectId, setSubjectId] = useState(0);
  const [session, setSession] = useState({});
  const [view, setView] = useState({});
  const [experiment, setExperiment] = useState({});
  const [responses, setResponses] = useState([]);
  const [showProgress, setShowProgress] = useState(true);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [storingData, setStoringData] = useState(false);
  const [progress, setProgress] = useState(0);

  const storeData = (data, autoNext=false) => {
    if (autoNext) {
      onNext();
    }
    console.log('study.storeData', data);
    setResponses(responses.concat([data]));
    setStoringData(false);
  }

  const onNext = () => {
    console.log('study.onNext');
    setStoringData(true);

    const nextViewIndex = currentViewIndex + 1;

    setProgress(100 * nextViewIndex / experiment.views.length);

    if (nextViewIndex < experiment.views.length) {
      setView(experiment.views[nextViewIndex]);
      setCurrentViewIndex(nextViewIndex);
    } else {
      setFinished(true);
    }

  }
  
  const renderView = (view) => {

    if (finished) {
      return <Submission submission={{responses: responses}} studyId={studyId} submissionNote={experiment.submissionNote} />;
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
    setExperiment(experiment);
    setCurrentViewIndex(0);
    setView(experiment.views[currentViewIndex]);
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

      {showProgress && <LinearProgress variant="determinate" value={progress} />}

    <Container maxWidth="sm" className='study-container'>
      <Grid container
        spacing={2}
        direction="column"
        justify="flex-start"
        alignItems="stretch"
      >
        <Grid item>
          <Paper className='view-container'>
          {!finished && storingData && <div>{t('loading')}</div>}
          {!storingData && renderView(view)}
          </Paper>
        </Grid>
        {!['gonogo','bart','stroop'].includes(view.type) && !storingData &&
        <Grid item>
          <Navigation onNext={onNext} finished={finished} redirectTo={experiment.redirectTo} />
        </Grid>
        }
      </Grid>
    </Container>
    </ThemeProvider>
  );
}
