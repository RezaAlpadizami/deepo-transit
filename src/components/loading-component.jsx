import React from 'react';
import { Spinner } from '@chakra-ui/react';

function LoadingHover(props) {
  const { visible = false, text = 'Please Wait ...' } = props;
  return visible ? (
    <div className="h-full z-[999] opacity-75 flex flex-col items-center justify-center">
      <Spinner thickness="5px" speed="0.5s" emptyColor="gray.50" color="blue.400" width="70px" height="70px" />
      <p className="text-[#fff] ml-3 font-semibold">{text}</p>
    </div>
  ) : null;
}

export default LoadingHover;
