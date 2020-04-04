import React, { Fragment } from 'react';

import {Button, Grid} from '@material-ui/core';

import {useTranslation} from 'react-i18next';

export default function Navigation(props) {

  const {t} = useTranslation();

  return (
    <Grid container direction='row' justify='flex-end'>
      <Grid item>
        {!props.finished && 
          <Button variant="contained" color="primary" onClick={props.onNext}>{t('next')}</Button>
        }
      </Grid>
    
    </Grid>
  );
}