import React, { useEffect, useState } from 'react';

export default function Submission(props) {

  return (
    <div className="finished">
      Submission: {JSON.stringify(props.submission)}
    </div>
  );
}
