import React, { Fragment } from 'react';

import {Link, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

export default function LanguageSelector(props) {

  const {t, i18n} = useTranslation();
  let {studyId} = useParams();


  return (
    <Fragment>
      <div>Please select a language fromt the list below.</div>
      <Link to={`/en/${studyId}`}>English</Link><br />
      <Link to={`/fa/${studyId}`}>Farsi</Link>
    </Fragment>
  );
}
