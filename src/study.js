import React, {useState, useEffect} from 'react';

import {useParams} from 'react-router-dom';

import {Container, ThemeProvider, CssBaseline, LinearProgress, Grid, Paper, createMuiTheme, responsiveFontSizes} from '@material-ui/core';

import Navigation from './navigation';
import Text from './text';
import Matrix from './matrix';
import Submission from './submission';
import BART from './bart';


export default function Study(props) {

  let {studyId} = useParams();

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
  const [showNav, setShowNav] = useState(true);

  let theme = responsiveFontSizes(createMuiTheme());

  const storeData = (data) => {
    console.log('study.storeData');
    setResponses(responses.concat([data]));
    setStoringData(false);
  }

  const onNext = () => {
    console.log('study.onNext');
    setStoringData(true);

    const nextViewIndex = currentViewIndex + 1;

    setProgress(100 * nextViewIndex / experiment.views.length);

    if (nextViewIndex < experiment.views.length) {
      setView(experiment.views[nextViewIndex])
      setCurrentViewIndex(nextViewIndex)  
    } else {
      setFinished(true);
    }

  }
  
  const renderView = (view) => {

    if (finished) {
      return <Submission submission={responses} />;
    }

    switch(view?.type) {
      case 'text': 
        return <Text onNext={storeData} content={view}>{props.children}</Text>;
      case 'bart': 
        return <BART onStore={storeData} onFinish={onNext} content={view} showStudyNav={setShowNav}>{props.children}</BART>;
      case 'matrix':
        return <Matrix onNext={storeData} content={view}></Matrix>
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
          {!finished && storingData && <div>loading...</div>}
          {!storingData && renderView(view)}
          </Paper>
        </Grid>
        { showNav && !storingData &&
        <Grid item>
          <Navigation onNext={onNext} finished={finished}/>
        </Grid>
        }
      </Grid>
    </Container>
    </ThemeProvider>
  );
}
