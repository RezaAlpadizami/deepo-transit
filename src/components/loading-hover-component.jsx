import React from 'react';
import { Spinner } from '@chakra-ui/react';

export default function LoadingHoverComponent({ fixed = false, left, top }) {
  return (
    <div
      className={`${fixed ? 'fixed' : 'absolute'} z-[9999] right-0 top-${top || '0'} left-${
        left || '0'
      } bottom-0 overflow-hidden bg-[#f2f2f2] opacity-75 flex flex-col items-center justify-center`}
    >
      <Spinner color="blue.600" size="xl" thickness={5} />
      <h2 className="text-center text-white text-md mt-3">Loading...</h2>
    </div>
  );
}
