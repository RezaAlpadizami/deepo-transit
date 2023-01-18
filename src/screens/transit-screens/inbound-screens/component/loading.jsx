import React from 'react';
import { Spinner } from '@chakra-ui/react';

function LoadingHover(props) {
  const { visible = false, text = 'Please Wait ...', isLarge } = props;
  return visible ? (
    <div
      className={`absolute ${
        isLarge ? 'right-7 left-[52%]' : 'right-8 left-8'
      } bg-gray-100 z-[999]  opacity-75 flex flex-col items-center justify-center`}
    >
      <Spinner thickness="5px" speed="0.5s" emptyColor="gray.50" color="blue.400" width="70px" height="70px" />
      <p className="text-[#000] ml-3 font-semibold">{text}</p>
    </div>
  ) : null;
}

export default LoadingHover;
