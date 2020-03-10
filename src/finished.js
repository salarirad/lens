import React, { useEffect, useState } from 'react';

export default function Finished(props) {

  return (
    <div className="finished">
      Submission: {JSON.stringify(props.submission)}
    </div>
  );
}
