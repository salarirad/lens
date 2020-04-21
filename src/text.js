import React, { useRef, useEffect, useState, Fragment } from 'react';
import { Typography, Divider, Box, TextField, Grid } from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';

import { useTranslation } from 'react-i18next';

import Markdown from 'react-markdown/with-html';

import countries from './utils/countries';

export default function Text({content, onStore}) {
  //props: title, text, placeholder, help, required, pattern, instruction, autoComplete

  const { t } = useTranslation();

  const response = useRef(null);
  const [state, setState] = useState({
    value: null
  });


  useEffect(() => {
    return () => {
      onStore({
        'view': content,
        'response': response.current.code
      })
    };
  },[]);


  const handleChange = (e, value) => {
    response.current = value
    setState({...state, value: response.current});
  }


  // ISO 3166-1 alpha-2
  // No support for IE 11
  const countryToFlag = (isoCode) => {
    return typeof String.fromCodePoint !== 'undefined'
      ? isoCode
          .toUpperCase()
          .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
      : isoCode;
  }

  const getLabel = (country) => {
    return (
      <React.Fragment>
        <span>{countryToFlag(country.code)}</span>
        {country.label}
      </React.Fragment>
    );
  }

  const CountrySelect = () => {

    return (
      <Autocomplete
        id="country-select"
        options={countries}
        autoHighlight
        fullWidth
        onChange={handleChange}
        value={state.value}
        getOptionLabel={(option) => option.label}
        noOptionsText={t('no_options')}
        renderOption={(option) => getLabel(option)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('choose_a_country')}
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      />
    );
  }


  return (
    <Grid container direction='column' spacing={2} alignItems='stretch' justify='flex-start' className='Text-container'>
      <Grid item>
        <Markdown source={t(content.text)} escapeHtml={false} className='markdown-text' />
      </Grid>

      {!(content.instruction || false) &&
        <Grid item>
          {content.autoComplete === 'countries' && <CountrySelect />}
          {!content.autoComplete && <TextField label={t(content.placeholder)} variant="filled" fullWidth onChange={handleChange} />}
        </Grid>
      }
    </Grid>
  );
}
