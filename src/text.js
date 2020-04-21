import React, { useRef, useEffect, useState, Fragment } from 'react';
import { Typography, Divider, Box, TextField, Grid } from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';

import { useTranslation } from 'react-i18next';

import Markdown from 'react-markdown/with-html';

import countries from './utils/countries';

export default function Text({content, onStore}) {
  //props: title, text, placeholder, help, required, pattern, instruction, autoComplete
  //i18n: text.choose_a_country, text.no_options

  const { t } = useTranslation();

  const response = useRef(null);
  const [state, setState] = useState({
    value: null
  });


  useEffect(() => {
    return () => {
      onStore({
        'view': content,
        'response': response.current?.code || response.current
      })
    };
  },[]);


  const handleChange = (e, value) => {
    response.current = value
    setState({...state, value: response.current});
  }


  /**
   * Componenet to select a country from a dropdown list.
   * Enable this feature by adding `autoComplete:'coutries'` to the view.
   */
  const CountryAutoComplete = () => {

    // ISO 3166-1 alpha-2 (No support for IE 11)
    const countryToFlag = (isoCode) => {
      return typeof String.fromCodePoint !== 'undefined'
        ? isoCode
            .toUpperCase()
            .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
        : isoCode;
    }

    return (
      <Autocomplete
        id="country-select"
        options={countries}
        autoHighlight
        onChange={handleChange}
        value={state.value}
        getOptionLabel={(option) => option.label}
        noOptionsText={t('text.no_options')}
        renderOption={(option) => (
          <Fragment>
            <span>{countryToFlag(option.code)}</span> {option.label}
          </Fragment>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('text.choose_a_country')}
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
            className='country-select'
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
          {content.autoComplete === 'countries' && <CountryAutoComplete />}
          {!content.autoComplete && <TextField label={t(content.placeholder)} variant="filled" fullWidth onChange={handleChange} />}
        </Grid>
      }
    </Grid>
  );
}
