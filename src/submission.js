import React, { useEffect, useState } from 'react';

export default function Submission(props) {

  return (
    <div className="finished">
      Submission: <br />
      <pre>{JSON.stringify(props.submission, null, 2)}</pre>
    </div>
  );
}
