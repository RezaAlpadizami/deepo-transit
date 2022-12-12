import React from 'react';
import { FormControl } from '@chakra-ui/react';

const inputDetailComponent = props => {
  const { label, value, swapBold, customStyleLabel, customStyleSpan } = props;
  return (
    <FormControl className="flex-auto w-full mt-3">
      <label
        className={
          customStyleLabel
            ? `block mb-2 ${customStyleLabel}`
            : `text-sm block mb-2 ml-1 ${swapBold ? 'text-gray-500' : 'font-bold text-[#212121]'} `
        }
      >
        {label}
      </label>
      <span
        className={
          customStyleSpan
            ? `mt-2 mb-3 ${customStyleSpan}`
            : `d-block text-muted mt-2 mb-3 ${swapBold ? 'text-[#212121] font-semibold ml-1' : 'text-gray-500 ml-2.5'}`
        }
        style={{ fontSize: '14px' }}
      >
        {value}
      </span>
    </FormControl>
  );
};

export default inputDetailComponent;
