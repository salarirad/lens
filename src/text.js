import React, { useEffect, useState } from 'react';

export default function Text(props) {

  const [data] = useState({value: props.content.text});
  //props: title, text, placeholder, help, required

  //to store data on pressing next
  useEffect(() => {
    // store data as a cleanup side-effect (on WillUnmount)
    return () => { props.onNext(data) };
  },[data, props]);

  return (
    <div className="text">
      {props.content.text}
    </div>
  );
}
