import React from 'react';

import {useParams} from 'react-router-dom';

export default function Study() {

  let { studyId } = useParams();

  return (
    <div className="study">
      Study {studyId}!
    </div>
  );
}
