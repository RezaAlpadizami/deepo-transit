import React from 'react';
import { Spinner } from '@chakra-ui/react';

export default function LoadingHoverComponent({ fixed = false }) {
  return (
    <div
      className={`${
        fixed ? 'fixed' : 'absolute'
      } z-[9999] right-0 top-0 left-0 bottom-0 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center`}
    >
      <Spinner color="blue.600" size="xl" thickness={5} />
      <h2 className="text-center text-white text-md mt-3">Loading...</h2>
    </div>
  );
}
