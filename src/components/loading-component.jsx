import React from 'react';
import { Spinner } from '@chakra-ui/react';

function LoadingHover(props) {
  const { visible, text = 'Please Wait ...' } = props;
  return visible ? (
    <div className="fixed  right-0 top-0 left-0 bottom-0 z-[999] bg-gray-700 opacity-75 flex flex-col items-center justify-center">
      <Spinner thickness="7px" speed="0.7s" emptyColor="gray.300" color="blue.500" width="70px" height="70px" />;
      <p className="text-[#fff] ml-3 font-semibold">{text}</p>
    </div>
  ) : null;
}

export default LoadingHover;
