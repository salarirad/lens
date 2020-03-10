import React, { Fragment } from 'react';

import {Button} from '@material-ui/core';

export default function ControlButtons(props) {

  return (
    <Fragment>
    {!props.finished && <Button onClick={props.onNext}>Next</Button>}
    </Fragment>
  );
}