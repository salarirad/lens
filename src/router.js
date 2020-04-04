import React from 'react';

import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

//main components
import Study from './study';
import About from './about';
import LanguageSelector from './language_selector';

export default function AppRouter() {
  return (
    <Router basename="/">
        <Switch>
          <Route exact path="/"><About /></Route>
          <Route path="/:lang/:studyId"><Study /></Route>
          <Route path="/:studyId"><LanguageSelector /></Route>
          <Route path="/about"><About /></Route>
        </Switch>
    </Router>
  );
}
