import React from 'react';
import ReactDOM from 'react-dom';
import i18n from './utils/i18n';
import AppRouter from './router';
import {I18nextProvider} from 'react-i18next';


//css
import './index.css';

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <AppRouter />
  </I18nextProvider>
  , document.getElementById('root'));
