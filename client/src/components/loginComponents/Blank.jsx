import React, { useEffect } from 'react';

function Blank(props) { 
  const { showXButton } = props;

  useEffect(() => {
    showXButton(true);
  });

  return (
    <>
    </>
  );
}

export default Blank;
